import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/app/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ date: 1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.title || !data.description || !data.date || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Clean up optional fields
    const eventData = {
      ...data,
      content: data.content || undefined,
      content2: data.content2 || undefined,
      content3: data.content3 || undefined,
      image: data.image || undefined,
      image2: data.image2 || undefined,
      image3: data.image3 || undefined
    };

    const event = new Event(eventData);
    await event.save();
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 