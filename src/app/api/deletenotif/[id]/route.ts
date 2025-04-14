import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string, notifId : string }> }) {
  const { userId, notifId } = await params;
  const _notifId = parseInt(notifId);

  if (!(await verifyUser(userId, _notifId))) {
    return NextResponse.json({ message: 'Access forbidden' }, { status: 403 });
  }

  try {
    // Soft delete by setting is_active to false
    const updatedNotification = await prisma.notifications.update({
      where: { id: _notifId },
      data: { is_active: false },
    });

    return NextResponse.json(
      { message: 'Delete successful', record: updatedNotification },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || 'Unexpected server error' },
      { status: 500 }
    );
  }
};

async function verifyUser(userId: string, notifId: number): Promise<boolean> {
  const record = await prisma.notifications.findUnique({
    where: { id: notifId },
  });
  return record?.sender === userId;
}

