const request = require("supertest");
const app = require("../src/app");

describe("AuthShield API Tests", () => {
  it("should send a magic link", async () => {
    const response = await request(app)
      .post("/auth/send-link")
      .send({ email: "prajeeshchavan@gmail.com" });
    expect(response.text).toBe("Magic link sent!");
  });

  it("should reject invalid tokens", async () => {
    const response = await request(app)
      .get("/auth/verify")
      .query({ token: "invalid-token" });
    expect(response.status).toBe(403);
  });
});
