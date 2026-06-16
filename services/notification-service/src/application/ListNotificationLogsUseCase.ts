import { NotificationLogRepository } from "../domain/NotificationLogRepository";

export class ListNotificationLogsUseCase {
  constructor(private readonly logs: NotificationLogRepository) {}

  execute(recipientId?: string) {
    return recipientId ? this.logs.findByRecipientId(recipientId) : this.logs.findAll();
  }
}
