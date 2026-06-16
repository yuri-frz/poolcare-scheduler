import { NotificationFactory } from "../../src/application/NotificationFactory";
import { SendNotificationUseCase } from "../../src/application/SendNotificationUseCase";
import { InMemoryNotificationLogRepository } from "../../src/infrastructure/InMemoryNotificationLogRepository";

describe("SendNotificationUseCase", () => {
  it("sends a simulated email and stores the log", async () => {
    const sender = { send: jest.fn(async () => undefined) };
    const logs = new InMemoryNotificationLogRepository();
    const useCase = new SendNotificationUseCase(sender, logs, new NotificationFactory());

    const log = await useCase.execute({ recipientId: "client-1", subject: "Agendamento", message: "Criado" });

    expect(log.status).toBe("SENT");
    expect(await logs.findByRecipientId("client-1")).toHaveLength(1);
  });
});
