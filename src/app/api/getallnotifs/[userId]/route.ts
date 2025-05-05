import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

type NotificationFilters = {
  type?: 'policy' | 'claim' | 'news';
  isFlagged?: boolean;
  isDraft?: boolean;
  sender?: string;
  recipient?: string;
  priority?: number;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ message: 'User ID must be supplied' }, { status: 400 });
  }

  const body: NotificationFilters = await req.json();

  // Build filters for the notifications table only
  const notificationFilters = {
    sender: userId,
    ...(body.recipient && { recipient: body.recipient }),
    ...(typeof body.isFlagged === 'boolean' && { isFlagged: body.isFlagged }),
    ...(typeof body.isDraft === 'boolean' && { isDraft: body.isDraft }),
    ...(typeof body.priority === 'number' && { priority: body.priority }),
  };

  try {
    // Step 1: Filter notifications only
    const filteredNotifications = await prisma.notifications.findMany({
      where: notificationFilters,
      select: { id: true },
    });

    const notifIds = filteredNotifications.map(n => n.id);
    if (notifIds.length === 0) return NextResponse.json([], { status: 200 });

    // Step 2: Fetch matching notifs only by notif_id
    const results: any[] = [];

    if (!body.type || body.type === 'claim') {
      console.log(notifIds);
      const claims = await prisma.claim_notifs.findMany({
        where: { notif_id: { in: notifIds } },
        include: { Notification: true },
      });
      results.push(...claims.map(c => ({ ...c, type: 'claim' })));
    }

    if (!body.type || body.type === 'policy') {
      const policies = await prisma.policy_notifs.findMany({
        where: { notif_id: { in: notifIds } },
        include: { Notification: true },
      });
      results.push(...policies.map(p => ({ ...p, type: 'policy' })));
    }

    if (!body.type || body.type === 'news') {
      const news = await prisma.news_notifs.findMany({
        where: { notif_id: { in: notifIds } },
        include: { Notification: true },
      });
      results.push(...news.map(n => ({ ...n, type: 'news' })));
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: `Request error: ${error.message}` }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ message: `Validation error: ${error.message}` }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 });
    }
  }
}
