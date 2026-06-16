import { Schedule } from "./Schedule";

export type ScheduleEventName = "schedule.created" | "schedule.cancelled" | "schedule.confirmed" | "schedule.done";

export interface ScheduleEvent {
  name: ScheduleEventName;
  schedule: Schedule;
}

export interface ScheduleObserver {
  notify(event: ScheduleEvent): Promise<void>;
}
