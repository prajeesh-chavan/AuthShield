const request = require("supertest");
const app = require("../src/app");
const Blacklist = require("../src/models/Blacklist");

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

  it("should revoke a token", async () => {
    const token = "valid-token"; // Mock a valid token
    const response = await request(app)
      .post("/auth/revoke-token")
      .send({ token });
    expect(response.text).toBe("Token revoked successfully.");

    const isBlacklisted = await Blacklist.findOne({ token });
    expect(isBlacklisted).not.toBeNull();
  });

  it("should reject blacklisted tokens", async () => {
    const token = "blacklisted-token"; // Mock a blacklisted token
    await Blacklist.create({ token, expiresAt: new Date(Date.now() + 1000) });

    const response = await request(app).get("/auth/verify").query({ token });
    expect(response.status).toBe(403);
    expect(response.text).toBe("Token has been revoked.");
  });

  it("should handle OAuth login", async () => {
    const response = await request(app).get("/auth/google");
    expect(response.status).toBe(302); // Redirect to Google OAuth
  });
});
