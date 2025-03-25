import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Subcategory from '@/app/models/Subcategory';
import File from '@/app/models/File';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const subcategory = await Subcategory.findById(params.id);
    
    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(subcategory);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategory' },
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
    
    if (!data.name || !data.slug || !data.categoryId) {
      return NextResponse.json(
        { error: 'Name, slug, and categoryId are required' },
        { status: 400 }
      );
    }

    // Check if another subcategory with the same slug exists (excluding this one)
    const existingSubcategory = await Subcategory.findOne({
      slug: data.slug,
      _id: { $ne: params.id }
    });
    
    if (existingSubcategory) {
      return NextResponse.json(
        { error: 'Another subcategory with this slug already exists' },
        { status: 409 }
      );
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(subcategory);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update subcategory' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Find the subcategory first to get its image
    const subcategory = await Subcategory.findById(params.id);
    
    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }
    
    // Delete the subcategory
    await Subcategory.findByIdAndDelete(params.id);
    
    // If the subcategory has an image stored in MongoDB, delete it too
    if (subcategory.image && subcategory.image.startsWith('/api/files/')) {
      const fileId = subcategory.image.split('/').pop();
      if (fileId) {
        await File.findByIdAndDelete(fileId);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
} 