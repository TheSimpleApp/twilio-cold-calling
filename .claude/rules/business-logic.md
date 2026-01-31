# Business Logic Rules

## Domain: Cold Calling Campaigns

- Leads must have firstName, lastName, phone (minimum)
- Phone numbers always E.164 format (+1XXXXXXXXXX)
- Calls always go: Twilio → team member first → bridge to lead
- Never call a lead directly without team member in the loop
- Track every call/message with Twilio SID for audit trail

## Data Integrity

- Don't delete leads with call/message history — use status changes
- Call duration comes from Twilio webhook, not client-side
- Message status updates come from Twilio webhooks only
- Always validate Twilio webhook signatures in production

## Security

- Twilio credentials in .env only, never client-side
- NEXT_PUBLIC_ prefix only for non-sensitive values
- Webhook endpoints should validate Twilio signatures
- SQLite is dev-only; production needs PostgreSQL
