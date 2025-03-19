require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const passport = require("passport");
require("./passportConfig"); // Import passport configurations

const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.options("*", cors()); // Handle preflight requests

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // Optional, for persistent login sessions

app.use("/auth", authRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`AuthShield API running on port ${port}`);
});

module.exports = app;
