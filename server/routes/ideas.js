// routes/ideas.js
import express from "express";
import auth from "../middleware/auth.js";
import * as ideaController from "../controllers/ideasController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ideas
 *   description: Idea management APIs
 */

/**
 * @swagger
 * /ideas:
 *   post:
 *     summary: Create a new idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Idea created successfully
 */
router.post("/", auth, ideaController.createIdea);

/**
 * @swagger
 * /ideas:
 *   get:
 *     summary: Get all ideas
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ideas
 */
router.get("/", auth, ideaController.getIdeas);

/**
 * @swagger
 * /ideas/toggle-like:
 *   put:
 *     summary: Like or unlike an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ideaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Like toggled
 */
router.put("/toggle-like", auth, ideaController.toggleLike);

/**
 * @swagger
 * /ideas/users:
 *   get:
 *     summary: Get users who posted ideas
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */
router.get("/users", auth, ideaController.getUsers);

/**
 * @swagger
 * /ideas/likes:
 *   get:
 *     summary: Get likes for ideas
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Likes data
 */
router.get("/likes", auth, ideaController.getLikes);

export default router;
