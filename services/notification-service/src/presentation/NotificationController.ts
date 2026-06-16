import { Request, Response } from "express";
import { ListNotificationLogsUseCase } from "../application/ListNotificationLogsUseCase";
import { SendNotificationUseCase } from "../application/SendNotificationUseCase";

export class NotificationController {
  constructor(
    private readonly sendNotification: SendNotificationUseCase,
    private readonly listLogs: ListNotificationLogsUseCase
  ) {}

  send = async (request: Request, response: Response): Promise<void> => {
    const log = await this.sendNotification.execute(request.body);
    response.status(201).json(log);
  };

  list = async (request: Request, response: Response): Promise<void> => {
    const logs = await this.listLogs.execute(request.query.recipientId as string | undefined);
    response.status(200).json(logs);
  };
}
