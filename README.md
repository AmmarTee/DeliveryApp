# DeliveryApp

Phase 1 MVP with simple customer and merchant dashboards.

## Features
- Email/password account creation with customer or merchant role.
- Navigation bar for Categories, Orders and Payments sections.
- Customers choose items from dropdown menus and send orders.
- Orders broadcast in real time to the merchant dashboard and stored locally with totals.
- Data persists via browser localStorage and Docker volumes for backend services.

## Development

```bash
docker-compose build
docker-compose up -d web
# app available at http://localhost:3000
```

## Testing

```bash
docker-compose run --rm web npm run lint
docker-compose run --rm web npm run build
docker-compose run --rm nlp pytest
```
