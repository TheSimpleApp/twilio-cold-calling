import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const callDuration = formData.get('CallDuration') as string;
    const recordingUrl = formData.get('RecordingUrl') as string | null;

    // Find the call by Twilio SID
    const call = await prisma.call.findUnique({
      where: { twilioCallSid: callSid },
    });

    if (!call) {
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      );
    }

    // Update call status
    await prisma.call.update({
      where: { id: call.id },
      data: {
        status: callStatus,
        duration: callDuration ? parseInt(callDuration) : null,
        recordingUrl: recordingUrl || undefined,
      },
    });

    // Update lead status if call was successful
    if (callStatus === 'completed' && call.leadId) {
      await prisma.lead.update({
        where: { id: call.leadId },
        data: { status: 'contacted' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating call status:', error);
    return NextResponse.json(
      { error: 'Failed to update call status' },
      { status: 500 }
    );
  }
}
