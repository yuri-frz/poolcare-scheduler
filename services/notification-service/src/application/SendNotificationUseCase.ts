import { NotificationLogRepository } from "../domain/NotificationLogRepository";
import { EmailMessage, EmailSender } from "./EmailSender";
import { NotificationFactory } from "./NotificationFactory";

export class SendNotificationUseCase {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly logs: NotificationLogRepository,
    private readonly factory: NotificationFactory
  ) {}

  async execute(message: EmailMessage) {
    try {
      await this.emailSender.send(message);
      return this.logs.save(this.factory.sent(message));
    } catch {
      return this.logs.save(this.factory.failed(message));
    }
  }
}
