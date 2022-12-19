// All routes related to song pages
const express = require("express");
const xss = require("xss");
const router = express.Router();
const data = require("../data");
const { getAllSongs } = require("../data/songs");
const { isAdmin } = require("../data/users");
const songData = data.songs;
const validation = require("../helpers");

//route to show all songs on a page
router.get("/", async (req, res) => {
  try {
    const songList = await songData.getAllSongs();
    // res.json(songList);

    res.render("songs_page", { song: songList });
    return;

  } catch (e) {
    res.status(500).render("error", {error: "Oops, something went wrong"});
    return;

  }
});
//route to any specific song that is clicked on
router.get("/:id", async (req, res) => {
  try {
    req.params.id = validation.checkId(xss(req.params.id), "Id URL Param");
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    const song = await songData.getSongById(xss(req.params.id));
    const recommendedSongs = await songData.recommendedSongs(xss(req.params.id));
    res.render("song_page", {
      songTitle: song.title,
      songArtist: song.artist,
      songGenres: song.genres,
      songLinks: song.links,
      songRating: song.overallRating,
      songComments: song.comments,
      recommended: recommendedSongs
    });
    return;

  } catch (e) {
    res.status(404).render("error", {error: "Oops, something went wrong"});
    return;
  }
});
//route to post a song
router.post("/", async (req, res) => {
  const songPostData = xss(req.body);
  try {
    if (!isAdmin(xss(req.session.user.userId))) throw "User is not admin.";
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    songPostData.posterId = validation.checkId(
      songPostData.posterId,
      "Poster ID"
    );
    songPostData.title = validation.checkString(songPostData.title, "Title");
    songPostData.artist = validation.checkString(songPostData.artist, "Artist");
    songPostData.genres = validation.checkStringArray(
      songPostData.genres,
      "Genres"
    );
    songPostData.links = validation.checkStringArray(
      songPostData.links,
      "Links"
    );
  } catch (e) {
    res.status(404).render("error", {error: "Oops, something went wrong"});
    return;
  }

  try {
    const { posterId, title, artist, genres, links } = songPostData;
    const newSong = await songData.postSong(
      posterId,
      title,
      artist,
      genres,
      links
    );
    res.json(newSong);
  } catch (e) {
    res.status(500).render("error", {error: "Oops, something went wrong"});
    return;
  }
  //TODO: for handlebars, pass in parameter for database to display all the songs
  let songs = await songData.getAllSongs();
  return res.render("songs_page", { song: songs });
});

//route to update all elements of a song
router.put("/:id", async (req, res) => {
  const updatedData = xss(req.body);
  try {
    if (!isAdmin(xss(req.session.user.userId))) throw "User is not admin.";
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    req.params.id = validation.checkId(xss(req.params.id), "ID url param");
    updatedData.posterId = validation.checkId(
      updatedData.posterId,
      "Poster ID"
    );
    updatedData.title = validation.checkString(updatedData.title, "Title");
    updatedData.artist = validation.checkString(updatedData.artist, "Artist");
    updatedData.genres = validation.checkStringArray(
      updatedData.genres,
      "Genres"
    );
    updatedData.links = validation.checkStringArray(updatedData.links, "Links");
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }

  try {
    await songData.getSongById(xss(req.params.id));
  } catch (e) {
    res.status(404).render("error", {error: "Oops, something went wrong"});
    return;
  }

  try {
    const updatedSong = await songData.updateAll(
      xss(req.params.id),
      updatedData
    );
    res.json(updatedSong);
  } catch (e) {
    res.status(500).render("error", {error: "Oops, something went wrong"});
    return;

  }
});

//route to update specific part of song post
router.patch("/:id", async (req, res) => {
  const requestBody = xss(req.body);
  let updatedObject = {};
  try {
    if (!isAdmin(xss(req.session.user.userId))) throw "User is not admin.";
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    req.params.id = validation.checkId(xss(req.params.id), "Song ID");
    if (requestBody.posterId)
      requestBody.posterId = validation.checkId(
        requestBody.posterId,
        "Poster ID"
      );
    if (requestBody.title)
      requestBody.title = validation.checkString(requestBody.title, "Title");
    if (requestBody.artist)
      requestBody.artist = validation.checkString(requestBody.artist, "Artist");
    if (requestBody.genres)
      requestBody.genres = validation.checkStringArray(
        requestBody.genres,
        "Genres"
      );
    if (requestBody.links)
      requestBody.links = validation.checkStringArray(
        requestBody.links,
        "Links"
      );
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    const oldSong = await songData.getSongById(xss(req.params.id));
    if (requestBody.posterId && requestBody.posterId !== oldSong.posterId)
      updatedObject.posterId = requestBody.posterId;
    if (requestBody.title && requestBody.title !== oldSong.title)
      updatedObject.title = requestBody.title;
    if (requestBody.artist && requestBody.artist !== oldSong.artist)
      updatedObject.artist = requestBody.artist;
    if (requestBody.genres && requestBody.genres !== oldSong.genres)
      updatedObject.genres = requestBody.genres;
    if (requestBody.links && requestBody.links !== oldSong.links)
      updatedObject.links = requestBody.links;
  } catch (e) {
    res.status(404).render("error", {error: "Oops, something went wrong"});
    return;
  }
  if (Object.keys(updatedObject).length !== 0) {
    try {
      const updatedSong = await songData.updateSong(
        xss(req.params.id),
        updatedObject
      );
      res.json(updatedSong);
    } catch (e) {
      res.status(500).render("error", {error: "Oops, something went wrong"});
      return;
    }
  } else {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;

  }
});

//route to delete song
router.delete("/:id", async (req, res) => {
  try {
    if (!isAdmin(xss(req.session.user.userId))) throw "User is not admin.";
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    req.params.id = validation.checkId(xss(req.params.id), "Id URL Param");
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    await songData.getSongById(xss(req.params.id));
  } catch (e) {
    res.status(404).render("error", {error: "Oops, something went wrong"});
    return;
  }
  try {
    await songData.deleteSong(xss(req.params.id));
    res.status(200).render("error", {error: "Oops, something went wrong"});
    return;

  } catch (e) {
    res.status(500).render("error", {error: "Oops, something went wrong"});
    return;
  }
})

router.route("/searchsong").post(async (req, res) => {
  //code here for POST
  try {
    let v = req.body;
    let pname = (v.songName);
    if (pname.length == 0) throw "no input"
    res.render('', { name: pname });
    return;

  }
  catch {
    res.render('error', { name: pname });
    return;

  }
});

router.route("/searchgenre").post(async (req, res) => {
  //code here for POST
  try {
    let v = req.body;
    let pname = (v.genre);
    if (pname.length == 0) throw "no input"
  }
  catch {
    res.render('error', { name: pname });
    return;
  }
});
router.route("/searchartist").post(async (req, res) => {
  //code here for POST
  try {
    let v = req.body;
    let pname = (v.searchArtist);
    if (pname.length == 0) throw "no input"
  }
  catch {
    res.render('error', { name: pname });
  }
});



module.exports = router;
