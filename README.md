# DeliveryApp

Direct-to-merchant ordering platform MVP for Pakistan.

## Phase 1 MVP

- Simple customer dashboard to place orders
- Merchant dashboard receives orders in real time
- Email/password authentication
- WhatsApp integration planned for Phase 2

## Quickstart

```bash
cp .env.example .env
make up
make db.migrate
make db.seed
```

- Web: http://localhost:3000
- API: http://localhost:8080/health

## Overview
- Backend API: NestJS + Prisma + PostgreSQL + Redis
- Web PWA: React + Vite + TypeScript
- NLP Service: FastAPI for grocery list parsing
- Object Storage: MinIO (S3 compatible)

All services run via `docker-compose` with no external dependencies.
