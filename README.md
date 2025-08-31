# DeliveryApp

MVP marketplace for customers to request groceries from nearby merchants.

## Development

```bash
cd infra
cp .env.example .env
# fill values if needed
npm install --prefix ../api
npm install --prefix ../web
# run migrations
cd ../api && npx prisma generate && npm run migrate && cd -
# build containers
cd infra && docker compose up --build
```

## Testing

```bash
cd packages/web && npm run lint
cd packages/web && npm run build
cd packages/nlp && pytest
```
