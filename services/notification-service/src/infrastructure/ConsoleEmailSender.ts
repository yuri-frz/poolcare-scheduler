import { EmailMessage, EmailSender } from "../application/EmailSender";

export class ConsoleEmailSender implements EmailSender {
  async send(message: EmailMessage): Promise<void> {
    console.log(`[email-simulado] ${message.recipientId}: ${message.subject} - ${message.message}`);
  }
}
