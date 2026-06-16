import { randomUUID } from "crypto";
import { Schedule } from "../domain/Schedule";

export interface CreateScheduleData {
  clientId: string;
  providerId: string;
  serviceDate: string;
  address: string;
  notes?: string;
}

export class ScheduleFactory {
  create(data: CreateScheduleData): Schedule {
    const serviceDate = new Date(data.serviceDate);
    if (Number.isNaN(serviceDate.getTime())) {
      throw new Error("Invalid service date");
    }
    return new Schedule(randomUUID(), data.clientId, data.providerId, serviceDate, data.address, data.notes ?? "");
  }
}
