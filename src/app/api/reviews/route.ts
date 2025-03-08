import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/app/models/Review';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');
  const itemType = searchParams.get('itemType');

  try {
    await connectDB();
    const query = itemId && itemType ? { itemId, itemType } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const review = await Review.create(data);
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
} 