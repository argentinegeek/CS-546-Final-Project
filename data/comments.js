const mongoCollections = require("../config/mongoCollections");
const user = require("./users");
const song = require("./songs");
const { ObjectId } = require("mongodb");
const users = mongoCollections.users;
const songs = mongoCollections.songs;
const validation = require("../helpers");



const createComment = async (songId, userId, comment, commentRating) => {
    if (!comment || !commentRating || !songId || !userId) {
        throw "must enter an comment and rating";
    }

    songId = validation.checkId(songId, "ID");
    userId = validation.checkId(userId, "ID");

    if (typeof comment !== "string") {
        throw "comment must be a string";
    }

    if (typeof commentRating !== 'number') {
        throw "rating must be a number"
    }

    if (commentRating < 1 || commentRating > 5) {
        throw "rating must be 1-5"
    }


    //validation is done

    //creates a comment object
    let newSongReview = {
        _id: ObjectId(),
        userId: userId,
        rating: commentRating,
        content: comment,
        likes: 0,
        dislikes: 0,
        usersInteractions: [],
    };

    //find the user and push the comment into it
    let userFound = await user.getUserById(userId);
    if (!userFound) {
        throw "user is not found";
    }

    //all the users comments, they've made
    let userComments = userFound.songReviews;
    //the commentId pushed into the array of comments
    userComments.push(newSongReview["_id"].toString());

    //update the user to have the new comment(s)
    const userCollection = await users();
    let updateUser = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $set: { songReviews: userComments } }
    )

    //check if the user was updated
    if (!updateUser.modifiedCount === 0) throw `Could not update song successfully`;

    //find the song and push the song into it
    const songFound = await song.getSongById(songId)

    if (songFound === null) throw `No song with id: ${songId}`;

    //all the comments under that song
    let songComments = songFound.comments;

    songComments.push(newSongReview);

    //update the overall rating of the songs
    let sumOfRatings = 0;

    //for the length of the song's comment [], add its rating to sumOfRatings
    for (let i = 0; i < songComments.length; i++) {
        sumOfRatings += songComments[i].rating;
    }

    //calculate overallRating
    let finalRating = parseFloat((sumOfRatings / songComments.length).toFixed(2));

    const songCollection = await songs();
    let updateSong = await songCollection.updateOne(
        { _id: ObjectId(songId) },
        { $set: { comments: songComments, overallRating: finalRating } }
    )

    //check if the user was updated
    if (updateSong.modifiedCount === 0) throw `Could not update song successfully`;

    return newSongReview;
};

const getAllComments = async (songId) => {

    songId = validation.checkId(songId, "ID");

    const songCollection = await songs();

    let song = await songCollection.findOne({ _id: ObjectId(songId) });
    if (song === null) throw `No song with id: ${songId}`;

    const allSongs = song.comments;

    return allSongs;
}

const getComment = async (commentId) => {
    commentId = validation.checkId(commentId, "ID");

    const songCollection = await songs();

    let allSongs = await songCollection.find({}).toArray();
    if (!allSongs) throw "Could not get all songs";

    const allComments = allSongs.map((elem) => elem.comments).flat();

    const grabComment = allComments.filter((elem) => elem["_id"].toString() === commentId.trim());

    return grabComment;
};

const deleteComment = async (commentId, userId, songId) => {
    commentId = validation.checkId(commentId, "ID");
    userId = validation.checkId(userId, "ID");

    //find the user
    let userFound = await user.getUserById(userId);
    if (!userFound) {
        throw "user is not found";
    }

    //deleting the interactions before deleting the comment
    removeAllinteractions(commentId, songId);

    //go into the user database and pulling out the comment 
    const userCollection = await users();
    let currentSongReviews = userFound.songReviews;

    for (let i = 0; i < currentSongReviews.length; i++) {
        if (currentSongReviews[i] === commentId) {
            currentSongReviews.splice(i, 1);
            break;
        }
    }

    const updateUser = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $set: { songReviews: currentSongReviews } }
    )

    if (updateUser.modifiedCount === 0) {
        throw "could not remove comment from user's post"
    }

    //removing from the song side

    //find the song
    let songFound = await song.getSongById(songId)
    if (!songFound) {
        throw "song is not found";
    }

    //find that specific comment in the song and get all the users that interacted with it
    let currentComments = songFound.comments;
    //is the current comment[i]._id the same id as the interaction id
    for (let i = 0; i < currentComments.length; i++) {

        if (currentComments[i]._id.toString() === commentId) {
            currentComments.splice(i, 1);
            break;
        }
    }

    //update song with that updated comment
    const songCollection = await songs();

    const updateSong = await songCollection.updateOne(
        { _id: ObjectId(songId) },
        { $set: { comments: currentComments } }
    )

    if (updateSong.modifiedCount === 0) {
        throw "could not remove interaction from songs"
    }

    return "comment removed successfully";

}

