# SoftFawer WhatsApp Gateway

Node.js gateway service connecting WhatsApp to bot handlers.

## Quick Start

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Run development
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/connect/:tenantId` | Connect WhatsApp |
| POST | `/disconnect/:tenantId` | Disconnect |
| GET | `/status/:tenantId` | Get status |
| POST | `/send/:tenantId` | Send message |
| GET | `/sessions` | List sessions |
| WS | `/ws/:tenantId` | Real-time updates |

## Docker

```bash
npm run build
docker build -t softfawer-gateway .
docker run -p 3001:3001 softfawer-gateway
```
