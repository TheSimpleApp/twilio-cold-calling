# Architecture

## System Design

```
Browser (React/Next.js)
  ↓ HTTP
Next.js API Routes
  ↓ Prisma ORM        ↓ Twilio SDK
SQLite (dev.db)      Twilio API
                       ↓ webhooks
                     /api/calls/status
                     /api/messages/status
                     /api/messages/webhook
```

## Data Flow

### Outbound Call
1. UI → POST /api/calls/initiate (leadId, teamMemberId, fromNumber)
2. API creates Call record (status: queued)
3. Twilio calls team member → team member answers
4. Twilio bridges call to lead
5. Twilio sends status webhooks → API updates Call record

### Outbound SMS
1. UI → POST /api/messages/send (leadId, body, fromNumber)
2. API creates Message record (status: queued)
3. Twilio sends SMS
4. Status webhook updates delivery status

### Inbound SMS
1. Lead texts Twilio number
2. Twilio → POST /api/messages/webhook
3. API creates Message record (direction: inbound)

## Key Design Decisions

- **SQLite for dev**: Zero-config, portable. Swap to PostgreSQL for production.
- **No auth layer**: Internal tool, single-tenant. Add auth before multi-tenant.
- **Server Components**: Dashboard and lists use RSC for performance.
- **Prisma ORM**: Type-safe queries, auto-generated types, easy migrations.
