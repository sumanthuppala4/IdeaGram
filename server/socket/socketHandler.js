const jwt = require("jsonwebtoken");

// Store active users and their socket connections
const activeUsers = new Map(); // userId -> socketId
const socketToUser = new Map(); // socketId -> userId

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, "jwtSecretKey");
    socket.userId = decoded.id;
    socket.username = decoded.username;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
};

const initializeSocket = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.userId;
    const username = socket.username;

    console.log(`User ${username} (${userId}) connected: ${socket.id}`);

    // Store user connection
    activeUsers.set(userId, socket.id);
    socketToUser.set(socket.id, userId);

    // Join user-specific room
    socket.join(`user:${userId}`);

    // Join global rooms for real-time updates
    socket.join("habits:global");
    socket.join("challenges:global");
    socket.join("leaderboard:global");

    // Emit user connected event
    io.to("leaderboard:global").emit("user:connected", { userId, username });

    // Handle habit completion - broadcast to all users
    socket.on("habit:completed", (data) => {
      io.to("habits:global").emit("habit:completed", {
        userId,
        username,
        habitId: data.habitId,
        points: data.points,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle challenge join - broadcast to challenge participants
    socket.on("challenge:joined", (data) => {
      io.to(`challenge:${data.challengeId}`).emit("challenge:participant-joined", {
        userId,
        username,
        challengeId: data.challengeId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle points update - broadcast to leaderboard
    socket.on("points:updated", (data) => {
      io.to("leaderboard:global").emit("leaderboard:updated", {
        userId,
        username,
        totalPoints: data.totalPoints,
        timestamp: new Date().toISOString(),
      });
    });

    // Join specific challenge room
    socket.on("challenge:subscribe", (challengeId) => {
      socket.join(`challenge:${challengeId}`);
    });

    // Leave challenge room
    socket.on("challenge:unsubscribe", (challengeId) => {
      socket.leave(`challenge:${challengeId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${username} (${userId}) disconnected: ${socket.id}`);
      activeUsers.delete(userId);
      socketToUser.delete(socket.id);
      io.to("leaderboard:global").emit("user:disconnected", { userId, username });
    });
  });

  return io;
};

// Helper function to emit to specific user
const emitToUser = (io, userId, event, data) => {
  const socketId = activeUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

// Helper function to broadcast to all users
const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};

module.exports = {
  initializeSocket,
  emitToUser,
  broadcastToAll,
};
