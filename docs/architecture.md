Architecture Overview (MVP)

Goals
- Approval-free run path: WhatsApp deep-link auth; no WhatsApp Cloud API required.
- Direct-to-merchant: quotes, chat, orders; merchant handles delivery & payments.
- Latest stable deps; Cloudflare as edge; origin locked to Cloudflare.

Components
- Edge: Cloudflare DNS+Proxy, WAF, Rate-limit, mTLS to origin, caching of static/PWA.
- Backend API: Node.js (NestJS) or Go service implementing OpenAPI in `openapi/openapi.yaml`.
- DB: PostgreSQL for relational data and integrity.
- Cache/Queues: Redis (MVP can start with Redis pub/sub; Kafka later).
- Object Storage: MinIO/R2-compatible for media (KYC, proof of delivery).
- Realtime: WebSocket (e.g., Socket.IO) for chat/order status; fallback to polling for MVP if needed.
- Services (logical):
  - Auth Service: WhatsApp deep-link verification, JWT mint/refresh.
  - List Parser: NLP + unit normalizer (Python microservice). MVP: light rules + synonyms table.
  - Quotes/Orders: Quote inbox, acceptance, order lifecycle.
  - Ratings: Rolling 90-day computation on demand with a nightly aggregator.
  - Admin: KYC review, moderation, disputes.

Data Flow (happy path)
1) User creates list (raw or structured). Parser normalizes items/units.
2) User selects merchants; system dispatches quote requests.
3) Merchants submit quotes (line items, delivery fee, ETA).
4) User accepts a quote; order is created and tracked through statuses.
5) Delivery proof uploaded to S3/R2; upon delivered status, user can review.
6) Ratings endpoint serves 90-day rolling score; nightly job pre-aggregates.

Security & Networking
- No in-app proxies/tunnels. All ingress via Cloudflare.
- Backend accepts traffic only with Cloudflare Origin Cert/mTLS; direct hits blocked.
- JWT + refresh tokens; device binding claim; RBAC by role (user/merchant/admin).
- Webhook/HMAC for future integrations (e.g., PSPs, third-party delivery).

Observability
- OpenTelemetry traces; Prometheus metrics; centralized logs. Start with basic request logs + DB slow query logs.

Zero-Approval WhatsApp Auth (summary)
- Deep-link (wa.me) with one-time code; user sends message from their WhatsApp.
- Inbox Listener (you control) reads inbound messages to verify code without Cloud API.
- See `docs/auth-whatsapp.md` for the exact flow and contracts.

Run Locally
- `docker compose up -d` to start Postgres/Redis/MinIO.
- Apply `db/schema.sql`. Backend uses `DATABASE_URL`, `REDIS_URL`, and S3 creds.

