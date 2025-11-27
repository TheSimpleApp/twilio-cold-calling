import { NextRequest, NextResponse } from 'next/server';
import { twilioClient } from '@/lib/twilio';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { leadId, teamMemberId, body, fromNumber } = await request.json();

    // Get lead info
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Create message record in database
    const message = await prisma.message.create({
      data: {
        leadId,
        teamMemberId,
        direction: 'outbound',
        body,
        status: 'queued',
      },
    });

    // Send SMS via Twilio
    const twilioMessage = await twilioClient.messages.create({
      to: lead.phone,
      from: fromNumber,
      body,
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/messages/status`,
    });

    // Update message with Twilio SID
    await prisma.message.update({
      where: { id: message.id },
      data: { twilioMessageSid: twilioMessage.sid },
    });

    return NextResponse.json({
      success: true,
      messageId: message.id,
      twilioMessageSid: twilioMessage.sid,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
