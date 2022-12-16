// functions for songs
const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;
const users = mongoCollections.users;
const {ObjectId} = require("mongodb");
const validation = require("../helpers");
const user = require("./users");
const platforms = ["Youtube", "Soundcloud", "Apple Music", "Spotify", "Tidal"];

/**
 * creates song post
 * @param {*} posterId : ObjectId of admin user who is posting song - string
 * @param {*} title : title of song - string
 * @param {*} artist : name of artist - string
 * @param {*} genres : list of genres - array
 *  genres are strings containing letters and punctuation (-/&)
 * @param {*} links : list of url links to listen to songs - array of arrays [platform, link]
 *  platform is a string
 *  link is an url entered as strings
 */
const postSong = async (posterId, title, artist, genres, links) => {
  // checking if all inputs exist
  if (!posterId || !title || !artist || !genres || !links)
    throw "All fields need to have values";
  //checking if inputs are ok
  if (typeof posterId !== "string") throw "invalid data type";
  if (validation.validString(posterId.trim())) posterId = posterId.trim();
  if (!ObjectId.isValid(posterId)) throw "Poster does not have valid ObjectId";
  let admin = await user.isAdmin(posterId);
  if (!admin) throw "Not admin"; // checking if admin
  if (typeof title !== "string") throw "invalid data type";
  if (validation.validString(title.trim())) title = title.trim();
  if (typeof artist !== "string") throw "invalid data type";
  if (validation.validString(artist.trim())) artist = artist.trim();
  if (validation.validArray(genres, 1, "string")) {
    for (let genre of genres) {
      if (validation.validString(genre.trim())) {
        if (validation.hasNumbers(genre.trim()))
          throw "Genre cannot contain numbers";
        genre = genre.trim();

        // testing for invalid characters
        let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
        let badEntry = badChars.test(genre);
        if (badEntry)
          throw `Genres must contain only alphabetical characters and/or -/&`;
      }
    }
  }
  if (validation.validArray(links, 1)) {
    // checking link pairs
    for (let link of links) {
      if (validation.validArray(link, 1, "string") && link.length === 2) {
        // checking platform
        let platformLink;
        if (validation.validString(link[0].trim()))
          platformLink = link[0].trim();

        if (
          platforms.find(
            (element) => element.toLowerCase() === platformLink.toLowerCase()
          ) === undefined
        )
          throw "Invalid Platform";
        // checking url
        let urlLink;
        if (validation.validString(link[1].trim())) urlLink = link[1].trim();
        // testing for whitespace
        if (validation.hasSpace(urlLink)) throw "Links cannot contain spaces";
      } else {
        throw `Links array must be of form [[<platform>, <url>], ...] and be only arrays of strings`;
      }
    }
  }

  // getting DB
  const songCollection = await songs();
  const userCollection = await users();

  // creating song object
  let newSong = {
    posterId: posterId,
    title: title,
    artist: artist,
    genres: genres,
    overallRating: 0,
    comments: [],
    listenLinks: links,
  };

  //inserting song
  const insertInfo = await songCollection.insertOne(newSong);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add song";
  const newId = insertInfo.insertedId.toString();

  //testing input
  let song = await getSongById(newId);
  song._id = song._id.toString();

  // updating poster
  const updatedInfo = await userCollection.updateOne({_id: ObjectId(posterId)}, {$push: {songPosts: song._id}});
  if (updatedInfo.modifiedCount === 0) throw `Could not update poster ${posterId}`;

  // outputting newly made song
  return song;
};

/**
 * returns all song objects from DB in an array
 */
const getAllSongs = async () => {
  // getting all songs
  let songCollection = await songs();
  let songList = await songCollection.find({}).toArray();
  if (!songList) throw "Could not get all songs";

  // turning songIds to string form
  for (let i = 0; i < songList.length; i++) {
    songList[i]._id = songList[i]._id.toString();
    let comments = songList[i].comments;
    for (let j = 0; j < comments.length; j++) {
      songList[i].comments[j]._id = songList[i].comments[j]._id.toString();
    }
  }
  // output
  return songList;
};

/**
 * returns the song object with _id songId
 * @param {*} songId : ObjectId of song - string
 */
const getSongById = async (songId) => {
  // input checking
  if (!songId) throw "You must provide an id to search for";
  if (typeof songId !== "string") throw "invalid data type";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid song Object ID";

  // getting song
  const songCollection = await songs();
  let song = await songCollection.findOne({ _id: ObjectId(songId) });
  if (song === null) throw `No song with id: ${songId}`;

  // formatting output
  song._id = song._id.toString();

  // output
  return song;
};

