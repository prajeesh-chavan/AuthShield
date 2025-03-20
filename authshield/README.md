# No-Pass-Auth

**No-Pass-Auth** is a secure, passwordless authentication system that uses time-limited magic links sent to users via email. It also supports OAuth2 for social logins with Google, Facebook, GitHub, and more. This eliminates the need for passwords, minimizes the risk of brute-force attacks, and improves the user experience by streamlining the login process. It can be easily integrated into Node.js, React, and React Native applications.

---

## Features

- **Passwordless Authentication**: Users can log in without passwords using magic links sent to their email.
- **Time-Limited Magic Links**: Magic links are cryptographically signed and automatically expire after a set time.
- **Secure Token Generation**: Tokens are securely generated and verified using JSON Web Tokens (JWT).
- **Email Integration**: Utilizes `nodemailer` to send magic links via email.
- **OAuth2 Social Logins**: Supports Google, Facebook, GitHub, and other OAuth providers.
- **Token Revocation**: Blacklist tokens to prevent reuse after logout or revocation.
- **Rate Limiting**: Protects against abuse by limiting the number of authentication requests per user or IP address.
- **Role-Based Access Control (RBAC)**: Manage user roles and permissions to control access to different parts of the application.
- **Multi-Device Support**: Works seamlessly across different devices.

---

## Installation

Install the package using npm:

```bash
npm install no-pass-auth
```

---

## Environment Variables

To configure No-Pass-Auth, create a `.env` file in your project root and define the following variables:

```bash
# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

# SMTP Settings for Nodemailer
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# OAuth2 Settings (example for Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend and Backend URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

---

## Usage

### Backend Setup (Node.js/Express)

1. Import and configure the No-Pass-Auth middleware in your Express app.

```javascript
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
  oauthConfig: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
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

// OAuth2 login (e.g., Google)
app.get("/auth/oauth/google", auth.oauthLogin("google"));
app.get("/auth/oauth/callback", auth.oauthCallback("google"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

### Frontend Integration

#### Sending the Magic Link (React)

Create a form to collect the user's email and send a request to the backend to send the magic link.

```jsx
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

#### Verifying the Magic Link Token (React)

After the user clicks the magic link in their email, verify the token using the backend endpoint.

```jsx
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

---

## Troubleshooting

### Common Issues

1. **Invalid Token Error**:

   - Ensure the token is not expired or blacklisted.
   - Verify that the `JWT_SECRET` in the `.env` file matches the one used to generate the token.

2. **Email Not Sent**:

   - Check the SMTP configuration in the `.env` file.
   - Ensure the email provider allows third-party app access.

3. **OAuth Login Fails**:

   - Verify the client ID and secret for the OAuth provider.
   - Ensure the callback URL is correctly configured in the OAuth provider's dashboard.

4. **Rate Limit Exceeded**:
   - Adjust the `rateLimitConfig` in the backend to allow more requests if necessary.

---

## Tests

Run the tests to ensure everything is working as expected:

```bash
npm test
```

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with improvements or bug fixes.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact

For questions or support, please reach out at:

- **Email**: prajeeshchavan@gmail.com
- **LinkedIn**: [Prajeesh Chavan](https://www.linkedin.com/in/prajeeshchavan)
- **Portfolio**: [prajeeshchavan.dev](https://prajeesh-chavan.web.app/)
