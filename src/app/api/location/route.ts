import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { latitude, longitude, userId } = body;

    const location = await prisma.location.create({
      data: {
        latitude,
        longitude,
        userId
      }
    });

    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update location" }, 
      { status: 500 }
    );
  }
}

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
