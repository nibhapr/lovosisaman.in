import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Gallery from '@/app/models/Gallery';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const images = await Gallery.find(query).sort({ date: -1 });
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const gallery = await Gallery.create(data);
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Gallery creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;
    
    const gallery = await Gallery.findByIdAndUpdate(_id, updateData, { new: true });
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

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Gallery deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
} 