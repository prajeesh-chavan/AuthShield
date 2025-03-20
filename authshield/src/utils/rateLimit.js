const rateLimit = require("express-rate-limit");

// Rate limiting middleware
const limiter = (options) =>
  rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 5,
    message: options.message || "Too many requests, please try again later.",
  });

module.exports = { limiter };
