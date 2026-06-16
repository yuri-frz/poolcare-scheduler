import cors from "cors";
import express from "express";
import { CancelScheduleUseCase } from "./application/CancelScheduleUseCase";
import { CompleteScheduleUseCase } from "./application/CompleteScheduleUseCase";
import { ConfirmScheduleUseCase } from "./application/ConfirmScheduleUseCase";
import { CreateScheduleUseCase } from "./application/CreateScheduleUseCase";
import { ListSchedulesUseCase } from "./application/ListSchedulesUseCase";
import { RegularPricingStrategy } from "./application/PricingStrategy";
import { ScheduleEventPublisher } from "./application/ScheduleEventPublisher";
import { ScheduleFactory } from "./application/ScheduleFactory";
import { InMemoryScheduleRepository } from "./infrastructure/InMemoryScheduleRepository";
import { NotificationObserver } from "./infrastructure/NotificationObserver";
import { ScheduleController } from "./presentation/ScheduleController";
import { createScheduleRoutes } from "./presentation/routes";

export function createApp() {
  const app = express();
  const schedules = new InMemoryScheduleRepository();
  const events = new ScheduleEventPublisher();
  const notificationUrl = process.env.NOTIFICATION_URL;

  if (notificationUrl) {
    events.subscribe(new NotificationObserver(notificationUrl));
  }

  const controller = new ScheduleController(
    new CreateScheduleUseCase(schedules, new ScheduleFactory(), new RegularPricingStrategy(), events),
    new CancelScheduleUseCase(schedules, events),
    new ConfirmScheduleUseCase(schedules, events),
    new CompleteScheduleUseCase(schedules, events),
    new ListSchedulesUseCase(schedules)
  );

  app.use(cors());
  app.use(express.json());
  app.get("/health", (_, response) => response.json({ status: "ok", service: "scheduling" }));
  app.use("/schedules", createScheduleRoutes(controller));
  return app;
}
