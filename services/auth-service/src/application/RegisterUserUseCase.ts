import { randomUUID } from "crypto";
import { User, UserRole } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { PasswordHasher } from "./PasswordHasher";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const existingUser = await this.users.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const passwordHash = await this.hasher.hash(input.password);
    const user = new User(randomUUID(), input.name, input.email, passwordHash, input.role);
    return this.users.save(user);
  }
}
