import { Response } from "express";
import { CancelScheduleUseCase } from "../application/CancelScheduleUseCase";
import { CompleteScheduleUseCase } from "../application/CompleteScheduleUseCase";
import { ConfirmScheduleUseCase } from "../application/ConfirmScheduleUseCase";
import { CreateScheduleUseCase } from "../application/CreateScheduleUseCase";
import { ListSchedulesUseCase } from "../application/ListSchedulesUseCase";
import { AuthenticatedRequest } from "./authMiddleware";

export class ScheduleController {
  constructor(
    private readonly createSchedule: CreateScheduleUseCase,
    private readonly cancelSchedule: CancelScheduleUseCase,
    private readonly confirmSchedule: ConfirmScheduleUseCase,
    private readonly completeSchedule: CompleteScheduleUseCase,
    private readonly listSchedules: ListSchedulesUseCase
  ) {}

  create = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
      const result = await this.createSchedule.execute({ ...request.body, clientId: request.user!.sub });
      response.status(201).json(result);
    } catch (error) {
      response.status(400).json({ message: (error as Error).message });
    }
  };

  cancel = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
      const schedule = await this.cancelSchedule.execute(request.params.id, request.user!.sub);
      response.status(200).json(schedule);
    } catch (error) {
      response.status(400).json({ message: (error as Error).message });
    }
  };

  confirm = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
      const schedule = await this.confirmSchedule.execute(request.params.id);
      response.status(200).json(schedule);
    } catch (error) {
      response.status(400).json({ message: (error as Error).message });
    }
  };

  complete = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    try {
      const schedule = await this.completeSchedule.execute(request.params.id);
      response.status(200).json(schedule);
    } catch (error) {
      response.status(400).json({ message: (error as Error).message });
    }
  };

  listMine = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    const schedules = request.user!.role === "CLIENT"
      ? await this.listSchedules.byClient(request.user!.sub)
      : await this.listSchedules.byProvider(request.user!.sub);
    response.status(200).json(schedules);
  };
}
