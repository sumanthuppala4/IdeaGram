const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const app = express.Router();

app.post("/", auth, (req, res) => {
  const { description } = req.body;
  const stmt = db.prepare(
    "INSERT INTO ideas(description, authorId) VALUES(?, ?)"
  );
  stmt.run(description, req.userId, function (err) {
    if (err) return res.status(500).json({ message: "Error creating idea" });

    db.get(
      "SELECT i.id, i.description, i.createdAt, u.username as author FROM ideas i JOIN users u ON u.id = i.authorId WHERE i.id = ?",
      [this.lastID],
      (err, idea) => {
        if (err)
          return res.status(500).json({ message: err + "Error fetching idea" });
        res.status(200).json(idea);
      }
    );
  });
  stmt.finalize();
});

// Get all ideas
app.get("/", auth, (req, res) => {
  const userId = req.userId;
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

app.put("/toggle-like", auth, (req, res) => {
  const { id } = req.body;
  const userId = req.userId;

  // Check if user already liked
  db.get(
    "SELECT * FROM idea_likes WHERE idea_id = ? AND user_id = ?",
    [id, userId],
    (err, row) => {
      if (row) {
        // Unlike (remove like)
        db.run(
          "DELETE FROM idea_likes WHERE idea_id = ? AND user_id = ?",
          [id, userId],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            // Update likes count
            db.get(
              "SELECT COUNT(*) as likes FROM idea_likes WHERE idea_id = ?",
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

app.get("/users", auth, (req, res) => {
  const query = `
      SELECT * FROM users
    `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching users" });
    res.status(200).json(rows);
  });
});

app.get("/likes", auth, (req, res) => {
  const query = `
      SELECT * FROM idea_likes
    `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error fetching likes" });
    res.status(200).json(rows);
  });
});

module.exports = app;
