import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
//Quick notes:
//Should the route parameter be the senderID? 


// Base notification type for common fields (sender and recipient overwritten in the function)
type BaseNotification = {
  is_active?: boolean;
};

// Specific payload types for each notification variant
type PolicyNotificationPayload = BaseNotification & {
  notificationType: 'policy';
  policy_id: number;
  subject: string;
  body: string;
  is_read: boolean;
  is_archived: boolean;
};

type ClaimNotificationPayload = BaseNotification & {
  notificationType: 'claim';
  policy_holder: string;
  claimant: string;
  claim_type: string;
  due_date: string; // string to be converted gitto Date
  business: string;
  description: string;
  priority: number;
  is_completed?: boolean;
};

type NewsNotificationPayload = BaseNotification & {
  notificationType: 'news';
  title: string;
  news_type: string;
  expires_on: string; // string to be converted to Date
};

// Union type covering all notification payloads
type NotificationPayload =
  | PolicyNotificationPayload
  | ClaimNotificationPayload
  | NewsNotificationPayload;

// Request body interface: includes an array of recipients and the notification data
interface MultiRecipientNotificationRequest {
  recipients: string[];
  notificationData: NotificationPayload;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // The sender id comes from the route parameter
  const { id: senderId } = await params;
  const body = await req.json() as MultiRecipientNotificationRequest;
  
// Ensure the request body contains the required fields
  if (!body.recipients || !Array.isArray(body.recipients) || body.recipients.length === 0) {
    return NextResponse.json(
      { error: 'Recipients array must be provided and contain at least one recipient' },
      { status: 400 }
    );
  }
  // Ensure the notification data contains a valid notificationType and has notificationData
  if (!body.notificationData || !body.notificationData.notificationType) {
    return NextResponse.json(
      { error: 'Notification data with a valid notificationType must be provided' },
      { status: 400 }
    );
  }
  
  try {
    // For each recipient, create a notification record with the sender set to senderId
    const createdNotifications = await Promise.all(
      body.recipients.map((recipientId) =>
        createPost({
          ...body.notificationData, // spread the notification data
          sender: senderId, // force sender and recipient from route param and array respectively
          recipient: recipientId, 
        } as NotificationPayload & { sender: string; recipient: string })
      )
    );
    return NextResponse.json(createdNotifications, { status: 200 });
  } catch (error) {
    console.error('Error creating notifications:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create notifications' },
      { status: 500 }
    );
  }
};

export const createPost = async function (payload: NotificationPayload & { sender: string; recipient: string }) {
  try {
    switch (payload.notificationType) {
      case 'policy':
        return await prisma.notifications.create({
          data: {
            sender: payload.sender,
            recipient: payload.recipient,
            is_active: payload.is_active ?? true,
            PolicyNotif: {
              create: {
                policy_id: payload.policy_id,
                subject: payload.subject,
                body: payload.body,
                is_read: payload.is_read,
                is_archived: payload.is_archived,
              },
            },
          },
        });
      case 'claim':
        return await prisma.notifications.create({
          data: {
            sender: payload.sender,
            recipient: payload.recipient,
            is_active: payload.is_active ?? true,
            ClaimNotif: {
              create: {
                policy_holder: payload.policy_holder,
                claimant: payload.claimant,
                type: payload.claim_type,
                due_date: new Date(payload.due_date), //handles typing right?
                business: payload.business,
                description: payload.description,
                priority: payload.priority,
                is_completed: payload.is_completed ?? false,
              },
            },
          },
        });
      case 'news':
        return await prisma.notifications.create({
          data: {
            sender: payload.sender,
            recipient: payload.recipient,
            is_active: payload.is_active ?? true,
            NewsNotif: {
              create: {
                title: payload.title,
                type: payload.news_type,
                expires_on: new Date(payload.expires_on), //handles typing right?
              },
            },
          },
        });
      default:
        throw new Error('Invalid notification type');
    }
  } catch (err: unknown) {
    const e = err as Error;
    console.error(e.stack);
    throw new Error(e.message);
  }
};


//Example call
//POST http://localhost:3000/api/notifications/add/123
//Body
// {
//"recipients": ["user456", "user789"],
// "notificationData": {
//   "notificationType": "policy",
//   "policy_id": 101,
//   "subject": "Policy Update",
//   "body": "Your policy details have been updated.",
//   "is_read": false,
//   "is_archived": false
// }
//}