# Vercel Deployment Setup

## Quick Setup Instructions

### 1. Add Postgres Database in Vercel

1. Go to your Vercel project: https://vercel.com/jckbtchr-vv/request
2. Click on **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose a database name (e.g., `request-db`)
6. Click **"Create"**

Vercel will automatically:
- Create a PostgreSQL database
- Add the `DATABASE_URL` environment variable to your project
- Connect it to all environments (Production, Preview, Development)

### 2. Redeploy

Once the database is connected:
1. Go to the **"Deployments"** tab
2. Click on the latest failed deployment
3. Click **"Redeploy"**

Or just push a new commit and Vercel will rebuild automatically.

### 3. Database Will Auto-Migrate

The build script will automatically:
- Generate Prisma Client
- Run database migrations
- Deploy your schema to Postgres

## Alternative: Manual Environment Variable Setup

If you prefer to use your own PostgreSQL database:

1. Get a Postgres connection string from:
   - [Supabase](https://supabase.com) (Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [Railway](https://railway.app)
   - [PlanetScale](https://planetscale.com)

2. Add it to Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add `DATABASE_URL` with your connection string
   - Format: `postgresql://user:password@host:port/database`

3. Redeploy

## Local Development After Vercel Setup

To use the Vercel Postgres database locally:

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

## Troubleshooting

### Error: Missing DATABASE_URL
- Make sure you've added a Postgres database in Vercel Storage
- Check that the environment variable is set in Settings → Environment Variables
- Try redeploying after adding the database

### Database Migration Errors
- The first deployment will create all tables automatically
- If you make schema changes, push them and Vercel will run migrations automatically

