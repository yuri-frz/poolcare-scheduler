import { ScheduleRepository } from "../domain/ScheduleRepository";

export class ListSchedulesUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  byClient(clientId: string) {
    return this.schedules.findByClientId(clientId);
  }

  byProvider(providerId: string) {
    return this.schedules.findByProviderId(providerId);
  }
}
