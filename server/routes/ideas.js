// routes/ideas.js
import express from "express";
import auth from "../middleware/auth.js";
import * as ideaController from "../controllers/ideasController.js";

const router = express.Router();

router.post("/", auth, ideaController.createIdea);
router.get("/", auth, ideaController.getIdeas);
router.put("/toggle-like", auth, ideaController.toggleLike);
router.get("/users", auth, ideaController.getUsers);
router.get("/likes", auth, ideaController.getLikes);

export default router;
