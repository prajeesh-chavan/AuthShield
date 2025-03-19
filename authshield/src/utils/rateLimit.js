const rateLimit = require("express-rate-limit");

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many requests, please try again later.",
});

module.exports = { limiter };
