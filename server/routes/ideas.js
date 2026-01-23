const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");
const {
  postIdea,
  getIdeas,
  toggleLike,
  getUsers,
  getLikes,
} = require("../controllers/IdeaController");

const app = express.Router();

app.post("/", auth, postIdea);

// Get all ideas
app.get("/", auth, getIdeas);

app.put("/toggle-like", auth, toggleLike);

app.get("/users", auth, getUsers);

app.get("/likes", auth, getLikes);

module.exports = app;
