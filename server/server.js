const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require("./socket/socketHandler");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket handler
initializeSocket(io);

// Make io available to routes
app.set("io", io);

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Error handling middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/ideas", require("./routes/ideas"));
app.use("/api/habits", require("./routes/habits"));
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/leaderboard", require("./routes/leaderboard"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server initialized`);
});
