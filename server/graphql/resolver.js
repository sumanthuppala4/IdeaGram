import User from "./../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ideaModel from "../models/ideaModel.js";

import IdeaLike from "../models/IdeaLike.js";

dotenv.config();

export const createUser = async (args, req) => {
  const userData = args.userInput;

  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error("User already exists.");
  }

  const password = userData.password;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username: userData.username,
    passwordHash: hashedPassword,
  });

  const createdUser = await user.save();
  return { ...createdUser._doc, _id: createdUser._id.toString() };

  // In real application, hash the password before storing
};

export const login = async (args, req) => {
  const username = args.username;
  const password = args.password;

  const user = await User.findOne({ username: username });
  if (!user) {
    throw new Error("User does not exist.");
  }
  const isEqual = await bcrypt.compare(password, user.passwordHash);
  if (!isEqual) {
    const error = new Error("Password is incorrect.");
    error.code = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { userId: user._id.toString(), token: token };
};

export const createIdea = async (args, req) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated! Sumanth try logging in.");
    error.code = 401;
    throw error;
  }

  const user = await User.findById(req.userId);

  if (!user) {
    const error = new Error("User not found.");
    error.code = 404;
    throw error;
  }

  const idea = new ideaModel({
    description: args.ideaInput.description,
    authorId: user._id,
  });

  const createdIdea = await idea.save();

  return {
    ...createdIdea._doc,
    _id: createdIdea._id.toString(),
    creator: user,
    description: createdIdea.description,
  };
};

export const getIdeas = async (args, req) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated!");
    error.code = 401;
    throw error;
  }
  const ideas = await ideaModel.find().populate("authorId");

  let ideasList = [];

  for (const idea of ideas) {
    {
      const likesCount = await IdeaLike.countDocuments({ ideaId: idea._id });
      const likedByUser = await IdeaLike.exists({
        ideaId: idea._id,
        userId: req.userId,
      });

      ideasList.push({
        _id: idea._id.toString(),
        description: idea.description,
        creator: idea.authorId,
        likesCount: likesCount,
        likedByUser: !!likedByUser,
      });
    }
  }

  return ideasList;
};

export const toggleLike = async (args, req) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated!");
    error.code = 401;
    throw error;
  }

  const currentIdea = await IdeaLike.findOne({
    ideaId: args.ideaId,
    userId: req.userId,
  });

  if (currentIdea) {
    await IdeaLike.deleteOne({ _id: currentIdea._id });
    return { success: "like removed" };
  }

  const newLike = new IdeaLike({
    ideaId: args.ideaId,
    userId: req.userId,
  });

  await newLike.save();

  return { success: "like added" };
};

export default { createUser, login, createIdea, getIdeas, toggleLike };
