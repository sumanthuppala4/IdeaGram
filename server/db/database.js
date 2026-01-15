const sqlite3 = require("sqlite3").verbose();

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

  // Habits table
  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // Habit logs - tracks daily completions
  db.run(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      completedDate DATE NOT NULL,
      completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      points INTEGER DEFAULT 10,
      UNIQUE(habitId, userId, completedDate),
      FOREIGN KEY(habitId) REFERENCES habits(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // Challenges table
  db.run(`
    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      creatorId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      targetHabits INTEGER DEFAULT 1,
      pointsPerDay INTEGER DEFAULT 10,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active',
      FOREIGN KEY(creatorId) REFERENCES users(id)
    )
  `);

  // Challenge participants
  db.run(`
    CREATE TABLE IF NOT EXISTS challenge_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challengeId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      totalPoints INTEGER DEFAULT 0,
      UNIQUE(challengeId, userId),
      FOREIGN KEY(challengeId) REFERENCES challenges(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // User points - tracks total points earned
  db.run(`
    CREATE TABLE IF NOT EXISTS user_points (
      userId INTEGER PRIMARY KEY,
      totalPoints INTEGER DEFAULT 0,
      lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);
});

module.exports = db;
