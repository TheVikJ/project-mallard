import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, first_name, last_name, password, usertype } = body;

    if (!username || !first_name || !last_name || !password || !usertype) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Validate usertype range
    if (![1, 2, 3, 4].includes(usertype)) {
      return NextResponse.json({ error: 'Invalid usertype' }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Create new user (no hashing as specified)
    const newUser = await prisma.user.create({
      data: {
        username,
        first_name,
        last_name,
        password,
        UserType: usertype,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
