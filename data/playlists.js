// Functions for posts
const mongoCollections = require("../config/mongoCollections");
const playlists = mongoCollections.posts;
const { ObjectId } = require("mongodb");
const validation = require("../helpers");
const { isAdmin } = require("./users");

// data functions for playlists

/**
 *
 * @param {*} posterId : ObjectId of user who created playlist - string
 * @param {*} name : Playlist title - string
 * @param {*} description : Playlist description - string
 * @param {*} songs : List of songs in the playlist - array
 * @returns Playlist creation with its information
 */
const createPlaylist = async (posterId, name, description, songs) => {
  validation.checkId(posterId, "ID");
  validation.checkString(name, "name");
  validation.checkString(description, "description");
  validation.checkStringArray(songs, "songs");
  const playlistCollection = await playlists();
  let newPlaylist = {
    posterId: posterId,
    name: name,
    description: description,
    songs: songs,
  };
  const newInsert = await playlistCollection.insertOne(newPlaylist);
  if (newInsert.insertedCount === 0) throw "Insert failed!";
  return await this.getPlaylistById(newInsert.insertedId.toString());
};

/**
 *
 * @param {*} id : ObjectId of playlist - string
 * @returns Playlist with searched ID
 */
const getPlaylistById = async (id) => {
  id = validation.checkId(id, "ID");
  const playlistCollection = await playlists();
  const playlist = await playlistCollection.findOne({ _id: ObjectId(id) });
  if (!playlist) throw "Playlist not found";
  // formatting output
  playlist._id = playlist._id.toString();
  return playlist;
};

/**
 * returns all playlist objects from DB in an array
 */
const getAllPlaylists = async () => {
  // getting all songs
  let playlistCollection = await playlists();
  let playlistList = await playlistCollection.find({}).toArray();
  if (!playlistList) throw "Could not get all playlists";

  // formatting output
  for (let i = 0; i < playlistList.length; i++) {
    playlistList[i]._id = playlistList[i]._id.toString();
  }
  // output
  return playlistList;
};

/**
 * @param {*} playlistId : ObjectId of playlist - string
 * @param {*} posterId : ObjectId of user who created and is updating the playlist - string
 * @param {*} n_Name : new name of the playlist - string
 * @param {*} n_Description : new description of the playlist - string
 * @param {*} n_Songs : new list of songs for the playlist - array
 * @returns updated playlist
 */
const updateAllPlaylist = async (
  playlistId,
  posterId,
  n_Name,
  n_Description,
  n_Songs
) => {
  const playlist = await this.getPlaylistById(playlistId);
  if (playlist.posterId !== posterId || !isAdmin(posterId))
    throw "User attempting to delete is not the original poster or an Admin.";
  playlistId = validation.checkId(playlistId, "playlist ID");
  posterId = validation.checkId(posterId, "Poster ID");
  n_Name = validation.checkString(n_Name, "new name");
  n_Description = validation.checkString(n_Description, "new description");
  n_Songs = validation.checkStringArray(n_Songs, "new songs");
  const playlistCollection = await playlists();
  let updatedPlaylist = {
    posterId: posterId,
    playlistId: playlistId,
    name: n_Name,
    description: n_Description,
    songs: n_Songs,
  };
  const updatedInfo = await playlistCollection.updateOne(
    { _id: ObjectId(playlistId) },
    { $set: updatedPlaylist }
  );
  if (!updatedInfo.modifiedCount === 0)
    throw "Could not update playlist successfully";
  let updatedPL = await this.getPlaylistById(playlistId);
  updatedPL._id = updatedPL._id.toString();

  return updatedPL;
};

/**
 * updates a playlist
 * @param {*} playlistId : ObjectId of playlist - string
 * @param {*} posterId : ObjectId of poster of playlist - string
 * @param {*} updatedPlaylist : Object containing what is requested to be udpated - string/array
 */
const updatePlaylist = async (posterId, playlistId, updatedPlaylist) => {
  const playlistCollection = await songs();
  const updatedPlaylistData = {};
  const playlist = await this.getPlaylistById(playlistId);
  if (playlist.posterId !== posterId || !isAdmin(posterId))
    throw "User attempting to delete is not the original poster or an Admin.";

  if (updatedPlaylist.posterId) {
    updatedPlaylistData.posterId = validation.checkId(
      updatedPlaylist.posterId,
      "Poster ID"
    );
  }
  if (updatedPlaylist.playlistId) {
    updatedPlaylistData.playlistId = validation.checkId(
      updatedPlaylist.playlistId,
      "Playlist ID"
    );
  }
  if (updatedPlaylist.name) {
    updatedPlaylistData.name = validation.checkString(
      updatedPlaylist.name,
      "Name"
    );
  }
  if (updatedPlaylist.description) {
    updatedPlaylistData.description = validation.checkString(
      updatedPlaylist.description,
      "Description"
    );
  }
  if (updatedPlaylist.songs) {
    updatedPlaylistData.songs = validation.checkStringArray(
      updatedSong.songs,
      "Songs"
    );
  }
  await playlistCollection.updateOne(
    { _id: ObjectId(playlistId) },
    { $set: updatedPlaylistData }
  );
  return await this.getPlaylistById(playlistId);
};

/**
 * @param {*} playlistId : ObjectId of playlist - string
 * @param {*} posterId : ObjectId of user who created and is deleting the playlist - string
 * @returns message confirming deletion of playlist
 */
const deletePlaylist = async (posterId, playlistId) => {
  posterId = validation.checkId(posterId, "posterId");
  playlistId = validation.checkId(playlistId, "playlistID");
  const playlistCollection = await playlists();
  try {
    await this.getPlaylistById(playlistId);
  } catch (e) {
    console.log(e);
    return;
  }
  const playlist = await this.getPlaylistById(playlistId);
  if (playlist.posterId !== posterId || !isAdmin(posterId))
    throw "User attempting to delete is not the original poster or an Admin.";
  const deletionInfo = await playlistCollection.deleteOne({
    _id: ObjectId(playlistId),
  });
  if (deletionInfo.deletedCount === 0)
    throw `Could not delete playlist with id of ${playlistId}`;

  const message = `${name} has been successfully deleted`;
  return message;
};

module.exports = {
  createPlaylist,
  getPlaylistById,
  getAllPlaylists,
  updateAllPlaylist,
  updatePlaylist,
  deletePlaylist,
};
