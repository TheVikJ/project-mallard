import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma, policy_notifs, claim_notifs, news_notifs } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  if (!userId) return NextResponse.json(
    { message: 'User ID must be supplied' },
    { status: 400 }
  );

  const body = await req.json();
  if (body && !body.type && !body.flagged) return NextResponse.json(
    { message: 'Body must include either \'type\' or \'flagged\' fields' },
    { status: 400 },
  );

  const notificationFilters = {
    is_flagged: body.is_flagged,
  };

  try {
    let res: (policy_notifs | claim_notifs | news_notifs)[];
    switch (body.type) {
      case 'policy':
        res = await getPolicies(userId, notificationFilters);
        break;
      case 'claim':
        res = await getClaims(userId, notificationFilters);
        break;
      case 'news':
        res = await getNews(userId, notificationFilters);
        break;
      default:
        return NextResponse.json(
          { message: 'Property \'type\' must be one of [\'policy\', \'claim\', \'news\']' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      res,
      { status: 200 },
    );
  }
  catch (error) {
    if (error instanceof Error && error.message === 'Access forbidden') return NextResponse.json({ message: error.message }, { status: 403 });
    else if (error instanceof Prisma.PrismaClientKnownRequestError) return NextResponse.json({ message: `Request error: ${error.message}` }, { status: 400 });
    else if (error instanceof Prisma.PrismaClientValidationError) return NextResponse.json({ message: `Validation error: ${error.message}` }, { status: 400 });
    else return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 });
  }
};

async function getPolicies(userId: string, notificationFilters: object): Promise<policy_notifs[]> {
  return await prisma.policy_notifs.findMany({
    where: {
      Notification: { sender: userId },
      ...notificationFilters,
    },
    include: { Notification: true }
  });
}

async function getClaims(userId: string, notificationFilters: object): Promise<claim_notifs[]> {
  return await prisma.claim_notifs.findMany({
    where: {
      Notification: { sender: userId },
      ...notificationFilters,
    },
    include: { Notification: true }
  });
}     

async function getNews(userId: string, notificationFilters: object): Promise<news_notifs[]> {
  return await prisma.news_notifs.findMany({
    where: {
      Notification: { sender: userId },
      ...notificationFilters,
    },
    include: { Notification: true }
  });
}
