// functions for songs
const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;
const { ObjectId } = require("mongodb");
// const users = mongoCollections.users;
const validation = require("../helpers");
const user = require("./users");
const platforms = ["Youtube", "Soundcloud", "Apple Music", "Spotify", "Tidal"];

// data functions for songs

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
  if (typeof(posterId) !== 'string') throw 'invalid data type';
  if (validation.validString(posterId.trim())) posterId = posterId.trim();
  if (!ObjectId.isValid(posterId)) throw "Poster does not have valid ObjectId";
  let admin = await user.isAdmin(posterId);
  if (!admin) throw "Not admin"; // checking if admin
  if (typeof(title) !== 'string') throw 'invalid data type';
  if (validation.validString(title.trim())) title = title.trim();
  if (typeof(artist) !== 'string') throw 'invalid data type';
  if (validation.validString(artist.trim())) artist = artist.trim();
  if (validation.validArray(genres, 1, "string")) {
    for (let genre of genres) {
      if (validation.validString(genre.trim())) {
        if (validation.hasNumbers(genre.trim()))
          throw "Genre cannot contian numbers";
        genre = genre.trim();

        // testing for invalid characters
        let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
        let badEntry = badChars.test(genre);
        if (badEntry)
          throw `Genres must contain only alphabetical characters and/or -/&`;
      }
    }
  }
  //console.log(links);
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
  let songCollection = await songs();
  // creating song object
  let newSong = {
    posterId: ObjectId(posterId),
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

  // formatting output
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
  // getting all songs
  if (!songId) throw "You must provide an id to search for";
  if (typeof(songId) !== 'string') throw 'invalid data type';
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
  if (typeof(userId) !== 'string') throw 'invalid data type';
  let admin = await user.isAdmin(userId);
  let og = await getSongById(songId); // original song
  if (!admin || userId !== og.posterId) throw "Not admin or did not post song";
  // checking songId and nl
  if (typeof(songId) !== 'string') throw 'invalid data type';
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";

  // getting DB
  const songCollection = await songs();
  // const userCollection = await users();

  // getting song and individual tags
  const song = await getSongById(songId);
  if (userId !== song.posterId) throw `Song must be deleted by poster`;
  const title = song.title;
  const artist = song.artist;
  // const comments = song.comments;

  // deleting song from DB

  const deletionInfo = await songCollection.deleteOne({
    _id: ObjectId(songId),
  });

  if (deletionInfo.deleteCount === 0) throw `Could not delete song with id of ${songId}`;

  // delete comment connections for comment commentId on song
  // // remove from user's songReview
  // let deletes = [];
  // for (const comment in comments) {
  //     let deleted = await user.deleteComment(comment._id.toString());
  //     deletes.push(deleted);
  // }
  // // deleting songId from admin's songPosts
  // const updatedAdmin = await user.deleteSong(songId, userId);

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
  if (typeof(userId) !== 'string') throw 'invalid data type';
  let admin = await user.isAdmin(userId);
  let og = await getSongById(songId); // original song
  if (!admin || userId !== og.posterId) throw "Not admin or did not post song";
  // checking songId and nl
  if (typeof(songId) !== 'string') throw 'invalid data type';
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (typeof(nt) !== 'string') throw 'invalid data type';
  if (validation.validString(nt.trim())) nt = nt.trim();
  if (typeof(na) !== 'string') throw 'invalid data type';
  if (validation.validString(na.trim())) na = na.trim();
  if (validation.validArray(ng, 1, "string")) {
    for (const genre of ng) {
      if (validation.validString(genre.trim())) {
        if (validation.hasNumbers(genre.trim()))
          throw "Genre cannot contian numbers";
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
    for (const link of nl) {
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

  // getting all songs
  const songCollection = await songs();

  // creating song object
  let updatedSong = {
    title: title,
    artist: artist,
    genres: genres,
    listenLinks: links,
  };

  const updatedInfo = await songCollection.updateOne(
    { _id: ObjectId(songId) },
    { $set: updatedSong }
  );
  if (!updatedInfo.modifiedCount === 0)
    throw `Could not update song successfully`;

  let song = await getSongById(songId);
  song._id = song._id.toString();

  return song;
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
  if (typeof(userId) !== 'string') throw 'invalid data type';
  let admin = await user.isAdmin(userId);
  let og = await getSongById(songId); // original song
  if (!admin || userId !== og.posterId) throw "Not admin or did not post song";
  // checking songId and nl
  if (typeof(songId) !== 'string') throw 'invalid data type';
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (typeof(nt) !== 'string') throw 'invalid data type';
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
  if (typeof(userId) !== 'string') throw 'invalid data type';
  let admin = await user.isAdmin(userId);
  let og = await getSongById(songId); // original song
  if (!admin || userId !== og.posterId) throw "Not admin or did not post song";
  // checking songId and nl
  if (typeof(songId) !== 'string') throw 'invalid data type';
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (typeof(na) !== 'string') throw 'invalid data type';
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
  if (typeof(userId) !== 'string') throw 'invalid data type';
  let admin = await user.isAdmin(userId);
  let og = await getSongById(songId); // original song
  if (!admin || userId !== og.posterId) throw "Not admin or did not post song";
  // checking songId and nl
  if (typeof(songId) !== 'string') throw 'invalid data type';
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (validation.validArray(ng, 1, "string")) {
    for (const genre of ng) {
      if (validation.validString(genre.trim())) {
        if (validation.hasNumbers(genre.trim()))
          throw "Genre cannot contian numbers";
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
  if (typeof(userId) !== 'string') throw 'invalid data type';
  let admin = await user.isAdmin(userId);
  let og = await getSongById(songId); // original song
  if (!admin || userId !== og.posterId) throw "Not admin or did not post song";
  // checking songId and nl
  if (typeof(songId) !== 'string') throw 'invalid data type';
  if (validation.validString(songId.trim())) songId = songId.trim();
  if (!ObjectId.isValid(songId)) throw "Invalid songId";
  if (validation.validArray(nl, 1)) {
    // checking link pairs
    for (const link of nl) {
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
const searchSongs = async (searchTerm) => {};

/**
 * gets songs to recommend to user based on song with songId's artist and genre
 * @param {*} songId
 * @returns list of songs
 */
const recommendSongs = async (songId) => {};

/**
 * @returns list of artists from most popular to least popular
 */
const mostPopularArtists = async () => {};

/**
 * gets all songs with that genre
 * @param {*} genres
 * @returns list of songs that have genre
 */
const filterGenre = async (genres) => {};

/**
 * gets all songs from the artist
 * @param {*} artist : artist name - string
 * @returns list of songs
 */
const getArtistSongs = async (artist) => {};

module.exports = {
  postSong,
  deleteSong,
  getAllSongs,
  getSongById,
  updateAll,
  updateSongTitle,
  updateArtist,
  updateGenre,
  updateSongLinks,
  searchSongs,

};
