import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma, policy_notifs, claim_notifs, news_notifs } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: Promise<{ senderId: string }> }) {
  const { senderId } = await params;
  
  // check if request has body
  const body = await req.json();
  if (!body) return NextResponse.json({ message: 'Request must have a body' }, { status: 400 });

  // check if body has type, recipient, and data
  if (!body.type) return NextResponse.json({ message: 'Body must have property \'type\'' }, { status: 400 });
  if (!body.recipient) return NextResponse.json({ message: 'Body must have property \'recipient\'' }, { status: 400 });
  if (!body.data) return NextResponse.json({ message: 'Body must have property \'data\'' }, { status: 400 });
  
  //Attempt for including flagged and folder
  const is_flagged = body.is_flagged ?? false;
  const priority  = body.priority; // e.g. "2 - high" | "1 - medium" | "0 -low"
  const is_draft = body.is_draft ?? false;
  // Added into the following create notification calls
  
  try {
    let res: policy_notifs | claim_notifs | news_notifs;
    switch (body.type) {
      case 'policy':
        res = await createPolicy(senderId, body.recipient, body.data, is_flagged, priority, is_draft);
        break;
      case 'claim':
        res = await createClaim(senderId, body.recipient, body.data, is_flagged, priority, is_draft);
        break;
      case 'news':
        res = await createNews(senderId, body.recipient, body.data, is_flagged, priority, is_draft);
        break;
      default:
        return NextResponse.json({ message: 'Property \'type\' must be one of [\'policy\', \'claim\', \'news\']' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Creation successful', record: res }, { status: 200 });
  }
  catch (error) {
    if (error instanceof Error && error.message === 'Access forbidden') return NextResponse.json({ message: error.message }, { status: 403 });
    else if (error instanceof Prisma.PrismaClientKnownRequestError) return NextResponse.json({ message: `Request error: ${error.message}` }, { status: 400 });
    else if (error instanceof Prisma.PrismaClientValidationError) return NextResponse.json({ message: `Validation error: ${error.message}` }, { status: 400 });
    else return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 });
  }
};



async function createPolicy(
  senderId: string,
  recipientId: string,
  data: policy_notifs,
  is_flagged: boolean,
  priority?: number, 
  is_draft?: boolean
) {
  //0) realign notifications.id 
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('notifications','id'),
      (SELECT COALESCE(MAX(id), 0) FROM notifications),
      true
    );
  `;

  //1) create a new notification 
  const notif = await prisma.notifications.create({
    data: { sender: senderId, recipient: recipientId, is_flagged, priority, is_draft }
  });

  //2) realign policy_notifs.id 
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('policy_notifs','id'),
      (SELECT COALESCE(MAX(id), 0) FROM policy_notifs),
      true
    );
  `;

  //3) create the linked policy_notif
  return prisma.policy_notifs.create({
    data: {
      notif_id:  notif.id,
      policy_id: data.policy_id,
      subject:   data.subject,
      body:      data.body
    }
  });
}


async function createClaim(
  senderId: string,
  recipientId: string,
  data: claim_notifs,
  is_flagged: boolean,
  priority?: number,
  is_draft?: boolean
) {
  // 0) realign notifications.seq
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('notifications','id'),
      (SELECT COALESCE(MAX(id),0) FROM notifications),
      true
    );
  `;

  // 1) create the Notification row
  const notif = await prisma.notifications.create({
    data: {
      sender:     senderId,
      recipient:  recipientId,
      is_flagged,
      priority,
      is_draft
    }
  });

  // 2) realign claim_notifs.seq
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('claim_notifs','id'),
      (SELECT COALESCE(MAX(id),0) FROM claim_notifs),
      true
    );
  `;

  // 3) insert into claim_notifs using the scalar FKs
  return prisma.claim_notifs.create({
    data: {
      notif_id:      notif.id,
      policy_holder: data.policy_holder,  // scalar FK
      claimant:      data.claimant,       // scalar FK
      type:          data.type,
      due_date:      data.due_date,
      business:      data.business,
      description:   data.description,
    }
  });
}


async function createNews(
  senderId: string,
  recipientId: string,
  data: news_notifs,
  is_flagged: boolean,
  priority?: number,
  is_draft?: boolean
) {
  // 0) realign notifications.id sequence
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('notifications','id'),
      (SELECT COALESCE(MAX(id),0) FROM notifications),
      true
    );
  `;

  // 1) insert into notifications
  const notif = await prisma.notifications.create({
    data: {
      sender:     senderId,
      recipient:  recipientId,
      is_flagged,
      priority,
      is_draft
    }
  });

  // 2) realign news_notifs.id sequence
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('news_notifs','id'),
      (SELECT COALESCE(MAX(id),0) FROM news_notifs),
      true
    );
  `;

  // 3) insert into news_notifs using scalar fields (no nested connect for main notification type in the subtype)
  return prisma.news_notifs.create({
    data: {
      notif_id:    notif.id,        // FK back to notifications
      title:       data.title,
      body:        data.body,       
      type:        data.type,
      created_on:  data.created_on,
      expires_on:  data.expires_on,
    }
  });
}


