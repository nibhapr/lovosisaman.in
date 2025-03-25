import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Event from '@/app/models/Event';
import Registration from '@/app/models/Registration';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    // First find the event by slug
    const event = await Event.findOne({ slug: params.slug });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Then find registrations for this event
    const registrations = await Registration.find({ eventId: event._id });
    
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const slug = params.slug;
    
    // Find the event by slug to get the ID
    const event = await Event.findOne({ slug });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Create registration with the event ID
    const registration = new Registration({
      ...data,
      eventId: event._id
    });
    
    await registration.save();
    
    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
} 