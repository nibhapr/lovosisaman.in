import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Registration from '@/app/models/Registration';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.eventId || !data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const registration = await Registration.create(data);
    return NextResponse.json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const registrations = await Registration.find()
      .populate('eventId')
      .sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
} 