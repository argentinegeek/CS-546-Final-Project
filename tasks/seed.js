const connection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const songs = data.songs;
const comments = data.comments;

async function main() {
    //first two lines
    const db = await connection.dbConnection();
    await db.dropDatabase();

    //creating users
    const user1 = await users.createUser("Mya", "Phu", "mxfu", "KevinsucksD32!", "KevinsucksD32!");
    let parseUser1 = user1["_id"].toString();
    await users.createAdmin(parseUser1);

    const user2 = await users.createUser("Serena", "Lee", "cargi", "Meow123!", "Meow123!");
    let parseUser2 = user2["_id"].toString();
    await users.createAdmin(parseUser2);

    //creating songs
    let song1 = await songs.postSong(parseUser1, "Ghost", "Justin Bieber", ["Pop", "Rap"], [["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"]])
    let parseSong1 = song1["_id"].toString();
    let song2 = await songs.postSong(parseUser2, "Gone Girl", "SZA ", ["Disco", "RnB"], [["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"]])
    let parseSong2 = song2["_id"].toString();

    //creating comments
    let comment1 = await comments.createComment(parseSong1, parseUser1, "I love this song", 5);
    let comment2 = await comments.createComment(parseSong1, parseUser2, "I have this song", 3);
    let comment3 = await comments.createComment(parseSong1, parseUser2, "It's mid, this song", 2);
    let comment4 = await comments.createComment(parseSong2, parseUser2, "Amazing, im gone", 4);
    let comment5 = await comments.createComment(parseSong2, parseUser1, "SZA does it again", 5);
    let parseComment1 = comment1["_id"].toString();
    let parseComment2 = comment2["_id"].toString();
    let parseComment3 = comment3["_id"].toString();
    let parseComment4 = comment4["_id"].toString();
    let parseComment5 = comment5["_id"].toString();



    //testing comment functions (minus deleteComment)
    let testGetComment = await comments.getComment(parseComment1);
    let testGetAllComments = await comments.getAllComments(parseSong1);

    //creating user interactions
    let userInteraction1 = await comments.createUserInteraction(parseComment1, parseUser1, parseSong1, true);
    let userInteraction2 = await comments.createUserInteraction(parseComment1, parseUser2, parseSong1, false);
    let userInteraction3 = await comments.createUserInteraction(parseComment2, parseUser1, parseSong1, false);
    let userInteraction4 = await comments.createUserInteraction(parseComment4, parseUser1, parseSong2, true);
    let userInteraction5 = await comments.createUserInteraction(parseComment4, parseUser2, parseSong2, true);


    let parseInteraction1 = userInteraction1["_id"].toString();

    //testing if delete comment works: working
    // let testDeleteComment = await comments.deleteComment(parseComment2, parseUser2, parseSong1);

    //testing if deleteinteraction works: working
    //let testDeleteInteraction = await comments.removeInteraction(parseComment1, parseUser1, parseSong1, parseInteraction1);

    //testing removeAllInteractions
    let testRemoveAllUI = await comments.removeAllinteractions(parseComment4, parseSong2);

    //last two lines
    //await connection.closeConnection();
    console.log("Done!");
}


main().catch((error) => {
    console.log(error);
});