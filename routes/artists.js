// All routes related to song pages
const express = require("express");
const xss = require("xss");
const router = express.Router();
const data = require("../data");
const { getAllSongs } = require("../data/songs");
const { isAdmin } = require("../data/users");
const songData = data.songs;
const validation = require("../helpers");

//route to show all artists on a page
router.get("/", async (req, res) => {
  try {
    const artistsList = await songData.mostPopularArtists();
    // res.json(songList);
    // console.log(songList);
    res.render("artists_page", { artists: artistsList });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
//route to any specific song that is clicked on
router.get("/:id", async (req, res) => {
    //Input is a string, if string has spaces, spaces become underscores
    //Before calling searchArtist, need to replace underscores with spaces
    let editedArtist = xss(req.params.id);
    editedArtist = editedArtist.trim();
    for (let i = 0; i < editedArtist.length; i++) {
        if(editedArtist.includes("_")) {
            editedArtist.replace("_", " ");
        }
    } 
  try {
    const artists = await songData.searchArtist(editedArtist);
    res.render("artist_page", { artist: artists});
  } catch (e) {
    res.status(404).json({ error: e });
  }
});


module.exports = router;