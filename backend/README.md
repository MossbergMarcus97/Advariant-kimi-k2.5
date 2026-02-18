# AdVariant API

Cloudflare Workers backend for the AdVariant AI-powered ad generation platform.

## Architecture

- **Runtime**: Cloudflare Workers
- **Database**: D1 (SQLite)
- **Storage**: R2 (S3-compatible object storage)
- **Cache/Sessions**: KV
- **Framework**: Hono
- **ORM**: Drizzle ORM

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create D1 Database
```bash
npx wrangler d1 create advariant-db
```
Copy the database ID into `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "advariant-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 3. Create R2 Buckets
```bash
npx wrangler r2 bucket create advariant-assets
npx wrangler r2 bucket create advariant-generations
```

### 4. Create KV Namespaces
```bash
npx wrangler kv namespace create "SESSIONS"
npx wrangler kv namespace create "RATE_LIMIT"
```
Copy the IDs into `wrangler.toml`.

### 5. Set Secrets
```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put REPLICATE_API_TOKEN
npx wrangler secret put JWT_SECRET
```

### 6. Run Migrations
```bash
npx wrangler d1 migrations apply advariant-db
```

### 7. Deploy
```bash
npm run deploy
```

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Create new account
- `POST /auth/logout` - Invalidate session
- `GET /auth/me` - Get current user

### Clients
- `GET /clients` - List clients
- `GET /clients/:id` - Get client details
- `POST /clients` - Create client
- `PATCH /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Campaigns
- `GET /campaigns` - List campaigns
- `GET /campaigns/:id` - Get campaign details
- `POST /campaigns` - Create campaign
- `PATCH /campaigns/:id` - Update campaign
- `DELETE /campaigns/:id` - Delete campaign

### AI Generations
- `GET /generations?campaignId=x` - List generations
- `GET /generations/:id` - Get generation status
- `POST /generations` - Start new generation
- `POST /generations/suggestions` - Get headline suggestions
- `POST /generations/:id/regenerate` - Regenerate image

### Uploads
- `POST /uploads/assets` - Upload image asset
- `GET /uploads/assets/:key` - Serve asset
- `GET /uploads/generations/:key` - Serve generated image

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## Environment Variables

### Required Secrets
- `OPENAI_API_KEY` - OpenAI API key for DALL-E
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude
- `REPLICATE_API_TOKEN` - Replicate API token for Flux
- `JWT_SECRET` - Secret for signing JWTs

### Bindings (configured in wrangler.toml)
- `DB` - D1 database
- `ASSETS_BUCKET` - R2 bucket for uploaded assets
- `GENERATIONS_BUCKET` - R2 bucket for AI-generated images
- `SESSIONS` - KV namespace for session storage
- `RATE_LIMIT` - KV namespace for rate limiting

## Development

```bash
# Local development
npm run dev

# Apply migrations locally
npx wrangler d1 migrations apply advariant-db --local
```

## Rate Limits

- General API: 60 requests/minute
- AI Generation: 5 requests/minute
