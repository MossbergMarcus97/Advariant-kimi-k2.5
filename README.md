# AdVariant - AI-Powered Ad Generation Platform

Built with Next.js 15, Cloudflare Workers, GPT Image 1.5, GPT 5.2, and Gemini 3 Nano Banana Pro.

## Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS (Swiss Precision Design)
- **Backend**: Cloudflare Workers + Hono + Drizzle ORM
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (S3-compatible)
- **AI Models**: 
  - GPT Image 1.5 (image generation)
  - GPT 5.2 (copy generation)
  - Gemini 3 Nano Banana Pro (alternative image generation)

## Repository Structure

```
├── frontend/          # Next.js 15 frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # API client and utilities
├── backend/          # Cloudflare Workers API
│   ├── src/         # Hono routes and services
│   └── migrations/  # D1 database migrations
└── .github/workflows/ # CI/CD automation
```

## Deployment

This repository is connected to Cloudflare via GitHub Actions. Pushing to `main` automatically deploys:

1. **Frontend** → Cloudflare Pages
2. **Backend** → Cloudflare Workers  
3. **Database** → D1 migrations (manual trigger)

### Required GitHub Secrets

Set these in your GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages + Workers + D1 permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., `https://advariant-api.your-subdomain.workers.dev`) |

### Getting Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens
2. Create Token → Use "Custom token"
3. Permissions needed:
   - `Cloudflare Pages:Edit`
   - `Workers Scripts:Edit`
   - `D1:Edit`
   - `Account:Read`
   - `Zone:Read`

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Database
```bash
cd backend
npx wrangler d1 migrations apply advariant-db --local
```

## Features

- ✅ JWT Authentication
- ✅ Client management
- ✅ Campaign creation wizard
- ✅ Brand kit management
- ✅ AI-powered ad generation
- ✅ Multi-platform support (Meta, Google, TikTok, LinkedIn)
- ✅ Asset gallery

## Live URLs

- **Frontend**: https://advariant-platform.pages.dev
- **Backend**: https://advariant-api.swarm-consensus.workers.dev

## Swiss Precision Design System

- **Primary Color**: Lime `#D4FF00`
- **Typography**: Inter (tight tracking)
- **Corners**: 0px (square)
- **Grid**: 8px base unit
- **Philosophy**: Restraint as Luxury
