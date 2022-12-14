// All routes related to singular posts
const express = require("express");
const { songs } = require("../data");
const router = express.Router();
const data = require("../data");
const { getComment } = require("../data/comments");
const { getSongById } = require("../data/songs");
const commentsData = data.comments;
const validation = require("../helpers");

//getting the comment
router.get('/:songId', async (req, res) => {
  //validating the id
  try {
    id = validation.checkId(id, "Id URL Param");
    
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    //get the song to see all the comments under the song
    const song = await songs.getSongById(songId);
    if (song.comments.length === 0) {
      return res.status(404).json({ error: "no comments found" });
    }
    res.render("song_page", { comments: song });
  } catch {
    res.status(404).render("error", {error: "Oops, something went wrong"});
    return;
  }
})
//route to post a comment
router.post("/:songId", async (req, res) => {
  const commentsPostData = req.body;
  let userCom = commentsPostData.comment;
  let userRate = commentsPostData.commentRating;

  try {
    const newComment = await commentsData.createComment(
      req.params.songId,
      req.session.user.uId,
      userCom,
      userRate
    );
    res.json(newComment);
  } catch (e) {
    res.status(500).render("error", {error: "Oops, something went wrong"});
    return;
  }
});

// router.post("/like/:id", async (req, res) => {

// });

//route to delete a comment
router.delete("/:commentId", async (req, res) => {
  //validating the id
  try {
    id = validation.checkId(req.params.id, "Id URL Param");
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  //making sure the person deleting is the owner of the comment
  try {
    if (req.session.user.userId !== (await getComment(commentId)).userId)
      throw "User is not the original poster or admin.";
  } catch (e) {
    res.status(400).render("error", {error: "Oops, something went wrong"});
    return;
  }
  //let song = null;
  //get the song
  try {
    //get the comment by id
    const comment = await commentsData.getComment(req.params.commentId);
  } catch (error) {
    res.status(404).render("error", {error: "Oops, something went wrong"});
    return;
  }
  //delete the comment
  try {
    let deletion = await commentsData.deleteComment(req.params.commentId, req.session.user.uId, req.params.songId);
    return res.status(200).json(deletion);
  } catch {
    res.status(500).render("error", {error: "Oops, something went wrong"});
    return;
  }
});

module.exports = router;
