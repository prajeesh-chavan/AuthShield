const { verifyToken } = require("../utils/token");

const authenticateToken = async (req, res, next) => {
  const token = req.query.token || req.body.token;

  if (!token) {
    return res.status(401).send("Token is required.");
  }

  try {
    const user = verifyToken(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(403).send("Invalid or expired token.");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).send("Invalid or expired token.");
  }
};

module.exports = { authenticateToken };
