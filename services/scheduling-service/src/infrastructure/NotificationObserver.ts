import { ScheduleEvent, ScheduleObserver } from "../domain/ScheduleEvent";

export class NotificationObserver implements ScheduleObserver {
  constructor(private readonly notificationUrl: string) {}

  async notify(event: ScheduleEvent): Promise<void> {
    await fetch(`${this.notificationUrl}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId: event.schedule.clientId,
        subject: `Evento de agendamento: ${event.name}`,
        message: `Agendamento ${event.schedule.id} esta com status ${event.schedule.status}`
      })
    });
  }
}
