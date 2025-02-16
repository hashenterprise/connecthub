// api/test-db/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Test the connection by getting server info
    const serverInfo = await db.command({ serverStatus: 1 });
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      version: serverInfo.version,
      uptime: serverInfo.uptime
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}