import { ScheduleRepository } from "../domain/ScheduleRepository";
import { ScheduleEventPublisher } from "./ScheduleEventPublisher";

export class ConfirmScheduleUseCase {
  constructor(
    private readonly schedules: ScheduleRepository,
    private readonly events: ScheduleEventPublisher
  ) {}

  async execute(scheduleId: string) {
    const schedule = await this.schedules.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    const confirmedSchedule = await this.schedules.save(schedule.confirm());
    await this.events.publish("schedule.confirmed", confirmedSchedule);
    return confirmedSchedule;
  }
}
