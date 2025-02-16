import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const metadata = JSON.parse(formData.get('metadata') as string);
    
    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Upload video to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
      folder: `videos/${metadata.category}`,
    });

    // Save metadata to MongoDB
    const client = await clientPromise;
    const db = client.db('your-database-name');
    await db.collection('videos').insertOne({
      ...metadata,
      videoUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true, videoUrl: uploadResult.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading video' },
      { status: 500 }
    );
  }
}