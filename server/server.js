import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

import "./config/passport.js"; // Google OAuth strategy setup
import usersRoutes from "./routes/users.js";
import ideasRoutes from "./routes/ideas.js";
import authRoutes from "./middleware/auth.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // your React app
    credentials: true, // allow cookies for session
  })
);

app.use(express.json());

//  Express-session (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true only if using https
      httpOnly: true,
    },
  })
);

//  Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//  Routes
app.use("/api/users", usersRoutes);
app.use("/api/ideas", ideasRoutes);
app.use("/auth", authRoutes);

//  Root route (optional)
app.get("/", (req, res) => {
  res.send("Server is running and Google Auth is ready!");
});

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
