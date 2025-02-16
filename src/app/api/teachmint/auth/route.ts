import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { userId } = getAuth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    
    // Call Teachmint's API to either sign in or create account
    const teachmintResponse = await fetch('https://api.teachmint.com/auth/sso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TEACHMINT_API_KEY}`,
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + ' ' + user.lastName,
      }),
    });

    if (!teachmintResponse.ok) {
      return new NextResponse('Failed to authenticate with Teachmint', { status: 500 });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}