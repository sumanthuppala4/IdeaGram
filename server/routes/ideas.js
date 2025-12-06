import express from "express";
import { createIdea, getIdeas, getLikes, toggleLike } from "../controllers/ideaController.js";
import { auth } from "../middleware/auth.js";

const app = express.Router();

// Get all ideas
app.get("/", auth, getIdeas);

app.post("/", auth, createIdea);

app.put("/toggle-like", auth, toggleLike);

app.get("/likes", auth, getLikes);

export default app;
