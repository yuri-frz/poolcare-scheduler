import { NotificationLog } from "./NotificationLog";

export interface NotificationLogRepository {
  save(log: NotificationLog): Promise<NotificationLog>;
  findAll(): Promise<NotificationLog[]>;
  findByRecipientId(recipientId: string): Promise<NotificationLog[]>;
}
