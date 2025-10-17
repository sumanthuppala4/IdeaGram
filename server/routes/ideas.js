import express from "express";
import db from "../db/database.js";
// Use Passport session instead of JWT middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Unauthorized" });
};

const router = express.Router();

router.post("/", ensureAuthenticated, (req, res) => {
  const { description } = req.body;
  const user = req.user;
  if (!user || !user.id) {
    return res.status(401).json({ message: "Unauthorized: missing session user" });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ message: "Description is required" });
  }

  const stmt = db.prepare(
    "INSERT INTO ideas(description, authorId) VALUES(?, ?)"
  );
  stmt.run(description.trim(), user.id, function (err) {
    if (err) {
      console.error("Error creating idea:", err);
      return res.status(500).json({ message: "Error creating idea", error: err.message });
    }

    db.get(
      "SELECT i.id, i.description, i.createdAt, u.username as author FROM ideas i JOIN users u ON u.id = i.authorId WHERE i.id = ?",
      [this.lastID],
      (err2, idea) => {
        if (err2) {
          console.error("Error fetching idea:", err2);
          return res.status(500).json({ message: "Error fetching idea", error: err2.message });
        }
        res.status(200).json(idea);
      }
    );
  });
  stmt.finalize();
});

// Get all ideas
router.get("/", ensureAuthenticated, (req, res) => {
  const userId = req.user.id;
  const query = `
      SELECT i.id, i.description, i.createdAt, u.username as author,
      (SELECT COUNT(*) FROM idea_likes il WHERE il.ideaId = i.id) as likesCount,
      EXISTS(SELECT 1 FROM idea_likes il2 WHERE il2.ideaId = i.id AND il2.userId = ?) as liked
      FROM ideas i
      JOIN users u ON u.id = i.authorId
      ORDER BY i.createdAt DESC
    `;
  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching ideas" });
    res.status(200).json(rows);
  });
});

router.put("/toggle-like", ensureAuthenticated, (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  // Check if user already liked
  db.get(
    "SELECT * FROM idea_likes WHERE ideaId = ? AND userId = ?",
    [id, userId],
    (err, row) => {
      if (row) {
        // Unlike (remove like)
        db.run(
          "DELETE FROM idea_likes WHERE ideaId = ? AND userId = ?",
          [id, userId],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            // Update likes count
            db.get(
              "SELECT COUNT(*) as likes FROM idea_likes WHERE ideaId = ?",
              [id],
              (err3, countRow) => {
                res.json({ liked: false, likes: countRow.likes });
              }
            );
          }
        );
      } else {
        // Add like
        db.run(
          "INSERT INTO idea_likes (ideaId, userId) VALUES (?, ?)",
          [id, userId],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            db.get(
              "SELECT COUNT(*) as likes FROM idea_likes WHERE ideaId = ?",
              [id],
              (err3, countRow) => {
                res.json({ liked: true, likes: countRow.likes });
              }
            );
          }
        );
      }
    }
  );
});

router.get("/users", ensureAuthenticated, (req, res) => {
  const query = `
      SELECT * FROM users
    `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching users" });
    res.status(200).json(rows);
  });
});

router.get("/likes", ensureAuthenticated, (req, res) => {
  const query = `
      SELECT * FROM idea_likes
    `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching likes" });
    res.status(200).json(rows);
  });
});

export default router;
