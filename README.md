# DeliveryApp

MVP marketplace for customers to request groceries from nearby merchants.

## Development

```bash
cd infra
cp .env.example .env
# fill values if needed
docker compose up --build
```

## Testing

```bash
cd web && npm run build
cd packages/nlp && pytest
```
