const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();
const JWT_SECRET = "jwtSecretKey";

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: "Hashing error" });

    const stmt = db.prepare(
      "INSERT INTO users(username, password) VALUES (?, ?)"
    );
    stmt.run(username, hashedPassword, function (err) {
      if (err)
        return res.status(400).json({ message: "Username already exists" });

      const token = jwt.sign({ id: this.lastID }, JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ token, username });
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user)
      return res.status(400).json({ message: "Invalid credentials" });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
      res.json({ token, username: user.username });
    });
  });
});

module.exports = router;
