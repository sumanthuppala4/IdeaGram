// controllers/ideaController.js
import mongoose from "mongoose";
import Idea from "../models/ideaModel.js";
import IdeaLike from "../models/IdeaLike.js";
import User from "../models/userModel.js";

const ObjectId = mongoose.Types.ObjectId;

/**
 * POST /api/ideas
 */
export const createIdea = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || !description.trim()) return res.status(400).json({ message: "Description is required" });

    const authorId = req.userId;
    if (!authorId) return res.status(401).json({ message: "Unauthorized" });

    const idea = await Idea.create({
      description: description.trim(),
      authorId: new ObjectId(authorId),
    });

    // populate author's username
    const populated = await Idea.aggregate([
      { $match: { _id: idea._id } },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          id: "$_id",
          description: 1,
          createdAt: 1,
          author: "$author.username",
        },
      },
    ]);

    return res.status(201).json(populated[0]);
  } catch (err) {
    console.error("createIdea error:", err);
    return res.status(500).json({ message: "Error creating idea" });
  }
};

/**
 * GET /api/ideas
 */
export const getIdeas = async (req, res) => {
  try {
    const userId = req.userId ? new ObjectId(req.userId) : null;

    // aggregation to get author, likes count and liked boolean
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "idealikess", // wrong? must be collection name "idealikess"? -> fix below
        },
      },
    ];

    // We'll use a clearer pipeline:
    const agg = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "idealikess", // placeholder - but we'll avoid mistake and use correct name below
        },
      },
    ];

    // Correct pipeline (using correct collection names: "idea_likes")
    const pipelineCorrect = [
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "idea_likes",
          localField: "_id",
          foreignField: "ideaId",
          as: "likes",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          liked: userId ? { $in: [userId, "$likes.userId"] } : false,
        },
      },
      {
        $project: {
          id: "$_id",
          description: 1,
          createdAt: 1,
          author: "$author.username",
          likesCount: 1,
          liked: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const rows = await Idea.aggregate(pipelineCorrect).exec();
    // convert id fields to string
    const normalized = rows.map((r) => ({ ...r, id: r.id.toString() }));
    return res.status(200).json(normalized);
  } catch (err) {
    console.error("getIdeas error:", err);
    return res.status(500).json({ message: "Error fetching ideas" });
  }
};

/**
 * POST /api/ideas/toggle-like
 */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.body; // idea id
    if (!id) return res.status(400).json({ message: "Missing idea id" });
    const ideaId = new ObjectId(id);
    const userId = new ObjectId(req.userId);

    try {
      // try insert
      await IdeaLike.create({ ideaId, userId });
      const likes = await IdeaLike.countDocuments({ ideaId });
      return res.json({ liked: true, likes });
    } catch (err) {
      // duplicate key error -> remove like
      if (err.code === 11000) {
        await IdeaLike.deleteOne({ ideaId, userId });
        const likes = await IdeaLike.countDocuments({ ideaId });
        return res.json({ liked: false, likes });
      }
      throw err;
    }
  } catch (err) {
    console.error("toggleLike error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/ideas/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort("id").lean();
    const mapped = users.map((u) => ({ id: u._id.toString(), username: u.username, createdAt: u.createdAt }));
    return res.status(200).json(mapped);
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

/**
 * GET /api/ideas/likes
 */
export const getLikes = async (req, res) => {
  try {
    const rows = await IdeaLike.find().lean();
    const mapped = rows.map((r) => ({ ideaId: r.ideaId.toString(), userId: r.userId.toString() }));
    return res.status(200).json(mapped);
  } catch (err) {
    console.error("getLikes error:", err);
    return res.status(500).json({ message: "Error fetching likes" });
  }
};
