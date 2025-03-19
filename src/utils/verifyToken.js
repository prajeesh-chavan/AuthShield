import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.secretKey);
    return { success: true, payload: decoded };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { success: false, message: error.message };
  }
};
