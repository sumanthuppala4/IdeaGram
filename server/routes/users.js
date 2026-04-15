const express = require("express");

const { register, login, getUsers } = require("../controllers/UserController");

const router = express.Router();

router.post("/register", register);

// Login
router.post("/login", login);
router.get("/", getUsers);

module.exports = router;
