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
//search client-side
var form = document.createElement("form");
form.id = "search-form";

var input = document.createElement("input");
input.type = "text";
input.name = "search-term";
input.placeholder = "Search...";

var select = document.createElement("select");
select.name = "search-category";

var songOption = document.createElement("option");
songOption.value = "songs";
songOption.innerText = "Songs";

var artistOption = document.createElement("option");
artistOption.value = "artists";
artistOption.innerText = "Artists";

var genreOption = document.createElement("option");
genreOption.value = "genres";
genreOption.innerText = "Genres";

var ratingOption = document.createElement("option");
ratingOption.value = "ratings";
ratingOption.innerText = "Ratings";

select.appendChild(songOption);
select.appendChild(artistOption);
select.appendChild(genreOption);
select.appendChild(ratingOption);

// create the submit button
var button = document.createElement("button");
button.type = "submit";
button.innerText = "Search";

// append the input field, select field, and button to the form
form.appendChild(input);
form.appendChild(select);
form.appendChild(button);

// add an event listener to the form that listens for the submit event
form.addEventListener("submit", function (event) {
  // prevent the form from submitting
  event.preventDefault();

  // retrieve the search term and category from the form elements
  var searchTerm = input.value;
  var searchCategory = select.value;

  // perform the search using the search term and category
  // you can add your own code here to search your database or perform some other action
  console.log(`Searching for ${searchTerm} in category ${searchCategory}`);
});

// append the form to the body of the document
document.body.appendChild(form);

//Display links function
//TODO: figure out how to pull links from song when user is on song page
const displayLinks = async (links) => {
  const songCollection = await songs();

  var list = document.createElement("ul");

  for (var i = 0; i < links.length; i++) {
    var item = document.createElement("li");

    var anchor = document.createElement("a");
    anchor.href = links[i].url;
    anchor.innerText = links[i].text;

    item.appendChild(anchor);

    list.appendChild(item);
  }

  document.body.appendChild(list);
};
/*How to use this function

displayLinks([
  { text: "Google", url: "https://www.google.com" },
  { text: "Facebook", url: "https://www.facebook.com" },
  { text: "Twitter", url: "https://www.twitter.com" },
]);
*/
