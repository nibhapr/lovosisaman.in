import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import File from '@/app/models/File';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file found in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size);

    // Connect to MongoDB
    await connectDB();

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    
    // Determine content type
    const contentType = file.type;

    // Save file to MongoDB
    const fileDoc = await File.create({
      filename: filename,
      contentType: contentType,
      size: file.size,
      data: buffer,
      metadata: {
        originalName: file.name
      }
    });

    // Return the file ID as the URL
    const fileId = fileDoc._id.toString();
    
    // Return both MongoDB ID and a URL format that can be used to retrieve the file
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN 
      ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
      : 'http://localhost:3000';

    return NextResponse.json({ 
      url: `/api/files/${fileId}`,
      fileId: fileId,
      fullUrl: `${baseUrl}/api/files/${fileId}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
