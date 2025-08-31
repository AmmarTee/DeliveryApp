# DeliveryApp

Phase 1 MVP with simple customer and merchant dashboards.

## Features
- Email/password login or signup with customer or merchant role.
- Customers select items from dropdown menus and broadcast orders to merchants.

## Development

```bash
cd packages/web
npm install
npm run dev
# app available at http://localhost:3000
```

## Testing

```bash
cd packages/web && npm run lint
cd packages/web && npm run build
cd packages/nlp && pytest
```
