const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, "SECRET123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

module.exports = auth;