import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./ideasDB.sqlite", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database");
});

// Create tables if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      authorId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(authorId) REFERENCES users(id)
    )
  `);

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
