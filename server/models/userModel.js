// models/User.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  lastLoginAt: { type: Date },
});

// optional: createIndexes will be called on connect if you call createIndexes
userSchema.index({ username: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
