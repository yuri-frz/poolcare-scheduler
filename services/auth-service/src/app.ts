import cors from "cors";
import express from "express";
import { LoginUseCase } from "./application/LoginUseCase";
import { RegisterUserUseCase } from "./application/RegisterUserUseCase";
import { BcryptPasswordHasher } from "./infrastructure/BcryptPasswordHasher";
import { InMemoryUserRepository } from "./infrastructure/InMemoryUserRepository";
import { JwtTokenService } from "./infrastructure/JwtTokenService";
import { AuthController } from "./presentation/AuthController";
import { createAuthRoutes } from "./presentation/routes";

export function createApp() {
  const app = express();
  const users = new InMemoryUserRepository();
  const hasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(process.env.JWT_SECRET ?? "dev-secret");
  const controller = new AuthController(
    new RegisterUserUseCase(users, hasher),
    new LoginUseCase(users, hasher, tokenService)
  );

  app.use(cors());
  app.use(express.json());
  app.get("/health", (_, response) => response.json({ status: "ok", service: "auth" }));
  app.use("/auth", createAuthRoutes(controller));
  return app;
}
