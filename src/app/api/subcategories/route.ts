import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Subcategory from '@/app/models/Subcategory';

export async function GET() {
  try {
    await connectDB();
    const subcategories = await Subcategory.find({});
    
    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const subcategory = new Subcategory({
      ...data,
    });
    
    await subcategory.save();
    
    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
} 