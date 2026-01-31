# Twilio Cold Calling Platform

## Overview

Full-stack cold calling campaign management platform. Team members make calls and send SMS to leads via Twilio, track conversations, and monitor performance from a dashboard.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5, React 19 |
| Database | SQLite + Prisma ORM 6.19 |
| Styling | Tailwind CSS 4 |
| External | Twilio API (voice + SMS) |
| Package Manager | npm |

## Project Structure

```
app/                    # Next.js App Router
  api/                  # REST API routes
    calls/              # Call initiation + status webhook
    messages/           # SMS send, status, incoming webhook
    leads/              # CRUD + [id] route
    team-members/       # CRUD
    dashboard/stats/    # Aggregated stats
    twilio/phone-numbers/ # List Twilio numbers
  leads/page.tsx        # Lead management UI
  team/page.tsx         # Team management UI
  page.tsx              # Dashboard
  layout.tsx            # Root layout
lib/
  prisma.ts             # Prisma singleton
  twilio.ts             # Twilio client init
prisma/
  schema.prisma         # Data model (4 tables)
  dev.db                # SQLite database
```

## Data Model

4 tables: `TeamMember`, `Lead`, `Call`, `Message`

- Leads assigned to TeamMembers (optional)
- Calls link Lead + TeamMember + Twilio SID
- Messages link Lead + optional TeamMember + Twilio SID
- Lead statuses: new, contacted, qualified, not_interested, converted
- Call statuses: queued, ringing, in-progress, completed, failed, busy, no-answer
- Message statuses: queued, sending, sent, delivered, failed

## Call Flow

1. User clicks Call on a lead → selects team member + caller ID
2. API calls Twilio → Twilio calls team member first
3. Team member answers → Twilio bridges to lead
4. Status webhook updates call record in DB

## Environment Variables

```
DATABASE_URL="file:./dev.db"
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_ID
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development

```bash
npm install
npm run dev           # Start dev server (localhost:3000)
npm run lint          # ESLint
npx prisma studio    # Database GUI
npx prisma migrate reset  # Reset DB
```

For webhooks locally: use ngrok (`ngrok http 3000`) and update Twilio console.

## Conventions

- API routes return JSON with consistent error shapes
- Phone numbers in E.164 format (+1XXXXXXXXXX)
- Prisma client singleton in `lib/prisma.ts`
- Twilio client singleton in `lib/twilio.ts`
- Server components by default, "use client" only when needed
- Tailwind for all styling, no CSS modules
- No `any` types — use Prisma generated types
