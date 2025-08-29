Direct‑to‑Merchant Ordering App — MVP Skeleton

This repository contains a stack‑agnostic skeleton for the MVP described in the product spec (Pakistan market). It focuses on zero‑approval run paths: WhatsApp deep‑link verification, list‑first quotes and orders, 90‑day rolling ratings, and merchant‑handled delivery.

What’s included
- OpenAPI spec for core endpoints (auth, lists, quotes, orders, merchant, admin, ratings)
- PostgreSQL schema for core entities and relations
- Architecture and WhatsApp auth flow docs (zero‑approval deep link)
- Docker Compose for local deps (Postgres, Redis, MinIO/R2‑compatible)
- Seed catalog stub and ratings notes

Quick start
1) Install Docker and Docker Compose.
2) Start infrastructure: `docker compose up -d`
3) Load schema: `docker exec -i deliveryapp-db psql -U app_user -d app_db < db/schema.sql`
4) Optional: seed catalog items from `db/seed_catalog.json` using your backend importer.

Notes
- This is stack‑agnostic (NestJS or Go both fit). Choose your backend and wire it to the OpenAPI and schema here.
- Zero‑approval path uses WhatsApp deep links (no Cloud API). See `docs/auth-whatsapp.md`.
- Keep dependencies on latest stable with Renovate and CI gates before merge.