/**
 * deletes song title from artist artist
 * @param {*} songId : ObjectId of song - string
 * @param {*} userId : ID of user who requested the delete - string
 * @returns string to indicate song was deleted
 */
const deleteSong = async (songId, userId) => {
  // checking inputs
  if (!songId || !userId) throw "All fields must have values";
  // checking if user posted
  if (typeof userId !== "string") throw "invalid data type";
  let admin = await user.isAdmin(userId);
  if (!admin) throw "Not admin";
  // checking songId and nl
  if (typeof songId !== "string") throw "invalid data type";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";

  // getting DB
  const songCollection = await songs();
  const userCollection = await users();

  // getting song and individual tags
  const song = await getSongById(songId);
  const posterId = song.posterId
  const title = song.title;
  const artist = song.artist;
  const comments = song.comments;

  // deleting song from DB
  const deletionInfo = await songCollection.deleteOne({_id: ObjectId(songId)});

  if (deletionInfo.deleteCount === 0) throw `Could not delete song with id of ${songId}`;

  if (comments.length !== 0) {
    // delete comment connections for comment commentId on song
    // remove from user's songReview
    let deletes = [];
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i];
      let deleted = comment._id.toString();
      let commentId = comment._id.toString(); // id of comment
      let commenter = comment.userId;
      let interactions = comment.userInteractions; // array of userIds of people who interacted

      // remove commentId from user
      const updateCommenter = await userCollection.updateOne(
        { _id: ObjectId(commenter) },
        { $pull: { songReviews: commentId } }
      );
      if (updateCommenter.modifiedCount === 0) throw `Could not remove comment from commenter (${commenter}) profile`;
      // removing interactions
      if (interactions !== []) {
        // remove commentId from interactions
        for (const interaction in interactions) {
          let interactor = interaction.userId;
          const updateInteractor = await userCollection.updateOne(
            { _id: ObjectId(interactor) },
            { $pull: { commentInteractions: commentId } }
          );
          if (updateInteractor.modifiedCount === 0) throw `Could not remove interaction from interactor (${interactor}) profile`;
        }
      }
      deletes.push(deleted);
    }
    // deleting songId from admin's songPosts
    if (deletes.length !== comments.length)
      throw `Could not delete all comments for song ${songId}`;
  }
  // update poster
  const updatePoster = await userCollection.updateOne(
    { _id: ObjectId(posterId) },
    { $pull: { songPosts: songId } }
  );
  if (updatePoster.modifiedCount === 0)
    throw `Could not remove the song from the poster (${posterId}) profile`;

  //output
  const message = `${title} by ${artist} has been successfully deleted`;
  return message;
};

/**
 * updates the title, artist, genres, and links for song with songId
 * @param {*} songId : ObjectId of song - string
 * @param {*} userId : ObjectId of admin deleting song - string
 * @param {*} nt : New title of song - string
 * @param {*} na : New artist of song - string
 * @param {*} ng : New genres of song - array
 *  genre is a string containing letters and punctuation (-/&)
 * @param {*} nl : New list of links - array of arrays [platform, link]
 *  platform is a string
 *  link is an url entered as strings
 */
const updateAll = async (songId, userId, nt, na, ng, nl) => {
  // checking all inputs
  if (!songId || !userId || !nt || !na || !ng || !nl)
    throw "All fields need to have values";
  // checking if user posted
  if (typeof userId !== "string") throw "invalid data type";
  let admin = await user.isAdmin(userId);
  if (!admin) throw "Not admin";
  // checking songId and nl
  if (typeof songId !== "string") throw "invalid data type";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (typeof nt !== "string") throw "invalid data type";
  if (validation.validString(nt.trim())) nt = nt.trim();
  if (typeof na !== "string") throw "invalid data type";
  if (validation.validString(na.trim())) na = na.trim();
  if (validation.validArray(ng, 1, "string")) {
    for (let genre of ng) {
      if (validation.validString(genre.trim())) {
        if (validation.hasNumbers(genre.trim()))
          throw "Genre cannot contain numbers";
        genre = genre.trim();
        // testing invalid characters
        let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
        let badEntry = badChars.test(genre);
        if (badEntry)
          throw `Genres must contain only alphabetical characters and/or -/&`;
      }
    }
  }
  if (validation.validArray(nl, 1)) {
    // checking link pairs
    for (let link of nl) {
      if (validation.validArray(link, 1, "string") && link.length === 2) {
        // checking platform
        if (validation.validString(link[0].trim())) link[0] = link[0].trim();
        if (
          !platforms.some((element) => {
            return element.toLowerCase() === link[0].toLowerCase();
          })
        )
          throw "Invalid Platform";
        // checking url
        if (validation.validString(link[1].trim())) link[1] = link[1].trim();
        // testing for whitespace
        if (validation.hasSpace(link[1])) throw "Links cannot contain spaces";
      } else {
        throw `Links array must be of form [[<platform>, <url>], ...] and be only arrays of strings`;
      }
    }
  }
  // getting all songs
  const songCollection = await songs();
  // creating song object
  const updatedSong = {
    title: nt,
    artist: na,
    genres: ng,
    listenLinks: nl,
  };
  // updating
  const updatedInfo = await songCollection.updateOne(
    { _id: ObjectId(songId) },
    { $set: updatedSong }
  );
  if (!updatedInfo.modifiedCount === 0)
    throw `Could not update song successfully`;
  // returning
  let song = await getSongById(songId);
  song._id = song._id.toString();
  return song;
};

