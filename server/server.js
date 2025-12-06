import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import cors from "cors";
import initialize from "./middleware/passportConfig.js";
import userRoutes from "./routes/users.js";
import ideaRoutes from "./routes/ideas.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 1000 }, // 1 minute for testing
  })
);

app.use(passport.initialize());
app.use(passport.session());
initialize(passport);

app.use("/api/ideas", ideaRoutes);
app.use("/api/auth", userRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
