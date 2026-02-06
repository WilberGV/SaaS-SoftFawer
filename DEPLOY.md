# SoftFawer Production Deployment Guide

This guide details the steps to deploy the SoftFawer SaaS platform to production. The architecture consists of a **Next.js Frontend** (Vercel) and a **Python Gateway** (VPS/Docker).

## 1. Prerequisites

- **GitHub Repository**: Ensure all code is pushed to `main`.
- **Vercel Account**: For frontend hosting.
- **Firebase Project**: "Blaze" plan (Pay as you go) required for external API calls.
- **Stripe Account**: Activated for payments.
- **VPS (Ubuntu 22.04 recommended)**: For the WhatsApp Gateway.

## 2. Environment Variables

Ensure you have the following secrets ready.

### Frontend (.env.local / Vercel Environment Variables)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Client SDK Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Public Key (pk_live_...) |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret (whsec_...) |
| `NEXT_PUBLIC_GATEWAY_URL` | URL of your Python Gateway (e.g., `https://gateway.softfawer.com`) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Email of the SuperAdmin user |

## 3. Frontend Deployment (Vercel)

1.  **Import Project**: Connect your GitHub repo to Vercel.
2.  **Configure Project**:
    - Framework Preset: Next.js
    - Root Directory: `frontend` (Important!)
3.  **Add Environment Variables**: Copy the values from your local `.env` (using production keys).
4.  **Deploy**: Click "Deploy".
5.  **Custom Domain**: Go to Settings > Domains and add `softfawer.com`.

## 4. Backend/Gateway Deployment (VPS)

The Python Gateway handles WhatsApp connections and requires a persistent server.

1.  **SSH into Server**: `ssh root@your-server-ip`
2.  **Install Docker & Docker Compose**:
    ```bash
    apt update && apt install docker.io docker-compose -y
    ```
3.  **Clone Repository**:
    ```bash
    git clone https://github.com/WilberGV/SoftFawer.git
    cd SoftFawer/gateway
    ```
4.  **Configure Env**: Create a `.env` file in the `gateway` folder.
    ```env
    PORT=3001
    API_KEY=your_secure_api_key
    FIREBASE_CREDENTIALS=firebase-adminsdk.json
    ```
5.  **Firebase Admin SDK**:
    - Go to Firebase Console > Project Settings > Service Accounts.
    - Generate correct private key.
    - Save as `firebase-adminsdk.json` in the `gateway` folder.
6.  **Run with Docker**:
    ```bash
    docker-compose up -d --build
    ```
7.  **Reverse Proxy (Nginx/Caddy)**:
    - Set up a proxy to forward `https://gateway.softfawer.com` to `localhost:3001`.
    - Ensure WebSocket support (`Upgrade` headers) is enabled.

## 5. Stripe Configuration

1.  **Webhooks**:
    - Add an endpoint in Stripe Dashboard > Developers > Webhooks.
    - URL: `https://softfawer.com/api/webhooks/stripe`
    - Events: `checkout.session.completed`, `invoice.payment_succeeded`.
2.  **Customer Portal**:
    - Enable "Customer Portal" in Stripe Settings.
    - Allow customers to update subscriptions and payment methods.

## 6. Final Verification

1.  **Sign Up**: Create a new account on production.
2.  **Purchase**: Buy a subscription (use a real card or 100% off coupon).
3.  **Bot Launch**:
    - Go to Dashboard.
    - Click "Encender Bot".
    - Verify the "Last Activity" log updates.
    - Scan QR code and test message flow.

deployment_complete
