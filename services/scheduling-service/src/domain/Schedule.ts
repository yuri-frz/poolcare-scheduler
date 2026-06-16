import { ScheduleStatus } from "./ScheduleStatus";

export class Schedule {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly providerId: string,
    public readonly serviceDate: Date,
    public readonly address: string,
    public readonly notes: string,
    public readonly status: ScheduleStatus = "REQUESTED"
  ) {}

  confirm(): Schedule {
    if (this.status !== "REQUESTED") {
      throw new Error("Only requested schedules can be confirmed");
    }
    return new Schedule(this.id, this.clientId, this.providerId, this.serviceDate, this.address, this.notes, "CONFIRMED");
  }

  cancel(requesterId: string): Schedule {
    if (requesterId !== this.clientId) {
      throw new Error("Only the client can cancel this schedule");
    }
    if (this.status === "DONE") {
      throw new Error("Done schedules cannot be cancelled");
    }
    return new Schedule(this.id, this.clientId, this.providerId, this.serviceDate, this.address, this.notes, "CANCELLED");
  }

  complete(): Schedule {
    if (this.status !== "CONFIRMED") {
      throw new Error("Only confirmed schedules can be completed");
    }
    return new Schedule(this.id, this.clientId, this.providerId, this.serviceDate, this.address, this.notes, "DONE");
  }
}