/**
 * updates a song
 * @param {*} songId : ObjectId of song - string
 * @param {*} updatedSong Song : Object containing what is requested to be udpated - string/array
 */
const updateSong = async (songId, updatedSong) => {
  const songCollection = await songs();
  const updatedSongData = {};
  if (updatedSong.posterId) {
    updatedSongData.posterId = validation.checkId(
      updatedSong.posterId,
      "Poster ID"
    );
  }
  if (updatedSong.title) {
    updatedSongData.title = validation.checkString(updatedSong.title, "Title");
  }
  if (updatedSong.artist) {
    updatedSongData.artist = validation.checkString(
      updatedSong.artist,
      "Artist"
    );
  }
  if (updatedSong.genres) {
    updatedSongData.genres = validation.checkStringArray(
      updatedSong.genres,
      "Genres"
    );
  }
  if (updatedSong.links) {
    updatedSongData.links = validation.checkStringArray(
      updatedSong.links,
      "Links"
    );
  }
  await songCollection.updateOne(
    { _id: ObjectId(songId) },
    { $set: updatedSongData }
  );
  return await this.getSongById(songId);
};

/**
 * updates title of song
 * @param {*} songId : ObjectId of song - string
 * @param {*} userId : ObjectId of user invoking function - string
 * @param {*} nt : New song title - string
 */
