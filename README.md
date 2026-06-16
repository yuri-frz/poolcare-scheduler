# PoolCare Scheduler

Projeto academico de Engenharia de Software para agendamento de servicos de manutencao de piscinas.

## Visao geral

O sistema foi dividido em tres microsservicos independentes:

- Auth Service: cadastro, login e emissao de JWT.
- Scheduling Service: criacao, consulta, cancelamento, confirmacao e conclusao de agendamentos.
- Notification Service: simulacao de envio de e-mail e registro de logs.

Cada microsservico segue Clean Architecture com as camadas:

- Domain
- Application
- Infrastructure
- Presentation

## Como executar

```bash
docker compose up --build
```

Servicos:

- Web: `http://localhost:3000`
- Auth: `http://localhost:3001/health`
- Scheduling: `http://localhost:3002/health`
- Notification: `http://localhost:3003/health`

## Scripts

Na raiz:

```bash
npm run install:all
npm test
npm run test:bdd
npm run build
```

Frontend:

```bash
npm run dev --prefix web
npm run build --prefix web
```

Ou execute dentro de cada pasta em `services/*`:

```bash
npm install
npm test
npm run test:bdd
npm run build
npm run dev
```

## Documentacao

O relatorio completo esta em `docs/RELATORIO_ACADEMICO.md`.
Os exemplos de chamadas HTTP estao em `docs/API_EXEMPLOS.md`.
