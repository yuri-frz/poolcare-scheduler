import { Request, Response } from "express";
import { LoginUseCase } from "../application/LoginUseCase";
import { RegisterUserUseCase } from "../application/RegisterUserUseCase";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly login: LoginUseCase
  ) {}

  register = async (request: Request, response: Response): Promise<void> => {
    try {
      const user = await this.registerUser.execute(request.body);
      response.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      response.status(400).json({ message: (error as Error).message });
    }
  };

  loginUser = async (request: Request, response: Response): Promise<void> => {
    try {
      const result = await this.login.execute(request.body.email, request.body.password);
      response.status(200).json(result);
    } catch (error) {
      response.status(401).json({ message: (error as Error).message });
    }
  };
}
