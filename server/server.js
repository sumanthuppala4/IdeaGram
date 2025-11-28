// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import ideasRoutes from "./routes/ideas.js";
import authRoutes from "./routes/authRoutes.js"; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

console.log("Starting server...");

(async () => {
  try {
    const db = await connectDB();
    console.log("hello")
    app.locals.db = db; // controllers will use req.app.locals.db

    // mount auth routes (register/login)
    app.use("/api/users", authRoutes);

    // mount ideas routes AFTER DB connected
    app.use("/api/ideas", ideasRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
