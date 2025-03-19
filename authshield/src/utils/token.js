const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (userEmail, secret, expiry = "15m") => {
  return jwt.sign({ email: userEmail }, secret, { expiresIn: expiry });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null; // Handle invalid token
  }
};

module.exports = { generateToken, verifyToken };
