import dotenv from "dotenv";
dotenv.config();

export default {
  secretKey: process.env.JWT_SECRET || "praju",
  tokenExpiry: process.env.JWT_EXPIRY || "10m",
};
