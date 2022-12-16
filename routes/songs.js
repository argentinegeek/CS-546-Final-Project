// All routes related to song pages
const express = require("express");
const router = express.Router();
const data = require("../data");
const songData = data.songs;
const validation = require("../helpers");

//route to show all songs on a page
router.get("/", async (req, res) => {
  try {
    const songList = await songData.getAllSongs();
    res.json(songList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
//route to any specific song that is clicked on
router.get("/:id", async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "Id URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const song = await songData.getSongById(req.params.id);
    res.render('song_page', {songTitle: song.title, songArtist: song.artist, songGenres: song.genres, songLinks: song.links, songRating: song.overallRating, songComments: song.comments});
  } catch (e) {
    res.status(404).json({ error: e });
  }
});
//route to post a song
router.post("/", async (req, res) => {
  const songPostData = req.body;
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
    let createSong = await songData.postSong(songPostData.posterId, songPostData.title, songPostData.artist, songPostData.genres, songPostData.links);
    res.redirect('/songs');
  } catch (e) {
    return res.status(400).json({ error: e });
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
    res.status(500).json({ error: e });
  }
});
//route to update all elements of a song
router.put("/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    req.params.id = validation.checkId(req.params.id, "ID url param");
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
    return res.status(400).json({ error: e });
  }

  try {
    await songData.getSongById(req.params.id);
  } catch (e) {
    return res.status(404).json({ error: "Song not found" });
  }

  try {
    const updatedSong = await songData.updateAll(req.params.id, updatedData);
    res.json(updatedSong);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//route to update specific part of song post
router.patch("/:id", async (req, res) => {
  const requestBody = req.body;
  let updatedObject = {};
  try {
    req.params.id = validation.checkId(req.params.id, "Song ID");
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
    return res.status(400).json({ error: e });
  }
  try {
    const oldSong = await songData.getSongById(req.params.id);
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
    return res.status(404).json({ error: "Song not found" });
  }
  if (Object.keys(updatedObject).length !== 0) {
    try {
      const updatedSong = await songData.updateSong(
        req.params.id,
        updatedObject
      );
      res.json(updatedSong);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({
      error:
        "No fields have been changed from their inital values, so no update has occurred",
    });
  }
});

//route to delete song
router.delete("/:id", async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "Id URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    await songData.getSongById(req.params.id);
  } catch (e) {
    return res.status(404).json({ error: "Song not found" });
  }
  try {
    await songData.deleteSong(req.params.id);
    res.status(200).json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
