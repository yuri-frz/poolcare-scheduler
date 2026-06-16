import cors from "cors";
import express from "express";
import { ListNotificationLogsUseCase } from "./application/ListNotificationLogsUseCase";
import { NotificationFactory } from "./application/NotificationFactory";
import { SendNotificationUseCase } from "./application/SendNotificationUseCase";
import { ConsoleEmailSender } from "./infrastructure/ConsoleEmailSender";
import { InMemoryNotificationLogRepository } from "./infrastructure/InMemoryNotificationLogRepository";
import { NotificationController } from "./presentation/NotificationController";
import { createNotificationRoutes } from "./presentation/routes";

export function createApp() {
  const app = express();
  const logs = new InMemoryNotificationLogRepository();
  const controller = new NotificationController(
    new SendNotificationUseCase(new ConsoleEmailSender(), logs, new NotificationFactory()),
    new ListNotificationLogsUseCase(logs)
  );

  app.use(cors());
  app.use(express.json());
  app.get("/health", (_, response) => response.json({ status: "ok", service: "notification" }));
  app.use("/notifications", createNotificationRoutes(controller));
  return app;
}
