# VV Request Submission App

A minimalist request submission application for collecting visual requests in VV (Visualize Value) style. Users can submit links or quotes along with their social handles, and admins can review, respond, and upload completed visuals through a clean dashboard interface.

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

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma ORM
- **Styling**: Custom CSS with VV design system
- **TypeScript**: Full type safety
- **Fonts**: T26 Carbon (headings), Departure Mono (monospace)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

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

3. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the submission form

6. Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

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

The app uses the VV design aesthetic inspired by the oracle-rbr-presentation fork:

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

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jckbtchr-vv/request)

Or deploy manually:

1. Push to GitHub
2. Connect to Vercel
3. Deploy with default settings
4. Database will be automatically created

## Project Structure

```
request/
├── app/
│   ├── api/
│   │   └── submissions/
│   │       ├── route.ts           # List & create submissions
│   │       └── [id]/route.ts      # Update submissions
│   ├── admin/
│   │   └── page.tsx               # Admin dashboard
│   ├── page.tsx                   # Public submission form
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # VV styling
├── lib/
│   └── prisma.ts                  # Prisma client singleton
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
└── public/
    └── fonts/                     # T26 Carbon & Departure Mono
```

## License

MIT
