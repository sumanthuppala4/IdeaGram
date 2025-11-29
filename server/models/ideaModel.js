// models/Idea.js
import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ideaSchema = new Schema({
  description: { type: String, required: true, trim: true },
  authorId: { type: Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Idea || mongoose.model("Idea", ideaSchema);
