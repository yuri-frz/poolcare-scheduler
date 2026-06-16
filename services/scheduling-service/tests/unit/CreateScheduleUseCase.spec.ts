import { CreateScheduleUseCase } from "../../src/application/CreateScheduleUseCase";
import { RegularPricingStrategy } from "../../src/application/PricingStrategy";
import { ScheduleEventPublisher } from "../../src/application/ScheduleEventPublisher";
import { ScheduleFactory } from "../../src/application/ScheduleFactory";
import { InMemoryScheduleRepository } from "../../src/infrastructure/InMemoryScheduleRepository";

describe("CreateScheduleUseCase", () => {
  it("creates a schedule and publishes an event", async () => {
    const schedules = new InMemoryScheduleRepository();
    const events = new ScheduleEventPublisher();
    const observer = { notify: jest.fn() };
    events.subscribe(observer);
    const useCase = new CreateScheduleUseCase(schedules, new ScheduleFactory(), new RegularPricingStrategy(), events);

    const result = await useCase.execute({
      clientId: "client-1",
      providerId: "provider-1",
      serviceDate: "2026-07-10T14:00:00.000Z",
      address: "Rua das Piscinas, 100",
      basePrice: 120
    });

    expect(result.schedule.status).toBe("REQUESTED");
    expect(result.price).toBe(120);
    expect(observer.notify).toHaveBeenCalledWith(expect.objectContaining({ name: "schedule.created" }));
  });
});
