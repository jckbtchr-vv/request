# VV Request Submission App

A minimalist request submission application for collecting visual requests in VV (Visualize Value) style. Built with **Nuxt 3**. Users can submit links or quotes along with their social handles, and admins can review, respond, and upload completed visuals through a clean dashboard interface.

## Features

### Public Submission Form
- Clean, minimalist interface for submitting visual requests
- Users provide:
  - Link or quote content
  - Social media handle
- Real-time submission feedback
- Styled with VV aesthetic using T26 Carbon and Departure Mono fonts

### Admin Dashboard
- Review all submissions with full details
- Filter by status: pending, completed, rejected
- Update submission status
- Add admin notes
- Upload response URLs for completed visuals
- Real-time updates

## Tech Stack

- **Framework**: Nuxt 3
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + Custom VV design system
- **TypeScript**: Full type safety
- **Fonts**: T26 Carbon (headings), Departure Mono (monospace)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (or Vercel Postgres)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jckbtchr-vv/request.git
cd request
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to see the submission form

7. Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

## Database Schema

```prisma
model Submission {
  id           String   @id @default(cuid())
  content      String   // link or quote
  socialHandle String
  status       String   @default("pending") // pending, completed, rejected
  response     String?  // admin notes
  responseUrl  String?  // uploaded visual URL
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## API Routes

- `GET /api/submissions` - Fetch all submissions
- `POST /api/submissions` - Create new submission
- `PATCH /api/submissions/[id]` - Update submission status and response

## Design System

The app uses the VV design aesthetic:

- **Typography**:
  - Headings: T26 Carbon (uppercase, tight letter spacing)
  - Body: Departure Mono (monospace)
- **Colors**:
  - Background: `#ffffff`
  - Foreground: `#050505`
  - Muted: `#7a7a7a`
  - Grid: `#d9d7d1`
- **Layout**: Minimal borders, dashed grid lines, high contrast cards

## Deployment

### Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add a Vercel Postgres database:
   - Go to Storage tab → Create Database → Postgres
   - This automatically sets `DATABASE_URL` and related env vars
4. Set the build command to: `npm run build:with-db`
5. Deploy

**Important**: The default `npm run build` skips database setup. Use `npm run build:with-db` to include Prisma migrations.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (set automatically by Vercel Postgres) |

## Project Structure

```
request/
├── pages/
│   ├── index.vue              # Public submission form
│   └── admin.vue              # Admin dashboard
├── server/
│   ├── api/
│   │   └── submissions/
│   │       ├── index.get.ts   # List submissions
│   │       ├── index.post.ts  # Create submission
│   │       └── [id].patch.ts  # Update submission
│   └── utils/
│       └── prisma.ts          # Prisma client singleton
├── assets/
│   └── css/
│       └── main.css           # VV styling
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/
│   └── fonts/                 # T26 Carbon & Departure Mono
├── app.vue                    # Root app component
└── nuxt.config.ts             # Nuxt configuration
```

## License

MIT
