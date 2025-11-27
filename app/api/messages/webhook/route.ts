import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const messageSid = formData.get('MessageSid') as string;
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;

    // Find lead by phone number
    const lead = await prisma.lead.findFirst({
      where: { phone: from },
    });

    if (!lead) {
      // Create TwiML response
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        {
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    // Create incoming message record
    await prisma.message.create({
      data: {
        leadId: lead.id,
        twilioMessageSid: messageSid,
        direction: 'inbound',
        body,
        status: 'received',
      },
    });

    // Create TwiML response
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  } catch (error) {
    console.error('Error processing incoming message:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  }
}
