import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  if (!userId) return NextResponse.json(
    { message: 'User ID must be supplied' },
    { status: 400 }
  );

  const notifs = await prisma.notifications.findMany({
    where: { sender: userId },
    include: { PolicyNotif: true, ClaimNotif: true, NewsNotif: true },
  });
  
  return NextResponse.json(
    notifs,
    { status: notifs.length > 0 ? 200 : 404 }
  );
};
