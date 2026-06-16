export interface EmailMessage {
  recipientId: string;
  subject: string;
  message: string;
}

export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}
