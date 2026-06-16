import assert from "assert";
import jwt from "jsonwebtoken";
import request from "supertest";
import { Given, Then, When } from "@cucumber/cucumber";
import { createApp } from "../../src/app";

const app = createApp();
const clientToken = jwt.sign({ sub: "client-1", role: "CLIENT", email: "client@example.com" }, "dev-secret");
const otherClientToken = jwt.sign({ sub: "client-2", role: "CLIENT", email: "other@example.com" }, "dev-secret");
const providerToken = jwt.sign({ sub: "provider-1", role: "PROVIDER", email: "provider@example.com" }, "dev-secret");
let response: request.Response;
let scheduleId: string;

async function createSchedule(token = clientToken) {
  const result = await request(app)
    .post("/schedules")
    .set("Authorization", `Bearer ${token}`)
    .send({
      providerId: "provider-1",
      serviceDate: "2026-07-10T14:00:00.000Z",
      address: "Rua Azul, 10",
      basePrice: 100
    });
  scheduleId = result.body.schedule.id;
  return result;
}

Given("um cliente autenticado", function () {});

When("solicita um agendamento", async function () {
  response = await createSchedule();
});

Then("o sistema deve registrar a visita", function () {
  assert.equal(response.status, 201);
  assert.equal(response.body.schedule.status, "REQUESTED");
});

Given("um cliente com agendamento criado", async function () {
  await createSchedule();
});

When("consulta seus agendamentos", async function () {
  response = await request(app).get("/schedules/mine").set("Authorization", `Bearer ${clientToken}`);
});

Then("o sistema deve listar a visita criada", function () {
  assert.equal(response.status, 200);
  assert.ok(response.body.length > 0);
});

When("cancela o agendamento", async function () {
  response = await request(app).patch(`/schedules/${scheduleId}/cancel`).set("Authorization", `Bearer ${clientToken}`);
});

Then("o sistema deve marcar a visita como cancelada", function () {
  assert.equal(response.body.status, "CANCELLED");
});

Given("um prestador com atendimento solicitado", async function () {
  await createSchedule();
});

When("confirma o atendimento", async function () {
  response = await request(app).patch(`/schedules/${scheduleId}/confirm`).set("Authorization", `Bearer ${providerToken}`);
});

Then("o sistema deve marcar a visita como confirmada", function () {
  assert.equal(response.body.status, "CONFIRMED");
});

Given("um prestador com atendimento confirmado", async function () {
  await createSchedule();
  await request(app).patch(`/schedules/${scheduleId}/confirm`).set("Authorization", `Bearer ${providerToken}`);
});

When("conclui o atendimento", async function () {
  response = await request(app).patch(`/schedules/${scheduleId}/complete`).set("Authorization", `Bearer ${providerToken}`);
});

Then("o sistema deve registrar a visita como concluida", function () {
  assert.equal(response.body.status, "DONE");
});

Given("um prestador com atendimento concluido", async function () {
  await createSchedule();
  await request(app).patch(`/schedules/${scheduleId}/confirm`).set("Authorization", `Bearer ${providerToken}`);
  await request(app).patch(`/schedules/${scheduleId}/complete`).set("Authorization", `Bearer ${providerToken}`);
});

When("consulta a propria agenda", async function () {
  response = await request(app).get("/schedules/mine").set("Authorization", `Bearer ${providerToken}`);
});

Then("o sistema deve exibir o historico de atendimentos", function () {
  assert.ok(response.body.some((schedule: { status: string }) => schedule.status === "DONE"));
});

Given("um agendamento pertencente a outro cliente", async function () {
  await createSchedule();
});

When("tenta cancelar o agendamento", async function () {
  response = await request(app).patch(`/schedules/${scheduleId}/cancel`).set("Authorization", `Bearer ${otherClientToken}`);
});

Then("o sistema deve negar o cancelamento", function () {
  assert.equal(response.status, 400);
});
