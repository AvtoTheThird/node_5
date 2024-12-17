const {
  readData,
  writeData,
  sortByPosition,
  writeManager,
  readManager,
} = require("../utils/dataAccess");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "you-shall-not-pass";

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    super: false,
  };

  const users = readManager();
  users.push(newUser);

  writeManager(users);
  res.status(201).json({ message: "user registered successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400);
  }
  const users = readManager();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "invalid email or password" });
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: "invalid email or password" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "5m",
  });
  res.json({ token });
};
module.exports = { register, login };
