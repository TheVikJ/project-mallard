import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function GET(req: NextRequest) {
  const request = await req.json();
  const userId = request.body.userId;
  if (!userId) return NextResponse.json(
    { message: 'User ID must be supplied' },
    { status: 400 }
  );

  const notifs = await prisma.notifications.findMany({
    where: { sender:  },
    include: { PolicyNotif: true, ClaimNotif: true, NewsNotif: true },
  });
  
  return NextResponse.json(
    notifs,
    { status: notifs.length > 0 ? 200 : 404 }
  );
};
