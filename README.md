# Twilio Cold Calling Web App

A modern web application for managing cold calling campaigns with Twilio integration. Track leads, make calls, send SMS messages, and monitor team performance all in one place.

## Features

- **Lead Management**: Add, track, and organize leads with detailed information
- **Click-to-Call**: Initiate calls to leads directly from the web interface
- **SMS Messaging**: Send and receive text messages with leads
- **Team Dashboard**: Monitor team performance with real-time statistics
- **Phone Number Selection**: Choose from your available Twilio phone numbers as caller ID
- **Call History**: Track all calls with duration, status, and notes
- **Message History**: View all SMS conversations with leads
- **Lead Status Tracking**: Organize leads by status (new, contacted, qualified, etc.)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Communication**: Twilio API for calls and SMS

## Prerequisites

- Node.js 18+ installed
- A Twilio account with:
  - Account SID
  - Auth Token
  - At least one phone number with voice and SMS capabilities

## Installation

1. Navigate to the project directory:
```bash
cd twilio-cold-calling
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
The `.env` file has been pre-configured with your Twilio credentials. Verify it contains:

```env
DATABASE_URL="file:./dev.db"

# Twilio Configuration
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_SERVICE_ID="your_service_id"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. The database has already been set up. To reset it if needed:
```bash
npx prisma migrate reset
npx prisma generate
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Configuring Twilio Webhooks

For incoming calls and messages to work, you need to configure webhooks in your Twilio console:

### For SMS Messages

1. Go to your Twilio Console > Phone Numbers > Active Numbers
2. Click on your phone number
3. Scroll to "Messaging Configuration"
4. Set "A Message Comes In" webhook to:
   - URL: `http://your-domain.com/api/messages/webhook`
   - HTTP Method: POST

### For Calls (Optional)

If you want to handle incoming calls:
1. In the same phone number configuration
2. Set "A Call Comes In" webhook to your custom TwiML

**Note**: For local development, you'll need to use a tool like [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 3000
```

Then use the ngrok URL (e.g., `https://abc123.ngrok.io`) in your Twilio webhook configuration.

## Usage Guide

### 1. Add Team Members

Before making calls, add your team members:
1. Navigate to the "Team" page
2. Click "Add Team Member"
3. Enter name, email, and phone number (include country code, e.g., +1234567890)
4. Team members will receive calls when initiating calls to leads

### 2. Add Leads

1. Navigate to the "Leads" page
2. Click "Add Lead"
3. Fill in lead information:
   - First Name & Last Name (required)
   - Phone number (required)
   - Email, Company, and Notes (optional)
   - Assign to a team member (optional)

### 3. Make Calls

1. On the Leads page, click the "Call" button next to a lead
2. Select which team member should handle the call
3. The system will:
   - Call the team member first
   - Once they answer, connect them to the lead
   - Record call duration and status in the database

### 4. Send SMS Messages

1. On the Leads page, click the "Message" button next to a lead
2. Type your message
3. Click "Send Message"
4. Messages are tracked in the database

### 5. Select Caller ID

- Use the "Caller ID" dropdown in the top right of the Leads page
- Select which Twilio phone number to use for outgoing calls and messages
- The app automatically loads all phone numbers from your Twilio account

### 6. View Dashboard

- The Dashboard shows real-time statistics:
  - Total leads, calls, and messages
  - Today's activity
  - Average call duration
  - Leads breakdown by status

## Database Schema

### TeamMember
- id, name, email, phone, createdAt

### Lead
- id, firstName, lastName, phone, email, company, status, notes
- assignedToId (foreign key to TeamMember)
- createdAt, updatedAt

### Call
- id, leadId, teamMemberId, twilioCallSid
- direction (inbound/outbound), duration, status
- recordingUrl, notes, createdAt

### Message
- id, leadId, teamMemberId, twilioMessageSid
- direction (inbound/outbound), body, status
- createdAt

## API Routes

- `POST /api/calls/initiate` - Initiate a new call
- `POST /api/calls/status` - Webhook for call status updates
- `POST /api/messages/send` - Send an SMS message
- `POST /api/messages/webhook` - Webhook for incoming SMS
- `POST /api/messages/status` - Webhook for message status updates
- `GET/POST /api/leads` - List or create leads
- `GET/PATCH/DELETE /api/leads/[id]` - Get, update, or delete a lead
- `GET/POST /api/team-members` - List or create team members
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/twilio/phone-numbers` - List available Twilio phone numbers

## Deployment

### Option 1: Vercel (Recommended for Next.js)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

**Note**: For production, you'll need to migrate from SQLite to PostgreSQL or another production database.

### Option 2: Other Platforms

You can deploy to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS
- Google Cloud
- Azure

## Troubleshooting

### Calls not connecting
- Verify your Twilio credentials in `.env`
- Check that team member phone numbers include country codes
- Ensure your Twilio account has sufficient balance
- Verify the Twilio phone number has voice capabilities

### Messages not sending
- Check Twilio credentials
- Verify the Twilio phone number has SMS capabilities
- Ensure recipient phone numbers are in E.164 format

### Webhooks not working
- For local development, use ngrok
- Verify webhook URLs in Twilio console
- Check that your app is accessible from the internet
- Ensure webhook URLs use HTTPS (required by Twilio)

## Future Enhancements

Potential features to add:
- Call recording playback
- Analytics and reporting
- Lead import from CSV
- Email notifications
- Call scripts/templates
- Lead scoring
- Integration with CRMs (Salesforce, HubSpot)
- Team performance leaderboards
- Automated follow-up campaigns
- Voice mail detection

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
