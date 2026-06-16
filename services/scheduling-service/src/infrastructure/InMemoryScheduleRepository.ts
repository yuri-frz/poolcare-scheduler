import { Schedule } from "../domain/Schedule";
import { ScheduleRepository } from "../domain/ScheduleRepository";

export class InMemoryScheduleRepository implements ScheduleRepository {
  private readonly schedules = new Map<string, Schedule>();

  async save(schedule: Schedule): Promise<Schedule> {
    this.schedules.set(schedule.id, schedule);
    return schedule;
  }

  async findById(id: string): Promise<Schedule | null> {
    return this.schedules.get(id) ?? null;
  }

  async findByClientId(clientId: string): Promise<Schedule[]> {
    return [...this.schedules.values()].filter((schedule) => schedule.clientId === clientId);
  }

  async findByProviderId(providerId: string): Promise<Schedule[]> {
    return [...this.schedules.values()].filter((schedule) => schedule.providerId === providerId);
  }
}
