const request = require("supertest");
const app = require("../src/app");

describe("AuthShield API Tests", () => {
  it("should send a magic link", async () => {
    const response = await request(app)
      .post("/auth/send-link")
      .send({ email: "prajeeshchavan@gmail.com" });
    expect(response.body.message).toBe("Magic link sent!");
    expect(response.body.magicLink).toBeDefined();
    expect(response.body.qrCodeUrl).toBeDefined();
  });

  it("should reject invalid tokens", async () => {
    const response = await request(app)
      .get("/auth/verify")
      .query({ token: "invalid-token" });
    expect(response.status).toBe(403);
    expect(response.text).toBe("Invalid or expired token.");
  });

  it("should handle OAuth login", async () => {
    const response = await request(app).get("/auth/google");
    expect(response.status).toBe(302); // Redirect to Google OAuth
  });
});
