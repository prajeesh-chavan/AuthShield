import { generateToken } from "./generateToken.js";
import { verifyToken } from "./verifyToken.js";

export const refreshToken = (token) => {
  const result = verifyToken(token);

  if (!result.success) {
    throw new Error("Invalid or expired token");
  }

  delete result.payload.iat;
  delete result.payload.exp;

  const newPayload = {
    ...result.payload,
  };

  return generateToken(newPayload);
};
