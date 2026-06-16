import { ScheduleEvent, ScheduleEventName, ScheduleObserver } from "../domain/ScheduleEvent";
import { Schedule } from "../domain/Schedule";

export class ScheduleEventPublisher {
  private readonly observers: ScheduleObserver[] = [];

  subscribe(observer: ScheduleObserver): void {
    this.observers.push(observer);
  }

  async publish(name: ScheduleEventName, schedule: Schedule): Promise<void> {
    const event: ScheduleEvent = { name, schedule };
    await Promise.all(this.observers.map((observer) => observer.notify(event)));
  }
}
