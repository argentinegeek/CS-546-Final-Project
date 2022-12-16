// Index for all routes
const playlistRoutes = require("./playlists");
const songRoutes = require("./songs");
const userRoutes = require("./users");
// const router = require("./users");

const constructorMethod = (app) => {
  // // figure out what route base should be stored in
  app.use("/", userRoutes);
  // app.use("/user", userRoutes);
  app.use("/songs", songRoutes);
  app.use("/playlists", playlistRoutes);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
