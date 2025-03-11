import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/app/models/Event';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Include optional fields in response
    const eventData = {
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      content: event.content || undefined,
      content2: event.content2 || undefined,
      content3: event.content3 || undefined,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image || undefined,
      image2: event.image2 || undefined,
      image3: event.image3 || undefined,
      status: event.status,
      category: event.category,
      slug: event.slug
    };

    return NextResponse.json(eventData);
  } catch (error) {
    console.error('Event fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Handle optional fields
    const eventData = {
      ...data,
      content: data.content || undefined,
      content2: data.content2 || undefined,
      content3: data.content3 || undefined,
      image: data.image || undefined,
      image2: data.image2 || undefined,
      image3: data.image3 || undefined
    };
    
    const event = await Event.findByIdAndUpdate(
      params.id,
      eventData,
      { new: true }
    );
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Event.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 