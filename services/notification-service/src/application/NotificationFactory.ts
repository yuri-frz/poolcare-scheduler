import { randomUUID } from "crypto";
import { NotificationLog } from "../domain/NotificationLog";
import { EmailMessage } from "./EmailSender";

export class NotificationFactory {
  sent(message: EmailMessage): NotificationLog {
    return new NotificationLog(randomUUID(), message.recipientId, message.subject, message.message, "SENT", new Date());
  }

  failed(message: EmailMessage): NotificationLog {
    return new NotificationLog(randomUUID(), message.recipientId, message.subject, message.message, "FAILED", new Date());
  }
}
