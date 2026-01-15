const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

// Get global leaderboard (all users by total points)
router.get("/global", auth, (req, res) => {
  db.all(
    `SELECT u.id, u.username, COALESCE(up.totalPoints, 0) as totalPoints
     FROM users u
     LEFT JOIN user_points up ON up.userId = u.id
     ORDER BY COALESCE(up.totalPoints, 0) DESC, u.username ASC
     LIMIT 100`,
    [],
    (err, leaderboard) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching leaderboard" });
      }
      res.json(leaderboard);
    }
  );
});

// Get user's current points and rank
router.get("/my-stats", auth, (req, res) => {
  const userId = req.userId;

  db.get(
    `SELECT COALESCE(up.totalPoints, 0) as totalPoints
     FROM user_points up
     WHERE up.userId = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching user stats" });
      }

      const totalPoints = stats ? stats.totalPoints : 0;

      // Calculate rank
      db.get(
        `SELECT COUNT(*) + 1 as rank
         FROM users u
         LEFT JOIN user_points up ON up.userId = u.id
         WHERE COALESCE(up.totalPoints, 0) > ?`,
        [totalPoints],
        (err, rankResult) => {
          if (err) {
            return res.status(500).json({ message: "Error calculating rank" });
          }

          res.json({
            totalPoints,
            rank: rankResult ? rankResult.rank : 1,
          });
        }
      );
    }
  );
});

module.exports = router;
