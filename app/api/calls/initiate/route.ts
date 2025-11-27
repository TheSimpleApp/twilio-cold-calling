import { NextRequest, NextResponse } from 'next/server';
import { twilioClient } from '@/lib/twilio';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { leadId, teamMemberId, fromNumber } = await request.json();

    // Get lead and team member info
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
    });

    if (!lead || !teamMember) {
      return NextResponse.json(
        { error: 'Lead or team member not found' },
        { status: 404 }
      );
    }

    // Create a call record in the database
    const call = await prisma.call.create({
      data: {
        leadId,
        teamMemberId,
        direction: 'outbound',
        status: 'queued',
      },
    });

    // Initiate the call via Twilio
    const twilioCall = await twilioClient.calls.create({
      to: lead.phone,
      from: fromNumber,
      // TwiML to connect the call to team member
      twiml: `<?xml version="1.0" encoding="UTF-8"?>
              <Response>
                <Dial callerId="${fromNumber}">
                  <Number>${teamMember.phone}</Number>
                </Dial>
              </Response>`,
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/calls/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });

    // Update call with Twilio SID
    await prisma.call.update({
      where: { id: call.id },
      data: { twilioCallSid: twilioCall.sid },
    });

    return NextResponse.json({
      success: true,
      callId: call.id,
      twilioCallSid: twilioCall.sid,
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}
