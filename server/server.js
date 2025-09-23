const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/ideas", require("./routes/ideas"));

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
