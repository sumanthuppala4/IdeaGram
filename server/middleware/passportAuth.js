import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";

import db from "./../db/database.js";

const app = express.Router();

// --- Register ---
app.post("/register", async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({ error: "Already logged in" });
  }

  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (user) return res.status(400).json({ error: "User already exists" });

      const hashed = await bcrypt.hash(password, 10);
      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashed],
        function (err) {
          if (err) return res.status(500).json({ error: "Insert failed" });

          db.get(
            "SELECT * FROM users WHERE id = ?",
            [this.lastID],
            (err, newUser) => {
              if (err) return res.status(500).json({ error: "Fetch failed" });
              req.login(newUser, (err) => {
                if (err)
                  return res.status(500).json({ error: "Auto-login failed" });
                res.json({ message: "Registered & logged in", user: newUser });
              });
            }
          );
        }
      );
    }
  );
});

// --- Login ---
app.post("/login", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({ error: "Already logged in" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (!user)
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      const { password, ...safeUser } = user;
      res.json({ message: "Login successful", user: safeUser });
    });
  })(req, res, next);
});

// --- Check Auth ---
app.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) res.json({ authenticated: true, user: req.user });
  else res.json({ authenticated: false });
});

// --- Logout ---
app.post("/logout", (req, res) => {
  req.logout(() => res.json({ message: "Logged out" }));
});

export default app;
