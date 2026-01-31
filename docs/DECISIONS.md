# Technical Decisions

## 2024-11-27: Initial Architecture

**Decision**: Next.js 16 + SQLite + Prisma + Twilio
**Why**: Fastest path to working cold calling tool. SQLite needs zero setup. Prisma gives type-safe DB access. Next.js API routes handle both UI and webhooks.

## 2024-11-27: No Authentication

**Decision**: Skip auth for MVP
**Why**: Internal tool, single user/team. Auth adds complexity without value for current use case.
**Revisit when**: Multi-tenant or public deployment needed.

## 2024-11-27: Team Member → Lead Call Flow

**Decision**: Always call team member first, then bridge to lead
**Why**: Twilio best practice. Team member is ready before lead picks up. Avoids dead air.
