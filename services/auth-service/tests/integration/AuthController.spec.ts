import request from "supertest";
import { createApp } from "../../src/app";

describe("Auth API", () => {
  it("registers and authenticates a user", async () => {
    const app = createApp();

    await request(app)
      .post("/auth/register")
      .send({ name: "Carlos", email: "carlos@example.com", password: "123456", role: "PROVIDER" })
      .expect(201);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "carlos@example.com", password: "123456" })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });
});
