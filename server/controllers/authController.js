// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
const JWT_SECRET = process.env.JWT_SECRET ;

export const register = async (req, res) => {

    try {
        const { username, password } = req.body;
        if (!username || !password || password.length < 3) {
            return res.status(400).json({ message: "Invalid username/password" });
        }

        const normalizedUsername = username.toLowerCase().trim();
        const db = getDB();
        const users = db.collection("users");


        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user document
        const newUser = {
            username: normalizedUsername,
            passwordHash,
            createdAt: new Date(),
            lastLoginAt: null,
        };

        // Insert - unique index will prevent duplicates and throw error we can catch
        const result = await users.insertOne(newUser);

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: result.insertedId, username: normalizedUsername },
        });
    } catch (err) {
        // handle duplicate key error (username already exists)
        if (err?.code === 11000) {
            return res.status(409).json({ message: "Username already taken" });
        }
        console.error("Register error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

        const normalizedUsername = username.toLowerCase().trim();
        const db = getDB();
        const users = db.collection("users");

        const user = await users.findOne({ username: normalizedUsername });
        if (!user) return res.status(401).json({ message: "Invalid username or password" });

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) return res.status(401).json({ message: "Invalid username or password" });

        // update lastLoginAt
        await users.updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { lastLoginAt: new Date() } }
        );

        // sign JWT
        const token = jwt.sign(
            { sub: user._id.toString(), username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );


        return res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
