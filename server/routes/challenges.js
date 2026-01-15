const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all active challenges
router.get("/", auth, (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  db.all(
    `SELECT c.*, u.username as creatorName,
     (SELECT COUNT(*) FROM challenge_participants WHERE challengeId = c.id) as participantCount
     FROM challenges c
     JOIN users u ON u.id = c.creatorId
     WHERE c.status = 'active' AND DATE('now') BETWEEN c.startDate AND c.endDate
     ORDER BY c.createdAt DESC`,
    [],
    (err, challenges) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching challenges" });
      }
      res.json(challenges);
    }
  );
});

// Get user's active challenges
router.get("/my-challenges", auth, (req, res) => {
  const userId = req.userId;
  const today = new Date().toISOString().split("T")[0];

  db.all(
    `SELECT c.*, u.username as creatorName, cp.totalPoints as myPoints,
     (SELECT COUNT(*) FROM challenge_participants WHERE challengeId = c.id) as participantCount
     FROM challenges c
     JOIN challenge_participants cp ON cp.challengeId = c.id
     JOIN users u ON u.id = c.creatorId
     WHERE cp.userId = ? AND c.status = 'active' AND DATE('now') BETWEEN c.startDate AND c.endDate
     ORDER BY c.createdAt DESC`,
    [userId],
    (err, challenges) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching user challenges" });
      }
      res.json(challenges);
    }
  );
});

// Create a new challenge
router.post("/", auth, (req, res) => {
  const { name, description, startDate, endDate, targetHabits, pointsPerDay } = req.body;
  const creatorId = req.userId;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ message: "Name, start date, and end date are required" });
  }

  const stmt = db.prepare(
    "INSERT INTO challenges(creatorId, name, description, startDate, endDate, targetHabits, pointsPerDay) VALUES(?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    creatorId,
    name,
    description || "",
    startDate,
    endDate,
    targetHabits || 1,
    pointsPerDay || 10,
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Error creating challenge" });
      }

      const challengeId = this.lastID;

      // Auto-join creator to challenge
      const participantStmt = db.prepare(
        "INSERT INTO challenge_participants(challengeId, userId) VALUES(?, ?)"
      );
      participantStmt.run(challengeId, creatorId, (err) => {
        if (err) console.error("Error adding creator to challenge:", err);
      });
      participantStmt.finalize();

      db.get(
        `SELECT c.*, u.username as creatorName,
         (SELECT COUNT(*) FROM challenge_participants WHERE challengeId = c.id) as participantCount
         FROM challenges c
         JOIN users u ON u.id = c.creatorId
         WHERE c.id = ?`,
        [challengeId],
        (err, challenge) => {
          if (err) {
            return res.status(500).json({ message: "Error fetching created challenge" });
          }
          res.status(201).json(challenge);
        }
      );
    }
  );
  stmt.finalize();
});

// Join a challenge
router.post("/:id/join", auth, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Check if challenge exists and is active
  db.get(
    "SELECT * FROM challenges WHERE id = ? AND status = 'active' AND DATE('now') BETWEEN startDate AND endDate",
    [id],
    (err, challenge) => {
      if (err || !challenge) {
        return res.status(404).json({ message: "Challenge not found or not active" });
      }

      // Check if already joined
      db.get(
        "SELECT * FROM challenge_participants WHERE challengeId = ? AND userId = ?",
        [id, userId],
        (err, existing) => {
          if (existing) {
            return res.status(400).json({ message: "Already joined this challenge" });
          }

      const stmt = db.prepare(
        "INSERT INTO challenge_participants(challengeId, userId) VALUES(?, ?)"
      );
      stmt.run(id, userId, function (err) {
        if (err) {
          return res.status(500).json({ message: "Error joining challenge" });
        }

        // Emit real-time update via Socket.io
        const io = req.app.get("io");
        if (io) {
          db.get("SELECT username FROM users WHERE id = ?", [userId], (err, user) => {
            if (!err && user) {
              io.to(`challenge:${id}`).emit("challenge:participant-joined", {
                userId,
                username: user.username,
                challengeId: id,
                timestamp: new Date().toISOString(),
              });
            }
          });
        }

            db.get(
              `SELECT c.*, u.username as creatorName, cp.totalPoints as myPoints,
               (SELECT COUNT(*) FROM challenge_participants WHERE challengeId = c.id) as participantCount
               FROM challenges c
               JOIN challenge_participants cp ON cp.challengeId = c.id
               JOIN users u ON u.id = c.creatorId
               WHERE c.id = ? AND cp.userId = ?`,
              [id, userId],
              (err, challenge) => {
                if (err) {
                  return res.status(500).json({ message: "Error fetching challenge" });
                }
                res.json({ message: "Successfully joined challenge!", challenge });
              }
            );
          });
          stmt.finalize();
        }
      );
    }
  );
});

// Get challenge leaderboard
router.get("/:id/leaderboard", auth, (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT u.id, u.username, cp.totalPoints, cp.joinedAt
     FROM challenge_participants cp
     JOIN users u ON u.id = cp.userId
     WHERE cp.challengeId = ?
     ORDER BY cp.totalPoints DESC, cp.joinedAt ASC
     LIMIT 50`,
    [id],
    (err, leaderboard) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching leaderboard" });
      }
      res.json(leaderboard);
    }
  );
});

module.exports = router;
