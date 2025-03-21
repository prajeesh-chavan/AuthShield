const express = require("express");
const { generateToken } = require("../utils/token");
const { sendMagicLink } = require("../utils/mailer");
const { authenticateToken } = require("../middleware/auth");
const { limiter } = require("../utils/rateLimit");
const QRCode = require("qrcode");
const passport = require("passport");

const router = express.Router();

// Endpoint to send magic link and generate QR code
router.post("/send-link", limiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const token = generateToken(email, process.env.JWT_SECRET);
  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

  try {
    // Generate QR Code from the magic link
    const qrCodeUrl = await QRCode.toDataURL(magicLink);

    // Send magic link via email along with the QR Code
    await sendMagicLink(email, magicLink, {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Respond with both magic link and QR code
    res.json({
      message: "Magic link sent!",
      magicLink,
      qrCodeUrl,
    });
  } catch (error) {
    console.error("Error sending magic link:", error.message);
    res.status(500).json({ message: "Error sending magic link" });
  }
});

// Endpoint to verify token
router.get("/verify", authenticateToken, (req, res) => {
  if (!req.user) {
    return res.status(403).send("Invalid or expired token.");
  }
  res.send(`Authenticated as ${req.user.email}`);
});

// Initiate OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// OAuth2 callback URLs
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/success?token=${req.user}`
      );
    } catch (error) {
      console.error("OAuth callback error:", error.message);
      res.status(500).send("OAuth login failed");
    }
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${req.user}`);
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${req.user}`);
  }
);

module.exports = router;
