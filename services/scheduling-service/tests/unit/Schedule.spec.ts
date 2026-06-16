import { Schedule } from "../../src/domain/Schedule";

describe("Schedule", () => {
  it("confirms and completes a requested schedule", () => {
    const schedule = new Schedule("1", "client", "provider", new Date(), "Endereco", "");

    const completed = schedule.confirm().complete();

    expect(completed.status).toBe("DONE");
  });

  it("prevents cancelling a schedule by another client", () => {
    const schedule = new Schedule("1", "client", "provider", new Date(), "Endereco", "");

    expect(() => schedule.cancel("other-client")).toThrow("Only the client can cancel this schedule");
  });
});
