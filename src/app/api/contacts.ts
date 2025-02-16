import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const locations = await prisma.location.findMany({
      where: {
        userId: userId || undefined
      },
      include: {
        user: true
      }
    });

    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch locations" }, 
      { status: 500 }
    );
  }
}