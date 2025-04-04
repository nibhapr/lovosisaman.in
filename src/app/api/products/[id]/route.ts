import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/app/models/Product';
import mongoose from 'mongoose';
import NavbarCategory from '@/app/models/NavbarCategory';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).populate('navbarCategoryId');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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

    // Validate navbarCategoryId if it's being updated
    if (data.navbarCategoryId && !mongoose.Types.ObjectId.isValid(data.navbarCategoryId)) {
      return NextResponse.json(
        { error: 'Invalid navbarCategoryId' },
        { status: 400 }
      );
    }

    // Optional validation for categoryId if it's being updated
    if (data.categoryId && !mongoose.Types.ObjectId.isValid(data.categoryId)) {
      return NextResponse.json(
        { error: 'Invalid categoryId' },
        { status: 400 }
      );
    }

    // Optional validation for subcategoryId if it's being updated
    if (data.subcategoryId && !mongoose.Types.ObjectId.isValid(data.subcategoryId)) {
      return NextResponse.json(
        { error: 'Invalid subcategoryId' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
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
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 