// All routes related to singular posts
const express = require("express");
const router = express.Router();
const data = require("../data");
const postDate = data.posts;
const validation = require("../helpers");

module.exports = router;
