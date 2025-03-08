import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/app/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const event = await Event.create(data);
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
} 