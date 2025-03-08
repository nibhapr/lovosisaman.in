import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Registration from '@/app/models/Registration';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const registrations = await Registration.find({ eventId: params.id })
      .sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const eventId = await params.id;
    
    const registration = await Registration.create({
      ...data,
      eventId
    });
    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 });
  }
} 