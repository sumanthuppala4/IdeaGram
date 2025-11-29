// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "mydb";

export const connectDB = async () => {
  if (!uri) throw new Error("MONGO_URI not set in environment");

  // options - adjust as needed
  const opts = {
    dbName,
    // use new url parser and unified topology are default in modern mongoose
    // keep short timeouts for dev
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  };

  try {
    await mongoose.connect(uri, opts);
    console.log(`Mongoose connected to "${dbName}"`);

    // Ensure indexes (defined on schemas but ensure here too)
    // If you want to ensure indexes on startup:
    await Promise.all([
      mongoose.modelNames().includes("User") ? mongoose.model("User").createIndexes() : Promise.resolve(),
      mongoose.modelNames().includes("IdeaLike") ? mongoose.model("IdeaLike").createIndexes() : Promise.resolve(),
    ]).catch((err) => {
      // index creation can error if duplicates exist; surface but don't crash silently
      console.warn("Index creation warning:", err && err.message ? err.message : err);
    });

    return mongoose.connection.db;
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
};


