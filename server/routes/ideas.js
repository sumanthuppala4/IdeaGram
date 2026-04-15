const express = require("express");
const auth = require("../middleware/auth");
const {
  postIdea,
  getIdeas,
  toggleLike,
  getUsers,
  getLikes,
} = require("../controllers/IdeaController");

const app = express.Router();

app.get("/", auth, getIdeas);

app.post("/", auth, postIdea);

app.put("/toggle-like", auth, toggleLike);

app.get("/likes", auth, getLikes);

module.exports = app;
