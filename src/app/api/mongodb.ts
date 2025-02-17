import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

async function connectDB() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'chatapp');
    return { client, db };
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw new Error('Failed to connect to database');
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { db } = await connectDB();
    const contacts = await db.collection('contacts').find({ userId }).toArray();

    return NextResponse.json(contacts);
  } catch (err) {
    console.error('GET contacts error:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
  } catch (err) {
    console.error('POST contact error:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { status: 500 }
    );
  }
}