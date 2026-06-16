import { ScheduleRepository } from "../domain/ScheduleRepository";
import { PricingStrategy } from "./PricingStrategy";
import { CreateScheduleData, ScheduleFactory } from "./ScheduleFactory";
import { ScheduleEventPublisher } from "./ScheduleEventPublisher";

export class CreateScheduleUseCase {
  constructor(
    private readonly schedules: ScheduleRepository,
    private readonly factory: ScheduleFactory,
    private readonly pricing: PricingStrategy,
    private readonly events: ScheduleEventPublisher
  ) {}

  async execute(input: CreateScheduleData & { basePrice: number }) {
    const schedule = this.factory.create(input);
    const savedSchedule = await this.schedules.save(schedule);
    await this.events.publish("schedule.created", savedSchedule);
    return { schedule: savedSchedule, price: this.pricing.calculate(input.basePrice) };
  }
}
