import request from "supertest";
import { createApp } from "../../src/app";

describe("Notification API", () => {
  it("creates and lists notification logs", async () => {
    const app = createApp();

    await request(app)
      .post("/notifications")
      .send({ recipientId: "client-1", subject: "Teste", message: "Mensagem" })
      .expect(201);

    const response = await request(app).get("/notifications?recipientId=client-1").expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe("SENT");
  });
});
