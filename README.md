# Delivery App MVP

Quick start

1. Create env file
2. Build and run with Docker
3. Run database migration and seed

Commands

cd infra
cp .env.example .env
# edit values
docker compose up --build -d

# In another terminal run migrations and seed
docker compose exec api npx prisma migrate deploy
docker compose exec api node dist/seed.js

Web is at http://localhost:5173
API is at http://localhost:8080
