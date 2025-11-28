// config/db.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "test"

let client;
let db;

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    if (db) return db; // already connected


    client = new MongoClient(uri);

    await client.connect();
    db = client.db(dbName);

    // Create unique index on username
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
     await db.collection("idea_likes").createIndex(
      { ideaId: 1, userId: 1 },
      { unique: true }
    );

    console.log(`MongoDB connected to "${dbName}"`);
    return db;

  } catch (err) {
    console.error(" MongoDB connection error:", err);
    throw err; // important: rethrow so server.js knows it failed
  }
};

/**
 * getDB() - returns db instance after connectDB() called
 */
export const getDB = () => {
  if (!db) throw new Error("Database not connected. Call connectDB() first.");
  return db;
};

/**
 * closeDB() - optional helper to close the client
 */
export const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
