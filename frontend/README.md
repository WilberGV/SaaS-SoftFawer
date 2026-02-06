# SoftFawer - Automation Agency Platform

A Next.js 15 e-commerce platform for selling WhatsApp/Telegram bots and automation services.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Stripe keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── marketplace/        # Product catalog
│   ├── producto/[slug]/    # Product details
│   ├── carrito/            # Shopping cart
│   ├── checkout/           # Stripe checkout
│   ├── dashboard/          # User & Admin dashboards
│   ├── blog/               # Blog posts
│   ├── contacto/           # Contact form
│   └── api/                # API routes
├── components/             # React components
├── context/                # Auth & Cart contexts
├── lib/                    # Firebase, Stripe, utilities
├── data/                   # Product catalog
└── types/                  # TypeScript types
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Auth**: Firebase Authentication
- **Database**: Cloud Firestore
- **Payments**: Stripe
- **Animations**: Framer Motion

## 📋 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## 🔐 Environment Variables

See `.env.example` for required variables.

## 🔥 Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Deploy security rules: `firebase deploy --only firestore:rules,storage:rules`

## 💳 Stripe Setup

1. Create Stripe account
2. Get API keys from Dashboard
3. Configure webhook endpoint: `/api/webhooks/stripe`

## 📄 License

MIT
