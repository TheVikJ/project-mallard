import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return NextResponse.json(
    { id: id },
    { status: 200 }
  );
};
