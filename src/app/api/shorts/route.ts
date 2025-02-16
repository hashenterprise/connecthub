import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, videoUrl, userId } = body;

    const short = await prisma.short.create({
      data: {
        title,
        description,
        videoUrl,
        userId
      }
    });

    return NextResponse.json(short);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create short" }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const shorts = await prisma.short.findMany({
      include: {
        user: true,
        likes: true,
        comments: true
      }
    });

    return NextResponse.json(shorts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch shorts" }, 
      { status: 500 }
    );
  }
}