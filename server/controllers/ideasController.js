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


 const ideas = await Idea.find().populate("authorId","username").lean().select('-__v'); 
 
 console.log({ideas});
 // .lean() returns plain JS objects
// optionally rename _id -> id
let cleaned = ideas.map(({ _id,authorId, ...rest }) => ({ id: String(_id),author:authorId.username, ...rest }));

let ideasWithLikes=[];


for (const idea of cleaned) {
  const likesCount = await IdeaLike.countDocuments({ ideaId: idea.id });
  ideasWithLikes.push({ ...idea, likesCount });
}
    return res.status(200).json(ideasWithLikes);
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
