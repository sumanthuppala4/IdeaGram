// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const JWT_SECRET = (process.env.JWT_SECRET || "").trim();
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

/**
 * Helper: create JWT token
 * payload uses standard "sub" for subject (user id)
 */
const createToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

/**
 * POST /api/auth/register
 * body: { username, password }
 */
export const register = async (req, res) => {
  try {
    const { username, password } = req.body ?? {};

    if (
      !username ||
      !password ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res
        .status(400)
        .json({ message: "Username and password (min 6 chars) are required" });
    }

    const normalizedUsername = username.toLowerCase().trim();

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      username: normalizedUsername,
      passwordHash,
      createdAt: new Date(),
    });

    // Respond with safe user info
    return res.status(201).json({
      message: "User registered",
      user: {
        id: user._id.toString(),
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    // Handle duplicate username (unique index)
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Username already taken" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/auth/login
 * body: { username, password }
 * returns: { token, user }
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    const normalizedUsername = username.toLowerCase().trim();
    const user = await User.findOne({ username: normalizedUsername }).exec();

    // Generic message to avoid user enumeration
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid username or password" });

    // update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = createToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/auth/me
 * Protected: expects middleware to set req.userId (string)
 */
export const me = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // normalize id property
    user.id = user._id.toString();
    delete user._id;

    return res.json({ user });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
