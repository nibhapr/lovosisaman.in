import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    const publicPath = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(publicPath, filename);

    await writeFile(filePath, buffer);
    
    // Return both local path and full URL
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN 
      ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
      : 'http://localhost:3000';

    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      fullUrl: `${baseUrl}/uploads/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
