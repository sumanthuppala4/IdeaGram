// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import ideasRoutes from "./routes/ideas.js";
import authRoutes from "./routes/authRoutes.js"; 
import socket from "./socket.js";
// your auth register/login routes


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


(async () => {
  try {
    await connectDB(); // connects mongoose
    // mount routes
    app.use("/api/users", authRoutes);
    app.use("/api/ideas", ideasRoutes);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
    const io = socket.init(server);

    io.on("connection", (socket) => {
      console.log("New client connected");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
