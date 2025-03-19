const { verifyToken } = require("../utils/token");

const authenticateToken = (req, res, next) => {
  const token = req.query.token || req.body.token;
  const user = verifyToken(token, process.env.JWT_SECRET);

  if (!user) {
    return res.status(403).send("Invalid or expired token.");
  }

  req.user = user; // Pass user info to the next handler
  next();
};

module.exports = { authenticateToken };
