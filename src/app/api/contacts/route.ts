import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

async function connectDB() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'chatapp');
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function GET(req: Request) {
  let client;

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { db } = await connectDB();
    const contacts = await db.collection('contacts').find({ userId }).toArray();

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('GET contacts error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  let client;

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, email, phoneNumber } = body;

    if (!name || !email) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const { db } = await connectDB();
    const contact = {
      id: crypto.randomUUID(),
      userId,
      name,
      email,
      phoneNumber,
      avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${email}`,
      online: false,
      createdAt: new Date(),
    };

    await db.collection('contacts').insertOne(contact);

    return NextResponse.json(contact);
  } catch (error) {
    console.error('POST contact error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500 }
    );
  }
}