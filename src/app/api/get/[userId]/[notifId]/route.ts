import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string, notifId: string }> }) {
  const { userId, notifId } = await params;
  const _notifId = parseInt(notifId);
  
  const notif = await prisma.notifications.findUnique({
    where: { id: _notifId, sender: userId },
    include: { PolicyNotif: true, ClaimNotif: true, NewsNotif: true },
  });
  
  return NextResponse.json(
    notif,
    { status: notif ? 200 : 404 }
  );
};
