up:
docker compose up -d --build

down:
docker compose down

logs:
docker compose logs -f

api.shell:
docker compose exec api /bin/sh

db.migrate:
docker compose exec api npx prisma migrate deploy

db.seed:
docker compose exec api node prisma/seed.js

lint:
docker compose exec api npm run lint
docker compose exec web npm run lint
docker compose exec nlp poetry run pytest -q

test:
docker compose exec api npm test
docker compose exec nlp poetry run pytest -q
