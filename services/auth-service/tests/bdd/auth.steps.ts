import assert from "assert";
import request from "supertest";
import { Given, Then, When } from "@cucumber/cucumber";
import { createApp } from "../../src/app";

const app = createApp();
let response: request.Response;

Given("um visitante com dados validos", function () {});

When("solicita o cadastro como cliente", async function () {
  response = await request(app)
    .post("/auth/register")
    .send({ name: "Maria", email: "maria@example.com", password: "123456", role: "CLIENT" });
});

Then("o Auth Service deve criar a conta", function () {
  assert.equal(response.status, 201);
});

Given("um usuario cadastrado", async function () {
  await request(app)
    .post("/auth/register")
    .send({ name: "Joao", email: "joao@example.com", password: "123456", role: "CLIENT" });
});

When("informa credenciais corretas", async function () {
  response = await request(app).post("/auth/login").send({ email: "joao@example.com", password: "123456" });
});

Then("o Auth Service deve retornar um JWT", function () {
  assert.equal(response.status, 200);
  assert.ok(response.body.token);
});

When("informa senha incorreta", async function () {
  response = await request(app).post("/auth/login").send({ email: "joao@example.com", password: "errada" });
});

Then("o Auth Service deve negar o acesso", function () {
  assert.equal(response.status, 401);
});
