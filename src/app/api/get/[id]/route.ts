import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notifId = parseInt(id);
  
  const notif = await prisma.notifications.findUnique({
    where: { id: notifId },
    include: { PolicyNotif: true, ClaimNotif: true, NewsNotif: true },
  });
  
  return NextResponse.json(
    notif,
    { status: notif ? 200 : 404 }
  );
};
