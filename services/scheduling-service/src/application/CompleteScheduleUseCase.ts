import { ScheduleRepository } from "../domain/ScheduleRepository";
import { ScheduleEventPublisher } from "./ScheduleEventPublisher";

export class CompleteScheduleUseCase {
  constructor(
    private readonly schedules: ScheduleRepository,
    private readonly events: ScheduleEventPublisher
  ) {}

  async execute(scheduleId: string) {
    const schedule = await this.schedules.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    const completedSchedule = await this.schedules.save(schedule.complete());
    await this.events.publish("schedule.done", completedSchedule);
    return completedSchedule;
  }
}
