import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma, policy_notifs, claim_notifs, news_notifs, notifications} from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string, notifId: string }> }) {
  const { userId, notifId } = await params;
  const _notifId = parseInt(notifId);

  // check if request has a body
  const body = await req.json();
  if (!body) return NextResponse.json({ message: 'Request must have a body' }, { status: 400 });

  // check for type and edits
  if (!body.type) return NextResponse.json({ message: 'Body must have property \'type\'' }, { status: 400 });
  if (!body.edits) return NextResponse.json({ message: 'Body must have property \'edits\'' }, { status: 400 });

  if ('is_flagged' in body.edits) {
    await prisma.notifications.update({
      where: { id: Number(notifId) },
      data: { is_flagged: body.edits.is_flagged },
    })
    delete body.edits.is_flagged
  }

  // edit according to subtype
  try {
    let res: policy_notifs | claim_notifs | news_notifs;
    switch (body.type) {
      case 'policy':
        res = await createPolicy(userId, _notifId, body.edits);
        break;
      case 'claim':
        res = await createClaim(userId, _notifId, body.edits);
        break;
      case 'news':
        res = await createNews(userId, _notifId, body.edits);
        break;
      default:
        return NextResponse.json({ message: 'Property \'type\' must be one of [\'policy\', \'claim\', \'news\']' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Edit successful', record: res }, { status: 200 });
  }
  catch (error) {
    if (error instanceof Error && error.message === 'Access forbidden') return NextResponse.json({ message: error.message }, { status: 403 });
    else if (error instanceof Prisma.PrismaClientKnownRequestError) return NextResponse.json({ message: `Request error: ${error.message}` }, { status: 400 });
    else if (error instanceof Prisma.PrismaClientValidationError) return NextResponse.json({ message: `Validation error: ${error.message}` }, { status: 400 });
    else return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 });
  }
};

async function createPolicy(userId: string, notifId: number, edits: object): Promise<policy_notifs> {
  // filter to only these properties
  const props = ['policy_id', 'subject', 'body', 'is_read', 'is_archived'];
  const newNotif = Object.fromEntries(
    Object.entries(edits).filter(
      ([key]) => props.includes(key)
    )
  );

  // update notif and return
  if (await verifyUser(userId, notifId)) return await prisma.policy_notifs.update({
    where: { notif_id: notifId },
    data: newNotif,
  });
  else return Promise.reject(new Error('Access forbidden'));
}

async function createClaim(userId: string, notifId: number, edits: object): Promise<claim_notifs> {
  // filter to only these properties
  const props = ['policy_holder', 'claimant', 'type', 'due_date', 'priority', 'is_completed', 'business', 'description'];
  const newNotif = Object.fromEntries(
    Object.entries(edits).filter(
      ([key]) => props.includes(key)
    )
  );

  // update notif and return
  if (await verifyUser(userId, notifId)) return await prisma.claim_notifs.update({
    where: { notif_id: notifId },
    data: newNotif,
  });
  else return Promise.reject(new Error('Access forbidden'));
}

async function createNews(userId: string, notifId: number, edits: object): Promise<news_notifs> {
  // filter to only these properties
  const props = ['title', 'type', 'created_on', 'expires_on'];
  const newNotif = Object.fromEntries(
    Object.entries(edits).filter(
      ([key]) => props.includes(key)
    )
  );

  // update notif and return
  if (await verifyUser(userId, notifId)) return await prisma.news_notifs.update({
    where: { notif_id: notifId },
    data: newNotif,
  });
  else return Promise.reject(new Error('Access forbidden'));
}

async function verifyUser(userId: string, notifId: number) {
  const record = await prisma.notifications.findUnique({
    where: { id: notifId, sender: userId },
  });
  return record !== null;
}