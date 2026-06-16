import { RegisterUserUseCase } from "../../src/application/RegisterUserUseCase";
import { InMemoryUserRepository } from "../../src/infrastructure/InMemoryUserRepository";

const hasher = {
  hash: jest.fn(async () => "hashed-password"),
  compare: jest.fn()
};

describe("RegisterUserUseCase", () => {
  it("registers a client with hashed password", async () => {
    const users = new InMemoryUserRepository();
    const useCase = new RegisterUserUseCase(users, hasher);

    const user = await useCase.execute({
      name: "Ana Cliente",
      email: "ana@example.com",
      password: "123456",
      role: "CLIENT"
    });

    expect(user.id).toBeDefined();
    expect(user.passwordHash).toBe("hashed-password");
    expect(await users.findByEmail("ana@example.com")).toEqual(user);
  });

  it("rejects duplicated email", async () => {
    const users = new InMemoryUserRepository();
    const useCase = new RegisterUserUseCase(users, hasher);
    const input = { name: "Ana", email: "ana@example.com", password: "123456", role: "CLIENT" as const };

    await useCase.execute(input);

    await expect(useCase.execute(input)).rejects.toThrow("Email already registered");
  });
});
