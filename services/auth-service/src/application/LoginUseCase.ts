import { UserRepository } from "../domain/UserRepository";
import { PasswordHasher } from "./PasswordHasher";
import { TokenService } from "./TokenService";

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(email: string, password: string): Promise<{ token: string }> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatches = await this.hasher.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new Error("Invalid credentials");
    }

    return {
      token: this.tokenService.sign({ sub: user.id, role: user.role, email: user.email })
    };
  }
}
