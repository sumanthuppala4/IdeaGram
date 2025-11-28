// controllers/ideaController.js
import * as ideaModel from "../models/ideaModel.js";

/**
 * Expect req.userId to be a string (ObjectId string)
 * Expect app.locals.db to be initialized
 */

export const createIdea = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || !description.trim()) return res.status(400).json({ message: "Description required" });

    const db = req.app.locals.db;
    const authorId = req.userId;
    const idea = await ideaModel.createIdea(db, { description: description.trim(), authorId });

    return res.status(201).json(idea);
  } catch (err) {
    console.error("createIdea error:", err);
    return res.status(500).json({ message: "Error creating idea" });
  }
};

export const getIdeas = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.userId; // may be undefined for anonymous calls (but auth should set)
    const rows = await ideaModel.getAllIdeas(db, userId);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("getIdeas error:", err);
    return res.status(500).json({ message: "Error fetching ideas" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Missing idea id" });

    const db = req.app.locals.db;
    const userId = req.userId;
    const result = await ideaModel.toggleLike(db, id, userId);
    return res.json(result);
  } catch (err) {
    console.error("toggleLike error:", err);
    // handle duplicate / constraint errors if any
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const rows = await ideaModel.getUsers(db);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

export const getLikes = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const rows = await ideaModel.getLikes(db);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("getLikes error:", err);
    return res.status(500).json({ message: "Error fetching likes" });
  }
};
