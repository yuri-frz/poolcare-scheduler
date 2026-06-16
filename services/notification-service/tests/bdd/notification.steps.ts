import assert from "assert";
import request from "supertest";
import { Given, Then, When } from "@cucumber/cucumber";
import { createApp } from "../../src/app";

const app = createApp();
let response: request.Response;

Given("uma mensagem de notificacao valida", function () {});

When("o Notification Service processa a mensagem", async function () {
  response = await request(app)
    .post("/notifications")
    .send({ recipientId: "client-1", subject: "Agendamento", message: "Visita criada" });
});

Then("um log de envio deve ser criado", function () {
  assert.equal(response.status, 201);
  assert.equal(response.body.status, "SENT");
});

Given("uma notificacao enviada para um usuario", async function () {
  await request(app)
    .post("/notifications")
    .send({ recipientId: "client-2", subject: "Agenda", message: "Atendimento confirmado" });
});

When("consulta os logs desse usuario", async function () {
  response = await request(app).get("/notifications?recipientId=client-2");
});

Then("o Notification Service deve retornar o historico", function () {
  assert.equal(response.status, 200);
  assert.ok(response.body.length > 0);
});
