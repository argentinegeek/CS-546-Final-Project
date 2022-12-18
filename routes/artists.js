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
    for (let i = 0; i < req.params.id.length; i++) {
        if(req.params.id.includes("_")) {
            req.params.id.replace("_", " ");
        }
    } 
  try {
    const artist = await songData.searchArtist(xss(req.params.id));
    res.render("artist_page", {
      songTitle: song.title,
      songRating: song.overallRating,
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});


module.exports = router;