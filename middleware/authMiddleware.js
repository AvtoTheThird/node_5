const jwt = require("jsonwebtoken");
const { readManager } = require("../utils/dataAccess");
const JWT_SECRET = "you-shall-not-pass";
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401);
  }
  const [bearer, token] = header.split(" ");
  // console.log(token);

  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "unauthorized: Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const users = readManager();
    // console.log(users);

    const user = users.find((u) => u.id === decoded.id);
    if (!user)
      return res.status(403).json({ message: "forbidden: User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "forbidden: Invalid token" });
  }
  next();
};
const authorize = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized: No user found" });
    }
    if (role === "superuser" && !req.user.super) {
      return res.status(403).json({ message: "insufficient privilege" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
