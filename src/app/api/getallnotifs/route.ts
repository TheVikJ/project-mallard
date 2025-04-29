import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma, policy_notifs, claim_notifs, news_notifs, notifications } from '@prisma/client';

import { Message, Filters } from '../../../utils/types';

export async function POST(req: NextRequest) {

  // get request body
  const body = await req.json();

  // check that body is a Filter
  const isFilter = (body: unknown): body is Filters => {
    if (typeof body !== 'object' || body === null) throw new Error('Invalid body');

    // get keys of body
    const allowedKeys = ['type', 'sender', 'recipient', 'priority', 'isFlagged', 'isDraft'];
    const keys = Object.keys(body);

    // check that the body's keys are only those in allowedKeys
    if (!keys.every(key => allowedKeys.includes(key))) throw new Error('Invalid filters in body');

    // check key types
    if ('type' in body && typeof body.type !== 'string') throw new Error('\'type\' must be of type string');
    if ('sender' in body && typeof body.sender !== 'string') throw new Error('\'sender\' must be of type string');
    if ('recipient' in body && typeof body.recipient !== 'string') throw new Error('\'recipient\' must be of type string');
    if ('priority' in body && typeof body.priority !== 'number') throw new Error('\'priority\' must be of type number');
    if ('isFlagged' in body && typeof body.isFlagged !== 'boolean') throw new Error('\'isFlagged\' must be of type boolean');
    if ('isDraft' in body && typeof body.isDraft !== 'boolean') throw new Error('\'isDraft\' must be of type boolean');

    return true;
  };

  try {
    isFilter(body);
  }
  catch (error: unknown) {
    // catch errors thrown in isFilter()
    if (error instanceof Error) return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
    else return NextResponse.json(
      { message: 'Unexpected server error occurred' },
      { status: 500 }
    );
  }

  try {
    let res: Message[];

    // format filters
    const { type, isFlagged, isDraft, ..._filters} = body;
    const filters = { is_flagged: isFlagged, is_draft: isDraft, ..._filters };

    // based on type, get notifications
    if (type === undefined) res = await getAll(filters);
    else {
      switch (type) {
        case 'policy':
          res = await getPolicies(filters);
          break;
        case 'claim':
          res = await getClaims(filters);
          break;
        case 'news':
          res = await getNews(filters);
          break;
        default:
          // handle invalid type property
          return NextResponse.json(
            { message: 'Property \'type\' must be one of [\'policy\', \'claim\', \'news\']' },
            { status: 400 }
          );
      }
    }

    // send response
    return NextResponse.json(
      res,
      { status: 200 },
    );
  }
  catch (error: unknown) {
    // catch errors relating to invalid database queries
    if (error instanceof Error && error.message === 'Access forbidden') return NextResponse.json({ message: error.message }, { status: 403 });
    else if (error instanceof Prisma.PrismaClientKnownRequestError) return NextResponse.json({ message: `Request error: ${error.message}` }, { status: 400 });
    else if (error instanceof Prisma.PrismaClientValidationError) return NextResponse.json({ message: `Validation error: ${error.message}` }, { status: 400 });
    else return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 });
  }
};

async function getPolicies(filters: Filters): Promise<Message[]> {
  // query database for notifications
  const notifs: (policy_notifs & { Notification: notifications })[] = await prisma.policy_notifs.findMany({
    where: {
      Notification: {
        ...filters,
        is_active: true
      },
    },
    include: { Notification: true },
  });

  // create Message objects
  const messages: Message[] = notifs.map((notif: policy_notifs & { Notification: notifications }): Message => ({
    id: notif.notif_id,
    sender: notif.Notification.sender,
    recipient: notif.Notification.recipient,
    type: 'policy',
    subject: notif.subject,
    body: notif.body,
    priority: notif.Notification.priority,
    is_read: notif.Notification.is_read,
    is_flagged: notif.Notification.is_flagged,
    timestamp: notif.Notification.created_at,
  }));

  return messages;
}

async function getClaims(filters: Filters): Promise<Message[]> {
  const notifs: (claim_notifs & { Notification: notifications })[] = await prisma.claim_notifs.findMany({
    where: {
      Notification: {
        ...filters,
        is_active: true
      },
    },
    include: { Notification: true },
  });

  const messages: Message[] = notifs.map((notif: claim_notifs & { Notification: notifications }): Message => ({
    id: notif.notif_id,
    sender: notif.Notification.sender,
    recipient: notif.Notification.recipient,
    type: 'claim',
    subject: notif.business,
    body: notif.description,
    priority: notif.Notification.priority,
    is_read: notif.Notification.is_read,
    is_flagged: notif.Notification.is_flagged,
    timestamp: notif.Notification.created_at,
  }));

  return messages;
}     

async function getNews(filters: Filters): Promise<Message[]> {
  const notifs: (news_notifs & { Notification: notifications })[] = await prisma.news_notifs.findMany({
    where: {
      Notification: {
        ...filters,
        is_active: true
      },
    },
    include: { Notification: true },
  });

  const messages: Message[] = notifs.map((notif: news_notifs & { Notification: notifications }): Message => ({
    id: notif.notif_id,
    sender: notif.Notification.sender,
    recipient: notif.Notification.recipient,
    type: 'news',
    subject: notif.title,
    body: notif.body,
    priority: notif.Notification.priority,
    is_read: notif.Notification.is_read,
    is_flagged: notif.Notification.is_flagged,
    timestamp: notif.Notification.created_at,
  }));

  return messages;
}

async function getAll(filters: Filters): Promise<Message[]> {
  // query policies, claims, and news independently, and then assemble into list
  return [...(await getPolicies(filters)), ...(await getClaims(filters)), ...(await getNews(filters))];
}
