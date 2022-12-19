// functions for client-side searching
const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const validation = require("../helpers");
const user = require("./users");
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
  const matches = await songCollection
    .find({ overallRating: { $gte: min, $lte: max } })
    .toArray();
  return matches;
};

$(function () {
  var bar = $("#searchBar");

  bar.submit(function (event) {
    event.preventDefault();

    //typeOfSearch is a dropdown, will always have a value
    var typeOfSearch = $("#searchType").val();
    var word = $("#searchTerm").val();
    if (!word) throw "missing keyword";
    if (typeof word !== "string") throw "invalid data type";
    var url = "";
    if (typeOfSearch === "Songs") {
      url = "/songs/search/songs" + word;
    }
    if (typeOfSearch === "Artist") {
      url = "/songs/search/artists" + word;
    }
    if (typeOfSearch === "Genres") {
      url = "/songs/search/genres" + word;
    }
    if (typeOfSearch === "Rating") {
      url = "/songs/search/rating" + word;
    }
    window.location = url;
  });
});
