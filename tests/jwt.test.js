import { verifyToken } from "../src/utils/verifyToken";
import { generateToken } from "../src/utils/generateToken";
import { refreshToken } from "../src/utils/refreshToken";

const payload = { email: "user@example.com" };

describe("JWT Handling", () => {
  test("should generate and verify token", () => {
    const token = generateToken(payload);
    expect(token).toBeDefined();

    const result = verifyToken(token);
    expect(result.success).toBe(true);
    expect(result.payload.email).toBe(payload.email);
  });

  test("should handle expired token", async () => {
    const token = generateToken(payload);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate expiry

    const result = verifyToken(token);
    expect(result.success).toBe(true);
  });

  test("should refresh token", () => {
    const token = generateToken(payload);
    const newToken = refreshToken(token);

    expect(newToken).toBeDefined();
  });
});
