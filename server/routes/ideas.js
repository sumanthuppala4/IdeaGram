const db = require("../db/database");
const auth = require("../middleware/auth");

module.exports = (app) => {

  // Create Idea
  app.post("/api/ideas", auth, (req, res) => {
    const { title, description } = req.body;
    const stmt = db.prepare("INSERT INTO ideas(title, description, authorId) VALUES(?, ?, ?)");
    stmt.run(title, description, req.userId, function(err) {
      if (err) return res.status(500).json({ message: "Error creating idea" });

      db.get("SELECT * FROM ideas WHERE id = ?", [this.lastID], (err, idea) => {
        res.json(idea);
      });
    });
    stmt.finalize();
  });

  // Get all ideas
  app.get("/api/ideas", auth, (req, res) => {
    const query = `
      SELECT i.id, i.title, i.description, i.createdAt, u.username as author,
      (SELECT COUNT(*) FROM idea_likes il WHERE il.ideaId = i.id) as likesCount
      FROM ideas i
      JOIN users u ON u.id = i.authorId
      ORDER BY i.createdAt DESC
    `;
    db.all(query, [], (err, rows) => {
      if (err) return res.status(500).json({ message: "Error fetching ideas" });
      res.json(rows);
    });
  });

  // Like an idea
  app.put("/api/ideas/like/:id", auth, (req, res) => {
    const ideaId = req.params.id;
    const userId = req.userId;

    db.get("SELECT * FROM idea_likes WHERE userId = ? AND ideaId = ?", [userId, ideaId], (err, row) => {
      if (row) return res.json({ message: "Already liked" });

      const stmt = db.prepare("INSERT INTO idea_likes(userId, ideaId) VALUES(?, ?)");
      stmt.run(userId, ideaId, function(err) {
        if (err) return res.status(500).json({ message: "Error liking idea" });
        res.json({ message: "Idea liked" });
      });
      stmt.finalize();
    });
  });

};
