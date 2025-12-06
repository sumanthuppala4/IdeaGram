import express from "express";
import {
  checkAuth,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/userController.js";

const app = express();

app.post("/register", userRegister);

app.post("/login", userLogin);

app.get("/check", checkAuth);

// --- Logout ---
app.post("/logout", userLogout);

export default app;
