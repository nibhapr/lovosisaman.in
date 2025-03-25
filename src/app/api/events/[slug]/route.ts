import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/app/models/Event';
import File from '@/app/models/File';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const event = await Event.findOne({ slug: params.slug });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.title || !data.description || !data.date || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug if title changed
    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const event = await Event.findOneAndUpdate(
      { slug: params.slug },
      data,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    // Find the event first to get its images
    const event = await Event.findOne({ slug: params.slug });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Delete the event
    await Event.findOneAndDelete({ slug: params.slug });
    
    // Delete associated images from MongoDB
    const imagesToDelete = [event.image, event.image2, event.image3].filter(img => img?.startsWith('/api/files/'));
    
    for (const imageUrl of imagesToDelete) {
      if (imageUrl) {
        const fileId = imageUrl.split('/').pop();
        if (fileId) {
          await File.findByIdAndDelete(fileId);
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 