# Exemplos de API

## Cadastro

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Cliente","email":"ana@example.com","password":"123456","role":"CLIENT"}'
```

## Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"123456"}'
```

## Criar agendamento

```bash
curl -X POST http://localhost:3002/schedules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"providerId":"provider-1","serviceDate":"2026-07-10T14:00:00.000Z","address":"Rua Azul, 10","basePrice":120}'
```

## Consultar agenda

```bash
curl http://localhost:3002/schedules/mine \
  -H "Authorization: Bearer TOKEN"
```

## Confirmar atendimento

```bash
curl -X PATCH http://localhost:3002/schedules/SCHEDULE_ID/confirm \
  -H "Authorization: Bearer TOKEN"
```

## Concluir atendimento

```bash
curl -X PATCH http://localhost:3002/schedules/SCHEDULE_ID/complete \
  -H "Authorization: Bearer TOKEN"
```

## Cancelar agendamento

```bash
curl -X PATCH http://localhost:3002/schedules/SCHEDULE_ID/cancel \
  -H "Authorization: Bearer TOKEN"
```

## Consultar logs de notificacao

```bash
curl http://localhost:3003/notifications
```
