// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import ideasRoutes from "./routes/ideas.js";
import authRoutes from "./routes/authRoutes.js"; // your auth register/login routes

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    await connectDB(); // connects mongoose
    // mount routes
    app.use("/api/auth", authRoutes);
    app.use("/api/ideas", ideasRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
