import { Schedule } from "./Schedule";

export interface ScheduleRepository {
  save(schedule: Schedule): Promise<Schedule>;
  findById(id: string): Promise<Schedule | null>;
  findByClientId(clientId: string): Promise<Schedule[]>;
  findByProviderId(providerId: string): Promise<Schedule[]>;
}
