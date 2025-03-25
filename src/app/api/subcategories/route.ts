import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Subcategory from '@/app/models/Subcategory';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get the categoryId from query params if it exists
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    let query = {};
    if (categoryId) {
      query = { categoryId };
    }
    
    const subcategories = await Subcategory.find(query).sort({ name: 1 });
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
    
    if (!data.name || !data.slug || !data.categoryId) {
      return NextResponse.json(
        { error: 'Name, slug, and categoryId are required' },
        { status: 400 }
      );
    }

    // Check if subcategory with the same slug already exists
    const existingSubcategory = await Subcategory.findOne({ slug: data.slug });
    if (existingSubcategory) {
      return NextResponse.json(
        { error: 'A subcategory with this slug already exists' },
        { status: 409 }
      );
    }

    const subcategory = new Subcategory(data);
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