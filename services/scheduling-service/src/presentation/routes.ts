import { Router } from "express";
import { authMiddleware } from "./authMiddleware";
import { ScheduleController } from "./ScheduleController";

export function createScheduleRoutes(controller: ScheduleController): Router {
  const router = Router();
  router.use(authMiddleware);
  router.post("/", controller.create);
  router.get("/mine", controller.listMine);
  router.patch("/:id/cancel", controller.cancel);
  router.patch("/:id/confirm", controller.confirm);
  router.patch("/:id/complete", controller.complete);
  return router;
}
