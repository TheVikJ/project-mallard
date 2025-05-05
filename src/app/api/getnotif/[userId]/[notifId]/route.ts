import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ notifId: string }> }) {
  const { notifId } = await params;
  const _notifId = parseInt(notifId);
  
  const notif = await prisma.notifications.findUnique({
    where: { id: _notifId },
    include: { PolicyNotif: true, ClaimNotif: true, NewsNotif: true },
  });
  
  return NextResponse.json(
    notif,
    { status: notif ? 200 : 404 }
  );
};
