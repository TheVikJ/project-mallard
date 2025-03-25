import { NextResponse } from 'next/server';

import prisma from '@/utils/prisma';

export async function GET() {
  const notifs = await prisma.notifications.findMany({
    include: { PolicyNotif: true, ClaimNotif: true, NewsNotif: true },
  });
  
  return NextResponse.json(
    notifs,
    { status: notifs.length > 0 ? 200 : 404 }
  );
};
