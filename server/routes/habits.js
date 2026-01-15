const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all habits for a user
router.get("/", auth, (req, res) => {
  const userId = req.userId;
  db.all(
    "SELECT * FROM habits WHERE userId = ? ORDER BY createdAt DESC",
    [userId],
    (err, habits) => {
      if (err) return res.status(500).json({ message: "Error fetching habits" });
      res.json(habits);
    }
  );
});

// Create a new habit
router.post("/", auth, (req, res) => {
  const { name, description } = req.body;
  const userId = req.userId;

  if (!name) {
    return res.status(400).json({ message: "Habit name is required" });
  }

  const stmt = db.prepare(
    "INSERT INTO habits(userId, name, description) VALUES(?, ?, ?)"
  );
  stmt.run(userId, name, description || "", function (err) {
    if (err) {
      return res.status(500).json({ message: "Error creating habit" });
    }
    db.get("SELECT * FROM habits WHERE id = ?", [this.lastID], (err, habit) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching created habit" });
      }
      res.status(201).json(habit);
    });
  });
  stmt.finalize();
});

// Update a habit
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = req.userId;

  // Verify ownership
  db.get("SELECT * FROM habits WHERE id = ? AND userId = ?", [id, userId], (err, habit) => {
    if (err || !habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const stmt = db.prepare(
      "UPDATE habits SET name = ?, description = ? WHERE id = ? AND userId = ?"
    );
    stmt.run(name || habit.name, description !== undefined ? description : habit.description, id, userId, function (err) {
      if (err) {
        return res.status(500).json({ message: "Error updating habit" });
      }
      db.get("SELECT * FROM habits WHERE id = ?", [id], (err, updatedHabit) => {
        if (err) {
          return res.status(500).json({ message: "Error fetching updated habit" });
        }
        res.json(updatedHabit);
      });
    });
    stmt.finalize();
  });
});

// Delete a habit
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Verify ownership
  db.get("SELECT * FROM habits WHERE id = ? AND userId = ?", [id, userId], (err, habit) => {
    if (err || !habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    db.run("DELETE FROM habits WHERE id = ? AND userId = ?", [id, userId], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting habit" });
      }
      res.json({ message: "Habit deleted successfully" });
    });
  });
});

// Log habit completion for today
router.post("/:id/complete", auth, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Verify habit exists and belongs to user
  db.get("SELECT * FROM habits WHERE id = ? AND userId = ?", [id, userId], (err, habit) => {
    if (err || !habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Check if already completed today
    db.get(
      "SELECT * FROM habit_logs WHERE habitId = ? AND userId = ? AND completedDate = ?",
      [id, userId, today],
      (err, existingLog) => {
        if (existingLog) {
          return res.status(400).json({ message: "Habit already completed today" });
        }

        const points = 10; // Default points per completion
        const stmt = db.prepare(
          "INSERT INTO habit_logs(habitId, userId, completedDate, points) VALUES(?, ?, ?, ?)"
        );
        stmt.run(id, userId, today, points, function (err) {
          if (err) {
            return res.status(500).json({ message: "Error logging habit completion" });
          }

          // Update user points
          db.run(
            "INSERT OR REPLACE INTO user_points(userId, totalPoints, lastUpdated) VALUES(?, COALESCE((SELECT totalPoints FROM user_points WHERE userId = ?), 0) + ?, CURRENT_TIMESTAMP)",
            [userId, userId, points],
            (err) => {
              if (err) console.error("Error updating user points:", err);
              else {
                // Emit real-time update via Socket.io
                const io = req.app.get("io");
                if (io) {
                  db.get("SELECT totalPoints FROM user_points WHERE userId = ?", [userId], (err, result) => {
                    if (!err && result) {
                      io.to("leaderboard:global").emit("leaderboard:updated", {
                        userId,
                        totalPoints: result.totalPoints,
                        timestamp: new Date().toISOString(),
                      });
                      io.to("habits:global").emit("habit:completed", {
                        userId,
                        habitId: id,
                        points,
                        timestamp: new Date().toISOString(),
                      });
                    }
                  });
                }
              }
            }
          );

          // Update challenge points if user is in active challenges
          db.all(
            `SELECT cp.id, cp.challengeId, cp.totalPoints 
             FROM challenge_participants cp 
             JOIN challenges c ON c.id = cp.challengeId 
             WHERE cp.userId = ? AND c.status = 'active' 
             AND DATE('now') BETWEEN c.startDate AND c.endDate`,
            [userId],
            (err, participants) => {
              if (!err && participants) {
                participants.forEach((participant) => {
                  db.run(
                    "UPDATE challenge_participants SET totalPoints = totalPoints + ? WHERE id = ?",
                    [points, participant.id],
                    (err) => {
                      if (err) console.error("Error updating challenge points:", err);
                    }
                  );
                });
              }
            }
          );

          res.json({ message: "Habit completed!", points });
        });
        stmt.finalize();
      }
    );
  });
});

// Get habit completion history
router.get("/:id/logs", auth, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Verify ownership
  db.get("SELECT * FROM habits WHERE id = ? AND userId = ?", [id, userId], (err, habit) => {
    if (err || !habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    db.all(
      "SELECT * FROM habit_logs WHERE habitId = ? AND userId = ? ORDER BY completedDate DESC",
      [id, userId],
      (err, logs) => {
        if (err) {
          return res.status(500).json({ message: "Error fetching habit logs" });
        }
        res.json(logs);
      }
    );
  });
});

// Get today's completion status for all user habits
router.get("/today/status", auth, (req, res) => {
  const userId = req.userId;
  const today = new Date().toISOString().split("T")[0];

  db.all(
    `SELECT h.id, h.name, h.description, 
     CASE WHEN hl.id IS NOT NULL THEN 1 ELSE 0 END as completed
     FROM habits h
     LEFT JOIN habit_logs hl ON h.id = hl.habitId AND hl.userId = ? AND hl.completedDate = ?
     WHERE h.userId = ?
     ORDER BY h.createdAt DESC`,
    [userId, today, userId],
    (err, habits) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching today's habits" });
      }
      res.json(habits);
    }
  );
});

module.exports = router;
