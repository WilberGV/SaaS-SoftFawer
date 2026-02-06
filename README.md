# SoftFawer - IA & Business Automation Ecosystem

SoftFawer is a high-performance, multi-tenant SaaS platform designed for AI consulting and automated business solutions. It combines a premium e-commerce marketplace with a robust WhatsApp bot management system.

## 🚀 Key Features

### 🏢 Multi-Tenant SaaS Engine
- **Isolated Namespaces**: Every user (tenant) is automatically provisioned with a secure, isolated environment for their bots.
- **Real-time Bot Control**: Real-time status monitoring and connection management via WebSockets.
- **QR Code Pairing**: Direct WhatsApp linking through the dashboard using dynamic QR codes.

### 🏰 SuperAdmin Backoffice
- **Global Metrics**: Real-time tracking of revenue, user growth, and active bot instances.
- **User Management**: Role-based access control (Admin, SuperAdmin, Editor, etc.).
- **Platform Control**: Global maintenance mode, promotional banners, and system health monitoring.

### 🛒 Premium Marketplace
- **Modern UI**: Glassmorphism and Bento-grid layouts for a futuristic experience.
- **Stripe Integration**: Secure checkout and subscription management.
- **SEO Optimized**: Advanced metadata and structured data (JSON-LD) for search excellence.

## 🛠️ Technology Stack

- **Frontend**: [Next.js 15+](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/).
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage).
- **Gateway**: [Fastify](https://www.fastify.io/) (Node.js), [Baileys](https://github.com/WhiskeySockets/Baileys).
- **Finance**: [Stripe](https://stripe.com/).

## 📦 Project Structure

```text
├── frontend/          # Next.js Application
│   ├── src/app/       # Routes and Pages
│   ├── src/components/# UI Components
│   └── src/context/   # Shared State (Auth, Cart)
├── gateway/           # WhatsApp & WebSocket Server
│   ├── src/server.ts  # Main entry point
│   └── src/routes/    # API Endpoints
└── firestore.rules    # Security & Multi-tenancy Rules
```

## 🚥 Getting Started

### 1. Environment Configuration
Create a `.env` file in both `frontend/` and `gateway/` based on the provided configuration variables.

### 2. Install Dependencies
```bash
# In frontend/ and gateway/
npm install
```

### 3. Run Development Servers
```bash
# Frontend
cd frontend && npm run dev

# Gateway
cd gateway && npm run dev
```

## 🛡️ Security
The platform utilizes a multi-layer security model combining Firebase Auth, role-based metadata, and strict Firestore path-rules to ensure tenant isolation and administrative security.

---
Developed by **SoftFawer Engineering Team**.
