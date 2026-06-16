import { Router } from "express";
import { NotificationController } from "./NotificationController";

export function createNotificationRoutes(controller: NotificationController): Router {
  const router = Router();
  router.post("/", controller.send);
  router.get("/", controller.list);
  return router;
}
