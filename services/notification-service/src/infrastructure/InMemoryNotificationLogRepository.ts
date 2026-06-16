import { NotificationLog } from "../domain/NotificationLog";
import { NotificationLogRepository } from "../domain/NotificationLogRepository";

export class InMemoryNotificationLogRepository implements NotificationLogRepository {
  private readonly logs: NotificationLog[] = [];

  async save(log: NotificationLog): Promise<NotificationLog> {
    this.logs.push(log);
    return log;
  }

  async findAll(): Promise<NotificationLog[]> {
    return this.logs;
  }

  async findByRecipientId(recipientId: string): Promise<NotificationLog[]> {
    return this.logs.filter((log) => log.recipientId === recipientId);
  }
}
