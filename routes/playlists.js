// All routes related to singular posts
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const {getPlaylistById } = require("../data/playlists");
const playlistData = data.playlists;
const validation = require("../helpers");

//route to show all playlists on a page
router.get("/", async (req, res) => {
  try {
    const playlistList = await playlistData.getAllPlaylists();
    //res.json(playlistList);
    res.render("playlists", { playlist: playlistList });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
//route to any specific playlist that is clicked on
router.get("/:id", async (req, res) => {
  try {
    req.params.id = validation.checkId(xss(req.params.id), "Id URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  
  try {
    
    const playlist = await playlistData.getPlaylistById(xss(req.params.id));
    //res.json(playlist);
    
    res.render("individual_playlist_page", { iplaylist: playlist });
    
  } catch (e) {
    res.status(404).json({ error: e });
  }
});
//route to post a playlist
router.post("/", async (req, res) => {
  const playlistPostData = xss(req.body);
  try {
    playlistPostData.posterId = validation.checkId(
      playlistPostData.posterId,
      "Poster ID"
    );
    playlistPostData.name = validation.checkString(
      playlistPostData.name,
      "Name"
    );
    playlistPostData.description = validation.checkString(
      playlistPostData.description,
      "Description"
    );
    playlistPostData.songs = validation.checkStringArray(
      playlistPostData.songs,
      "Songs"
    );
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const { posterId, name, description, songs } = playlistPostData;
    const newPlaylist = await playlistData.createPlaylist(
      posterId,
      name,
      description,
      songs
    );
    res.json(newPlaylist);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
//route to update all elements of a playlist
router.put("/:id", async (req, res) => {
  const updatedData = xss(req.body);
  try {
    if (
      !isAdmin(xss(req.session.user.userId)) ||
      xss(req.session.user.userId) !==
        (await getPlaylistById(xss(req.params.id))).posterId
    )
      throw "User is original poster or admin.";
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    req.params.id = validation.checkId(xss(req.params.id), "ID url param");
    updatedData.playlistId = validation.checkId(
      updatedData.playlistId,
      "Playlist ID"
    );
    updatedData.posterId = validation.checkId(
      updatedData.posterId,
      "Poster ID"
    );
    updatedData.name = validation.checkString(updatedData.name, "Name");
    updatedData.description = validation.checkString(
      updatedData.description,
      "Description"
    );
    updatedData.songs = validation.checkStringArray(updatedData.songs, "Songs");
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    await playlistData.getPlaylistById(xss(req.params.id));
  } catch (e) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  try {
    const updatedPlaylist = await playlistData.updateAllPlaylist(
      xss(req.params.id),
      updatedData
    );
    res.json(updatedPlaylist);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//route to update specific part of song post
router.patch("/:id", async (req, res) => {
  const requestBody = xss(req.body);
  let updatedObject = {};
  try {
    if (
      !isAdmin(xss(req.session.user.userId)) ||
      xss(req.session.user.userId) !==
        (await getPlaylistById(xss(req.params.id))).posterId
    )
      throw "User is original poster or admin.";
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    req.params.id = validation.checkId(xss(req.params.id), "Playlist ID");
    if (requestBody.posterId)
      requestBody.posterId = validation.checkId(
        requestBody.posterId,
        "Poster ID"
      );
    if (requestBody.name)
      requestBody.name = validation.checkString(requestBody.name, "Name");
    if (requestBody.description)
      requestBody.description = validation.checkString(
        requestBody.description,
        "Description"
      );
    if (requestBody.songs)
      requestBody.songs = validation.checkStringArray(
        requestBody.songs,
        "Songs"
      );
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const oldPlaylist = await playlistData.getPlaylistById(xss(req.params.id));
    if (requestBody.posterId && requestBody.posterId !== oldPlaylist.posterId)
      updatedObject.posterId = requestBody.posterId;
    if (requestBody.name && requestBody.name !== oldPlaylist.name)
      updatedObject.name = requestBody.name;
    if (
      requestBody.description &&
      requestBody.description !== oldPlaylist.description
    )
      updatedObject.description = requestBody.description;
    if (requestBody.songs && requestBody.songs !== oldPlaylist.songs)
      updatedObject.songs = requestBody.songs;
  } catch (e) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  if (Object.keys(updatedObject).length !== 0) {
    try {
      const updatedPlaylist = await playlistData.updateSong(
        xss(req.params.id),
        updatedObject
      );
      res.json(updatedPlaylist);
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

//route to delete Playlist
router.delete("/:id", async (req, res) => {
  try {
    if (
      !isAdmin(xss(req.session.user.userId)) ||
      xss(req.session.user.userId) !==
        (await getPlaylistById(xss(req.params.id))).posterId
    )
      throw "User is original poster or admin.";
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    req.params.id = validation.checkId(xss(req.params.id), "Id URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    await playlistData.getPlaylistById(xss(req.params.id));
  } catch (e) {
    return res.status(404).json({ error: "Playlist not found" });
  }
  try {
    await playlistData.deletePlaylist(xss(req.params.id));
    res.status(200).json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
