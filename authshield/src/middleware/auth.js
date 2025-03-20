const { verifyToken } = require("../utils/token");
const Blacklist = require("../models/Blacklist");

const authenticateToken = async (req, res, next) => {
  const token = req.query.token || req.body.token;
  const isBlacklisted = await Blacklist.findOne({ token });
  if (isBlacklisted) {
    return res.status(403).send("Token has been revoked.");
  }
  const user = verifyToken(token, process.env.JWT_SECRET);

  if (!user) {
    return res.status(403).send("Invalid or expired token.");
  }

  req.user = user; // Pass user info to the next handler
  next();
};

module.exports = { authenticateToken };
