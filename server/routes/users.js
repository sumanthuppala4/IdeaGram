const express = require("express");

const { register ,login} = require("../controllers/UserController");

const router = express.Router();


router.post("/register", register);

// Login
router.post("/login",login);

module.exports = router;
