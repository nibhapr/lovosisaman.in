import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import File from '@/app/models/File';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const fileId = params.id;
    const file = await File.findById(fileId);
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Create a response with the file data
    const response = new NextResponse(file.data);
    
    // Set appropriate headers
    response.headers.set('Content-Type', file.contentType);
    response.headers.set('Content-Disposition', `inline; filename="${file.filename}"`);
    
    return response;
  } catch (error) {
    console.error('File retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
} 