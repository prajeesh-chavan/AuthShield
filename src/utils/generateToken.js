import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const generateToken = (payload) => {
  try {
    const token = jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000), // Convert milliseconds to seconds
      },
      config.secretKey,
      { expiresIn: config.tokenExpiry, algorithm: "HS256" }
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};
