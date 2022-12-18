// All routes related to singular posts
const express = require("express");
const router = express.Router();
const data = require("../data");
const commentsData = data.comments;
const validation = require("../helpers");

//route to any specific playlist that is clicked on
// router.get("/:id", async (req, res) => {
//   try {
//     req.params.id = validation.checkId(req.params.id, "Id URL Param");
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
//   try {
//     const playlist = await playlistData.getPlaylistById(req.params.id);
//     res.json(playlist);
//   } catch (e) {
//     res.status(404).json({ error: e });
//   }
// });
//route to post a playlist
router.post("/:songId", async (req, res) => {
    const commentsPostData = req.body;
    let userCom = commentsPostData.comment;
    let userRate = commentsPostData.commentRating;
    //   try {
    //     //error check shit

    //   } catch (e) {
    //     return res.status(400).json({ error: e });
    //   }

    try {
        const newComment = await commentsData.createComment(req.params.songId, req.session.user.uId, userCom, userRate);
        res.json(newComment);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
//route to update all elements of a playlist
// router.put("/:id", async (req, res) => {
//   const updatedData = req.body;
//   try {
//     if (
//       !isAdmin(req.session.user.userId) ||
//       req.session.user.userId !==
//         (await getPlaylistById(req.params.id)).posterId
//     )
//       throw "User is original poster or admin.";
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
//   try {
//     req.params.id = validation.checkId(req.params.id, "ID url param");
//     updatedData.playlistId = validation.checkId(
//       updatedData.playlistId,
//       "Playlist ID"
//     );
//     updatedData.posterId = validation.checkId(
//       updatedData.posterId,
//       "Poster ID"
//     );
//     updatedData.name = validation.checkString(updatedData.name, "Name");
//     updatedData.description = validation.checkString(
//       updatedData.description,
//       "Description"
//     );
//     updatedData.songs = validation.checkStringArray(updatedData.songs, "Songs");
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }

//   try {
//     await playlistData.getPlaylistById(req.params.id);
//   } catch (e) {
//     return res.status(404).json({ error: "Playlist not found" });
//   }

//   try {
//     const updatedPlaylist = await playlistData.updateAllPlaylist(
//       req.params.id,
//       updatedData
//     );
//     res.json(updatedPlaylist);
//   } catch (e) {
//     res.status(500).json({ error: e });
//   }
// });

// //route to update specific part of song post
// router.patch("/:id", async (req, res) => {
//   const requestBody = req.body;
//   let updatedObject = {};
//   try {
//     if (
//       !isAdmin(req.session.user.userId) ||
//       req.session.user.userId !==
//         (await getPlaylistById(req.params.id)).posterId
//     )
//       throw "User is original poster or admin.";
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
//   try {
//     req.params.id = validation.checkId(req.params.id, "Playlist ID");
//     if (requestBody.posterId)
//       requestBody.posterId = validation.checkId(
//         requestBody.posterId,
//         "Poster ID"
//       );
//     if (requestBody.name)
//       requestBody.name = validation.checkString(requestBody.name, "Name");
//     if (requestBody.description)
//       requestBody.description = validation.checkString(
//         requestBody.description,
//         "Description"
//       );
//     if (requestBody.songs)
//       requestBody.songs = validation.checkStringArray(
//         requestBody.songs,
//         "Songs"
//       );
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
//   try {
//     const oldPlaylist = await playlistData.getPlaylistById(req.params.id);
//     if (requestBody.posterId && requestBody.posterId !== oldPlaylist.posterId)
//       updatedObject.posterId = requestBody.posterId;
//     if (requestBody.name && requestBody.name !== oldPlaylist.name)
//       updatedObject.name = requestBody.name;
//     if (
//       requestBody.description &&
//       requestBody.description !== oldPlaylist.description
//     )
//       updatedObject.description = requestBody.description;
//     if (requestBody.songs && requestBody.songs !== oldPlaylist.songs)
//       updatedObject.songs = requestBody.songs;
//   } catch (e) {
//     return res.status(404).json({ error: "Playlist not found" });
//   }
//   if (Object.keys(updatedObject).length !== 0) {
//     try {
//       const updatedPlaylist = await playlistData.updateSong(
//         req.params.id,
//         updatedObject
//       );
//       res.json(updatedPlaylist);
//     } catch (e) {
//       res.status(500).json({ error: e });
//     }
//   } else {
//     res.status(400).json({
//       error:
//         "No fields have been changed from their inital values, so no update has occurred",
//     });
//   }
// });

// //route to delete Playlist
// router.delete("/:id", async (req, res) => {
//   try {
//     if (
//       !isAdmin(req.session.user.userId) ||
//       req.session.user.userId !==
//         (await getPlaylistById(req.params.id)).posterId
//     )
//       throw "User is original poster or admin.";
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
//   try {
//     req.params.id = validation.checkId(req.params.id, "Id URL Param");
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
//   try {
//     await playlistData.getPlaylistById(req.params.id);
//   } catch (e) {
//     return res.status(404).json({ error: "Playlist not found" });
//   }
//   try {
//     await playlistData.deletePlaylist(req.params.id);
//     res.status(200).json({ deleted: true });
//   } catch (e) {
//     res.status(500).json({ error: e });
//   }
// });

module.exports = router;