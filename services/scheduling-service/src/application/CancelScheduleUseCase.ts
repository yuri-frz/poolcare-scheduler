import { ScheduleRepository } from "../domain/ScheduleRepository";
import { ScheduleEventPublisher } from "./ScheduleEventPublisher";

export class CancelScheduleUseCase {
  constructor(
    private readonly schedules: ScheduleRepository,
    private readonly events: ScheduleEventPublisher
  ) {}

  async execute(scheduleId: string, requesterId: string) {
    const schedule = await this.schedules.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    const cancelledSchedule = await this.schedules.save(schedule.cancel(requesterId));
    await this.events.publish("schedule.cancelled", cancelledSchedule);
    return cancelledSchedule;
  }
}