const updateSongTitle = async (songId, userId, nt) => {
  // checking inputs
  if (!songId || !userId || !nt) throw "All fields must have values";
  // checking if user posted
  if (typeof userId !== "string") throw "invalid data type";
  let admin = await user.isAdmin(userId);
  if (!admin) throw "Not admin";
  // checking songId and nl
  if (typeof songId !== "string") throw "invalid data type";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (typeof nt !== "string") throw "Invalid data type";
  if (validation.validString(nt.trim())) nt = nt.trim();

  const songCollection = await songs();
  // updating song title
  let updatedTitle = { title: nt };
  let updatedInfo = await songCollection.updateOne(
    { _id: ObjectId(songId) },
    { $set: updatedTitle }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "Could not rename song successfully";

  // outputting updated song
  let song = await getSongById(songId);
  return song;
};

/**
 * updates artist of a song
 * @param {*} songId : ObjectId of song - string
 * @param {*} na : New artist - string
 */
const updateArtist = async (songId, userId, na) => {
  // checking inputs
  if (!songId || !userId || !na) throw "All fields must have values";
  // checking if user posted
  if (typeof userId !== "string") throw "invalid data type";
  let admin = await user.isAdmin(userId);
  if (!admin) throw "Not admin";
  // checking songId and nl
  if (typeof songId !== "string") throw "invalid data type";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (typeof na !== "string") throw "invalid data type";
  if (validation.validString(na.trim())) na = na.trim();

  const songCollection = await songs();
  // updating song artist
  let updatedArtist = { artist: na };
  let updatedInfo = await songCollection.updateOne(
    { _id: ObjectId(songId) },
    { $set: updatedArtist }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "Could not rename song successfully";

  // outputting updated song
  let song = await getSongById(songId);
  return song;
};

/**
 * update genres of song
 * @param {*} songId : ObjectId of song - string
 * @param {*} ng : New genres of song - array
 *  genre is a string containing letters and punctuation (-/&)
 */
const updateGenre = async (songId, userId, ng) => {
  // checking inputs
  if (!songId || !userId || !ng) throw "All fields must have values";
  // checking if user posted
  if (typeof userId !== "string") throw "invalid data type";
  let admin = await user.isAdmin(userId);
  if (!admin) throw "Not admin";
  // checking songId and nl
  if (typeof songId !== "string") throw "invalid data type";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (validation.validArray(ng, 1, "string")) {
    for (let genre of ng) {
      if (validation.validString(genre.trim())) {
        if (validation.hasNumbers(genre.trim()))
          throw "Genre cannot contain numbers";
        genre = genre.trim();
        //testing for invalid characters
        let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
        let badEntry = badChars.test(genre);
        if (badEntry)
          throw `Genres must contain only alphabetical characters and/or -/&`;
      }
    }
  }
  const songCollection = await songs();
  // updating song genres
  let updatedGenres = { genres: ng };
  let updatedInfo = await songCollection.updateOne(
    { _id: ObjectId(songId) },
    { $set: updatedGenres }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "Could not rename song successfully";

  // outputting updated song
  let song = await getSongById(songId);
  return song;
};

/**
 * updates links to listen to song
 * @param {*} songId : ObjectId of song - string
 * @param {*} nl : New links to listen to song - array
 *  links are urls in string form
 */
const updateSongLinks = async (songId, userId, nl) => {
  // checking inputs
  if (!songId || !userId || !nl) throw "All fields must have values";
  // checking if user posted
  if (typeof userId !== "string") throw "invalid data type";
  let admin = await user.isAdmin(userId);
  if (!admin) throw "Not admin";
  // checking songId and nl
  if (typeof songId !== "string") throw "invalid data type";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (validation.validArray(nl, 1)) {
    // checking link pairs
    for (let link of nl) {
      if (validation.validArray(link, 1, "string") && link.length === 2) {
        // checking platform
        if (validation.validString(link[0].trim())) link = link.trim();
        if (
          !platforms.some((element) => {
            return element.toLowerCase() === link[0].toLowerCase();
          })
        )
          throw "Invalid Platform";
        // checking url
        if (validation.validString(link[1].trim())) link = link.trim();
        // testing for whitespace
        if (validation.hasSpace(link[1])) throw "Links cannot contain spaces";
      } else {
        throw `Links array must be of form [[<platform>, <url>], ...] and be only arrays of strings`;
      }
    }
  }

  const songCollection = await songs();
  // updating song genres
  let updatedLinks = { listenLinks: nl };
  let updatedInfo = await songCollection.updateOne(
    { _id: ObjectId(songId) },
    { $set: updatedLinks }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "Could not rename song successfully";

  // outputting updated song
  let song = await getSongById(songId);
  return song;
};

/**
 * searches through songs and returns songs where title matches the search term
 * @param {*} songName : string being searched for
 * @returns list of song objects
 */
const searchSongs = async (songName) => {
  // input checking
  if (!songName) throw "missing input parameters";
  if (typeof songName !== "string") throw "invalid data type";
  if (validation.validString(songName.trim())) songName = songName.trim();

  // searching for match
  let search = new RegExp(".*" + songName + ".*", "i");
  const songCollection = await songs();
  let matches = await songCollection.find({ title: search }).toArray();
  if (matches.length === 0) throw `No songs with title ${songName} found`;

  return matches;
};

/**
 * searches for through songs and returns songs with a genre of genre
 * @param {*} genre :
 * @returns list of songs
 */
const searchGenres = async (genre) => {
  // input checking
  if (!genre) throw "missing input parameters";
  if (typeof genre !== "string") throw "invalid data type";
  if (validation.validString(genre.trim())) genre = genre.trim();
  if (validation.hasNumbers(genre.trim())) throw "Genre cannot contain numbers";
  //testing for invalid characters
  let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
  let badEntry = badChars.test(genre);
  if (badEntry)
    throw `Genres must contain only alphabetical characters and/or -/&`;

  // searching for matches
  let search = RegExp(".*" + genre + ".*", "i");
  const songCollection = await songs();
  let matches = await songCollection
    .find({ genres: { $in: [search] } })
    .toArray();
  if (matches.length === 0) `No songs in the genre ${genre}`;

  return matches;
};

/**
 * finds all songs from artist with artistName and returns as an array of song objects
 * @param {*} artistName : name of artist - string
 * @returns list of song objects
 */
const searchArtist = async (artistName) => {
  // input checking
  if (!artistName) throw "missing input parameters";
  if (typeof artistName !== "string") throw "invalid data type";
  if (validation.validString(artistName.trim())) artistName = artistName.trim();

  // searching for match
  let search = new RegExp(".*" + artistName + ".*", "i");
  const songCollection = await songs();
  let match = await songCollection.find({ artist: search }).toArray();
  if (match.length === 0) throw `No songs by artist ${artistName} found`;

  return match;
};

/**
 * gets all movies with rating from min to max
 * @param {*} min : minimum rating range, inclusive - whole number positive from 1 to 4
 * @param {*} max : maximum rating range, inclusive - whole number positive from 2 to 5
 * @returns list of songs with ratings greater than min and less than max
 */
const filterByRating = async (min, max) => {
  // input checking
  if (!min || !max) throw "missing input parameters";
  // if (typeof min !== 'number' || typeof max !== 'number')
  //   throw "inputs must be numbers";
  if (!Number.isInteger(min) || !Number.isInteger(max))
    throw "inputs must be whole numbers";
  if (min < 1 && min > 4) throw "min must be between 1 and 4";
  if (max < 2 && max > 5) throw "max must be between 2 and 5";
  if (min > max) throw "min must be less than max";

  const songCollection = await songs();
  const matches = await songCollection.find({overallRating: {$gte: min, $lte: max}}).toArray();
  return matches;
};

/**
 * sorts all songs in DB in a predetermined order based on flag
 * @param {*} order : integer representing order, 1 = ascending (lowest to highest), -1 = descending (highest to lowest)
 * @param {*} flag : category to sort by - string
 * @returns list of songs in a specific order
 */
const sortSongs = async (order, flag) => {
  // input checking
  if (!order || !flag) throw "missing input parameters";
  if (typeof order !== 'number') throw "order must be a number";
  if (order !== 1 && order !== -1) throw "order must be 1 or -1";
  if (typeof flag !== "string") throw "flag must be a string";
  if (flag !== "title" && flag !== "artist" && flag !== "overallRating") throw "invalid flag";
  // sorting
  const songCollection = await songs();
  const sorted = await songCollection.find({}).sort({ title: order }).toArray();
  return sorted;
};

/**
 * gets songs to recommend to user based on song with songId's artist and genre
 * 5 song recommendations
 * @param {*} songId : id of song - string
 * @returns list of songs
 */
const recommendedSongs = async (songId) => {
  // checking input
  if (!songId) throw "missing songId";
  if (typeof songId !== "string") throw "input must be string";
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "invalid songId";

  // variables
  let genreMatches = [];
  let artistMatches = [];
  let recommendations = [];
  // get song
  const song = await getSongById(songId);

  // get all songs with similar genres to current song
  for (let i = 0; i < song.genres.length ; i++) {
    let matches = await searchGenres(song.genres[i]);
    // removing current song
    let filtered = matches.filter((ms) => {
      if (ms._id.toString() !== songId) return ms;
    });
    // removing duplicate additions and updating matches
    genreMatches = [...new Set([...genreMatches, ...filtered])];
  }
  // get all songs with same artist
  let artistSongs = await searchArtist(song.artist);
  if (artistSongs.length > 1) {
    let filtered = artistSongs.filter((ms) => {
      if (ms._id.toString() !== songId) return ms;
    });
    artistMatches = [...new Set([...artistMatches, ...filtered])];
  }
  // sort them from highest to lowest rating
  recommendations = [...new Set([...genreMatches, ...artistMatches])];
  recommendations = recommendations.sort((a, b) => b.overallRating - a.overallRating);
  
  let result = [];
  if (recommendations.length > 5) {
    result = recommendations.slice(0, 5);
  } else {
    result = recommendations;
  }
  return recommendations;
};

/**
 * makes list of all artists in order from highest to lowest rating or an empty list if no songs in db
 * @returns list of artists from most popular to least popular in form [{artist: artistName, rating: rating}, ...]
 * artist - string
 * rating - number
 */
const mostPopularArtists = async () => {
  // get all songs
  let allSongs = await getAllSongs()
  let ranked = [];

  if (allSongs.length !== 0) {
    let artistRating = [];
    for (let i = 0; i < allSongs.length; i++) {
      // getting data
      let song = allSongs[i];
      let artistName = song.artist;
      let songRating = song.overallRating;
      // seeing if artist is in array
      let found = artistRating.findIndex(element => element.artist === artistName);
      if (found >= 0) {
        let old = artistRating[found];
        let oldRating = old.rating;
        let newRating = (oldRating + songRating) / 2;
        // updating
        artistRating[found].rating = newRating;
      } else {
        // adding to array
        artistRating.push({artist: artistName, rating: songRating});
      }
    }
    ranked = artistRating.sort((a, b) => b.rating - a.rating);
  }
  return ranked;
};

module.exports = {
  postSong,
  deleteSong,
  getAllSongs,
  getSongById,
  updateAll,
  updateSong,
  // updateSongTitle,
  // updateArtist,
  // updateGenre,
  // updateSongLinks,
  searchSongs,
  searchGenres,
  searchArtist,
  filterByRating,
  sortSongs,
  recommendedSongs,
  mostPopularArtists,
};
