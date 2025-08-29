# DeliveryApp

Direct-to-merchant ordering platform MVP for Pakistan.

## Quickstart

```bash
cp .env.example .env
make up
make db.migrate
make db.seed
```

- Web: http://localhost:5173
- API: http://localhost:8080/health

## Overview
- Backend API: NestJS + Prisma + PostgreSQL + Redis
- Web PWA: React + Vite + TypeScript
- NLP Service: FastAPI for grocery list parsing
- Object Storage: MinIO (S3 compatible)

All services run via `docker-compose` with no external dependencies.
