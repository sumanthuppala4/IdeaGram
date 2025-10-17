import express from "express";
import passport from "passport";

const router = express.Router();

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/dashboard",
  })
);

// Check if user authenticated
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

export default router;
