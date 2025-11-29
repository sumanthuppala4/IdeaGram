// models/IdeaLike.js
import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ideaLikeSchema = new Schema({
  ideaId: { type: Types.ObjectId, ref: "Idea", required: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: () => new Date() },
});

// prevent duplicate likes
ideaLikeSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

export default mongoose.models.IdeaLike || mongoose.model("IdeaLike", ideaLikeSchema);
