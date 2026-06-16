# Deploy no Render

Render foi escolhido por permitir publicar web services Docker a partir de repositorios Git e por oferecer bancos PostgreSQL gerenciados.

Referencias oficiais consultadas em 2026-06-07:

- Render Web Services: https://render.com/docs/web-services/
- Render Docker: https://render.com/docs/docker
- Render Environment Variables: https://render.com/docs/environment-variables
- Render Multi-Service Architecture: https://render.com/docs/multi-service-architecture

## Estrutura de publicacao

Cada microsservico possui um `Dockerfile` proprio:

- `services/auth-service/Dockerfile`
- `services/scheduling-service/Dockerfile`
- `services/notification-service/Dockerfile`

O arquivo `render.yaml` descreve os tres web services e tres bancos PostgreSQL gerenciados.

## Variaveis necessarias

Auth Service:

- `PORT=3001`
- `JWT_SECRET`
- `DATABASE_URL`

Scheduling Service:

- `PORT=3002`
- `JWT_SECRET`
- `DATABASE_URL`
- `NOTIFICATION_URL`

Notification Service:

- `PORT=3003`
- `DATABASE_URL`

## Processo completo

1. Publicar o repositorio no GitHub.
2. Criar uma conta no Render.
3. Selecionar New > Blueprint.
4. Conectar o repositorio do projeto.
5. Confirmar o arquivo `render.yaml`.
6. Definir `JWT_SECRET` como variavel secreta nos servicos Auth e Scheduling.
7. Ajustar `NOTIFICATION_URL` com a URL publica final do Notification Service.
8. Iniciar o deploy.

## Validacao

Validar os endpoints de saude:

```bash
curl https://poolcare-auth-service.onrender.com/health
curl https://poolcare-scheduling-service.onrender.com/health
curl https://poolcare-notification-service.onrender.com/health
```

Fluxo funcional:

1. Registrar cliente em `POST /auth/register`.
2. Fazer login em `POST /auth/login`.
3. Usar o JWT em `Authorization: Bearer <token>`.
4. Criar agendamento em `POST /schedules`.
5. Consultar logs em `GET /notifications`.

## Observacoes academicas

O Render exige que aplicacoes web escutem na porta definida pela plataforma. Este projeto usa `process.env.PORT` nos tres servicos, mantendo compatibilidade com deploy local e cloud.
