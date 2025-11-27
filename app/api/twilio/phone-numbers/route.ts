import { NextResponse } from 'next/server';
import { twilioClient } from '@/lib/twilio';

export async function GET() {
  try {
    const incomingPhoneNumbers = await twilioClient.incomingPhoneNumbers.list();

    const phoneNumbers = incomingPhoneNumbers.map(number => ({
      sid: number.sid,
      phoneNumber: number.phoneNumber,
      friendlyName: number.friendlyName,
    }));

    return NextResponse.json(phoneNumbers);
  } catch (error) {
    console.error('Error fetching Twilio phone numbers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone numbers' },
      { status: 500 }
    );
  }
}
