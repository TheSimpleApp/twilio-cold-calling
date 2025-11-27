import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total counts
    const [totalLeads, totalCalls, totalMessages, teamMembers] = await Promise.all([
      prisma.lead.count(),
      prisma.call.count(),
      prisma.message.count(),
      prisma.teamMember.count(),
    ]);

    // Get leads by status
    const leadsByStatus = await prisma.lead.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get recent calls with duration
    const completedCalls = await prisma.call.findMany({
      where: { status: 'completed' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalCallDuration = completedCalls.reduce(
      (sum, call) => sum + (call.duration || 0),
      0
    );

    // Get today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [callsToday, messagestoday] = await Promise.all([
      prisma.call.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.message.count({
        where: { createdAt: { gte: today } },
      }),
    ]);

    return NextResponse.json({
      totalLeads,
      totalCalls,
      totalMessages,
      teamMembers,
      leadsByStatus: leadsByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
      averageCallDuration:
        completedCalls.length > 0
          ? Math.round(totalCallDuration / completedCalls.length)
          : 0,
      callsToday,
      messagesToday: messagestoday,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
