const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = "jwtSecretKey";

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, password: hashPassword });

    console.log(user.id,"userId")

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, username });
  } catch (error) {
    res.status(400).json({ message: "Username already exists" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  const user = await User.findOne({
    where: {
      username:username
    },
  });


  if (!user) {
    return res.status(400).json({ message: "Not A registred User" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, username: user.username });
}

async function getUsers(req, res) {
  const users = await User.findAll({});
  return res.json(users);
}

module.exports = { register, login ,getUsers};
