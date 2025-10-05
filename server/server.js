import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import db from "./db/database.js";
import initialize from "./middleware/passportConfig.js";
import userRoutes from "./routes/users.js";
import ideaRoutes from "./routes/ideas.js";

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
initialize(passport);

app.use("/api/ideas", ideaRoutes);
app.use("api/users", userRoutes);

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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
