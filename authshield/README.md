# No-Pass-Auth

**No-Pass-Auth** is a secure, passwordless authentication system that uses time-limited magic links sent to users via email. This eliminates the need for passwords, minimizes the risk of brute-force attacks, and improves the user experience by streamlining the login process. It can be easily integrated into Node.js, React, and React Native applications.

## Features

- **Passwordless Authentication**: Users can log in without passwords using magic links sent to their email.
- **Time-Limited Magic Links**: Magic links are cryptographically signed and automatically expire after a set time.
- **Secure Token Generation**: Tokens are securely generated and verified using JSON Web Tokens (JWT).
- **Email Integration**: Utilizes `nodemailer` to send magic links via email.
- **Optional Role-Based Access Control (RBAC)**: Manage user roles and permissions to control access to different parts of the application.
- **Auto Expiry & Revocation**: Magic links expire after a configurable time, preventing them from being reused.
- **Rate Limiting**: Protects against abuse by limiting the number of authentication requests per user or IP address.
- **Multi-Device Support**: Works seamlessly across different devices.

## Installation

Install the package using npm:

```bash
npm install no-pass-auth
```

# Environment Variables

To configure No-Pass-Auth, create a .env file in your project root and define the following variables:

```bash
# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

# SMTP Settings for Nodemailer
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

These variables are used to configure JWT signing and the email service for sending magic links.

# Usage

## Backend Setup (Node.js/Express)

1. Set up your Express server and use No-Pass-Auth to handle authentication requests.

```js
const express = require("express");
const NoPassAuth = require("no-pass-auth");
const app = express();

app.use(express.json());

const auth = new NoPassAuth({
  jwtSecret: process.env.JWT_SECRET,
  mailerConfig: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  magicLinkExpiry: 10 * 60, // Magic link expires in 10 minutes
  rateLimitConfig: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // Max 5 requests per 15 minutes
  },
});

// Endpoint to send magic link
app.post("/auth/send-link", auth.sendMagicLink);

// Endpoint to verify magic link
app.get("/auth/verify", auth.verifyMagicLink);

// Example of Role-Based Access Control (optional)
app.get("/admin", auth.checkRole(["admin"]), (req, res) => {
  res.send("Welcome Admin!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## Frontend Integration

Sending the Magic Link (React)

Create a form to collect the user's email and send a request to the backend to send the magic link.

```js
import axios from "axios";
import { useState } from "react";

function SendMagicLink() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auth/send-link", { email });
      alert("Magic link sent! Check your email.");
    } catch (error) {
      console.error("Error sending magic link:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit">Send Magic Link</button>
    </form>
  );
}

export default SendMagicLink;
```

Verifying the Magic Link Token (React)
After the user clicks the magic link in their email, verify the token using the backend endpoint.

```js
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function VerifyMagicLink() {
  const [status, setStatus] = useState("Verifying...");
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/verify?token=${token}`
        );
        setStatus(`Authenticated as: ${response.data.user}`);
      } catch (error) {
        setStatus("Invalid or expired token.");
      }
    };
    verifyToken();
  }, [location]);

  return <div>{status}</div>;
}

export default VerifyMagicLink;
```

# Advanced Usage

## Role-Based Access Control (RBAC)

No-Pass-Auth includes optional role-based access control. You can define roles for users, and restrict access to specific endpoints based on these roles.

Example:

```js
app.get("/admin", auth.checkRole(["admin"]), (req, res) => {
  res.send("Admin Panel");
});
```

## Rate Limiting

You can configure rate limiting to prevent abuse by limiting the number of authentication requests per IP or user.

```js
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15-minute window
  maxRequests: 5, // Limit each IP to 5 requests per windowMs
};

const auth = new NoPassAuth({
  jwtSecret: process.env.JWT_SECRET,
  mailerConfig: {
    /* your SMTP settings */
  },
  rateLimitConfig,
});
```

# Configuration Options

## Here are the options you can pass to NoPassAuth:

- **jwtSecret:** Your secret key for signing JWT tokens.
- **mailerConfig:** Configuration object for nodemailer, which is used to send magic links.
- **magicLinkExpiry:** Time in seconds for which the magic link will be valid.
- **rateLimitConfig:** Configuration object for rate limiting, defining the maximum requests and window duration.
- **rbacConfig:** Optional configuration for role-based access control.

# Tests

To run the tests, use:

```bash
npm test
```

# License

This project is licensed under the MIT License - see the LICENSE file for details.

# Contributing

Contributions are welcome! Please fork the repository and submit a pull request with improvements or bug fixes.

# Contact

For questions or support, please reach out at prajeeshchavan@gmail.com.
