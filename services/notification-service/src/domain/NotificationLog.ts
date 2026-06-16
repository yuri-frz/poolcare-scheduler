export type NotificationStatus = "SENT" | "FAILED";

export class NotificationLog {
  constructor(
    public readonly id: string,
    public readonly recipientId: string,
    public readonly subject: string,
    public readonly message: string,
    public readonly status: NotificationStatus,
    public readonly createdAt: Date
  ) {}
}
