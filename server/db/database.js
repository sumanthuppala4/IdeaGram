import sqlite3 from "sqlite3";

// Enable verbose logging (optional)
sqlite3.verbose();

// Create / connect to database file
// Note: database file is in the server root, so path is relative to this folder
const db = new sqlite3.Database("../ideasDB.sqlite", (err) => {
  if (err) {
    console.error(" Failed to connect to SQLite database:", err.message);
  } else {
    console.log(" Connected to SQLite database");
  }
});

// Create tables if not exist
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      googleId TEXT UNIQUE,
      username TEXT ,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // Ideas table
  db.run(`
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      authorId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(authorId) REFERENCES users(id)
    )
  `);

  // Likes table
  db.run(`
    CREATE TABLE IF NOT EXISTS idea_likes (
      userId INTEGER,
      ideaId INTEGER,
      PRIMARY KEY(userId, ideaId),
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(ideaId) REFERENCES ideas(id)
    )
  `);
});

export default db;