const createUserInteraction = async (commentId, userId, songId, interactionType) => {
    commentId = validation.checkId(commentId, "ID");
    userId = validation.checkId(userId, "ID");
    songId = validation.checkId(songId, "ID");
    if (interactionType === undefined || typeof interactionType !== "boolean") {
        throw "interaction must be a boolean"
    }

    //validation done

    let newUI = {
        _id: ObjectId(),
        commentId: commentId,
        userId: userId,
        interactionType: interactionType,
    };

    //finds the user interacting
    let findUser = await user.getUserById(userId);

    if (!findUser) {
        throw "user cannot be found";
    }

    //gets the userInteraction array
    let profile = findUser.commentInteractions;

    profile.push(commentId); //pushing userinteraction id into the user's commentInteractions


    let userCollection = await users();
    let parseUser = ObjectId(userId);

    let count = 0;
    for (let i = 0; i < profile.length; i++) {
        if (profile[i] === commentId) {
            count++;
        }
    }
    if (count > 1) {
        throw "you can only downvote or upvote";
    }

    //update from the user side
    const updateUser = await userCollection.updateOne(
        { _id: parseUser },
        { $set: { commentInteractions: profile } }
    )

    if (updateUser.modifiedCount === 0) throw `Could not update user successfully`;

    //find the specific comment
    let findComment = await getComment(commentId);

    //getComment returns an array of Comment Objects 
    if (findComment.length === 0) {
        throw "comment cannot be found";
    }

    //isolate the UI
    let currentUI = findComment[0];

    currentUI.usersInteractions.push(newUI);

    //if interactionType true = like, false = dislike
    if (interactionType) {
        currentUI.likes += 1;
    } else {
        currentUI.dislikes += 1;
    }

    //update from the song side
    let songCollection = await songs();
    const updateSong = await songCollection.updateOne(
        { _id: ObjectId(songId), "comments._id": ObjectId(commentId) },
        { $set: { "comments.$": currentUI } }
    )

    if (updateSong.modifiedCount === 0) throw `Could not update song successfully`;

    return newUI;
}

const removeInteraction = async (commentId, userId, songId, interactionId) => {
    commentId = validation.checkId(commentId, "ID");
    userId = validation.checkId(userId, "ID");
    songId = validation.checkId(songId, "ID");

    //validation done

    //removing the interaction from the user side
    //find the user
    let userFound = await user.getUserById(userId);
    if (!userFound) {
        throw "user is not found";
    }

    //go into the user database and pulling out the comment 
    const userCollection = await users();
    let currentSongReviews = userFound.commentInteractions;

    for (let i = 0; i < currentSongReviews.length; i++) {
        if (currentSongReviews[i] === interactionId) {
            //takes out the interaction from that comment
            currentSongReviews.splice(i, 1);
            break;
        }
    }

    const updateUser = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $set: { commentInteractions: currentSongReviews } }
    )

    if (updateUser.modifiedCount === 0) {
        throw "could not remove interaction from users"
    }

    //removing the interaction from the song side
    let songFound = await song.getSongById(songId)
    if (!songFound) {
        throw "song is not found";
    }

    //find that specific comment in the song and get all the users that interacted with it
    let currentComments = songFound.comments.usersInteractions;

    //is the current comment[i]._id the same id as the interaction id
    for (let i = 0; i < currentComments.length; i++) {

        if (currentComments[i]._id.toString() === interactionId) {
            currentComments.splice(i, 1);
            break;
        }
    }

    //update song with that updated comment
    const songCollection = await songs();

    const updateSong = await songCollection.updateOne(
        { _id: ObjectId(songId), "comments._id": ObjectId(commentId) },
        { $set: { usersInteractions: currentComments } }
    )

    if (updateSong.modifiedCount === 0) {
        throw "could not remove interaction from songs"
    }

    return "interaction removed successfully";

}

//removes all interaction from the comment and registered user
const removeAllinteractions = async (commentId, songId) => {
    commentId = validation.checkId(commentId, "ID");
    songId = validation.checkId(songId, "ID");

    //check to make sure the song is in db
    let songFound = await song.getSongById(songId)
    if (!songFound) {
        throw "song is not found";
    }

    // getting DB
    const songCollection = await songs();
    const userCollection = await users();

    //find the comment to remove interactions from
    let currentComment = await getComment(commentId);
    //all the interactions in the comment
    let interactions = currentComment[0].usersInteractions;
    let empty = [];

    const updateSong = await songCollection.updateOne(
        { _id: ObjectId(songId), "comments._id": ObjectId(commentId) },
        { $set: { "comments.$.usersInteractions": empty, "comments.$.likes": 0, "comments.$.dislikes": 0 } }
    )

    if (updateSong.modifiedCount === 0) {
        throw "could not remove interaction from songs"
    }

    //array of userID's that interacted with the comment
    let userIds = [];

    for (let interaction of interactions) {
        userIds.push(interaction.userId);
    }
    console.log(userIds);

    for (let i = 0; i < userIds.length; i++) {
        let updateUser = await userCollection.updateOne(
            { _id: ObjectId(userIds[i]) },
            { $pull: { commentInteractions: { $in: [commentId] } } }
        )
        if (updateUser.modifiedCount === 0) {
            throw "could not remove interaction from user's commentInteractions";
        }
    }

    return "successfully deleted all interactions";

}

module.exports = {
    createComment,
    getAllComments,
    getComment,
    deleteComment,
    createUserInteraction,
    removeInteraction,
    removeAllinteractions
};