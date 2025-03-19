import { generateToken } from "./src/utils/generateToken.js";
import { refreshToken } from "./src/utils/refreshToken.js";
import { verifyToken } from "./src/utils/verifyToken.js";

const payload = { email: "test@example.com", userId: "12345" };

const token = generateToken(payload);
console.log("Generated Token:", token);

const verification = verifyToken(token);
console.log("Verification:", verification);

const newToken = refreshToken(token);
console.log("Refreshed Token:", newToken);
