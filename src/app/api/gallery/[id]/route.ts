import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Gallery from '@/app/models/Gallery';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    const gallery = await Gallery.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Gallery update error:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const gallery = await Gallery.findByIdAndDelete(params.id);
    
    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
} 