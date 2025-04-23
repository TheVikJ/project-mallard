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
  const folder    = body.folder; // e.g. "inbox" | "archive" | undefined
  // Added into the following create notification calls
  
  try {
    let res: policy_notifs | claim_notifs | news_notifs;
    switch (body.type) {
      case 'policy':
        res = await createPolicy(senderId, body.recipient, body.data, {is_flagged, folder});
        break;
      case 'claim':
        res = await createClaim(senderId, body.recipient, body.data, {is_flagged, folder});
        break;
      case 'news':
        res = await createNews(senderId, body.recipient, body.data, {is_flagged, folder});
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

async function createPolicy(senderId: string, recipientId: string, data: policy_notifs, parentFields: {is_flagged: boolean; folder?: string}) {
  return await prisma.policy_notifs.create({
    data: {
      policy_id: data.policy_id,
      subject: data.subject,
      body: data.body,
      Notification: {
        create: {
          sender: senderId,
          recipient: recipientId,
          is_flagged: parentFields.is_flagged,
          folder: parentFields.folder,
        },
      },
    },
  });
}

async function createClaim(senderId: string, recipientId: string, data: claim_notifs, parentFields: {is_flagged: boolean; folder?: string}) {
  return await prisma.claim_notifs.create({
    data: {
      type: data.type,
      due_date: data.due_date,
      business: data.business,
      description: data.description,
      priority: data.priority,
      Notification: {
        create: {
          sender: senderId,
          recipient: recipientId,
          is_flagged: parentFields.is_flagged,
          folder: parentFields.folder,
        },
      },
      PolicyHolder: {
        connect: {
          username: data.policy_holder,
        },
      },
      Claimant: {
        connect: {
          username: data.claimant,
        },
      }
    },
  });
}     

async function createNews(senderId: string, recipientId: string, data: news_notifs, parentFields: {is_flagged: boolean; folder?: string}) {
  return await prisma.news_notifs.create({
    data: {
      title: data.title,
      type: data.type,
      created_on: data.created_on,
      expires_on: data.expires_on,
      Notification: {
        create: {
          sender: senderId,
          recipient: recipientId,
          is_flagged: parentFields.is_flagged,
          folder: parentFields.folder,
        },
      },
    },
  });
}
