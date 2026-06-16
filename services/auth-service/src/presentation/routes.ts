import { Router } from "express";
import { AuthController } from "./AuthController";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/login", controller.loginUser);
  return router;
}
