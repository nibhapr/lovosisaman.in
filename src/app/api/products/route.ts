import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/app/models/Product';
import mongoose from 'mongoose';
import NavbarCategory from '@/app/models/NavbarCategory';
import Category from '@/app/models/Category';
import Subcategory from '@/app/models/Subcategory';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).populate('navbarCategoryId');
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  console.log('Received body for POST:', body);

  // Validate navbarCategoryId
  if (!body.navbarCategoryId || !mongoose.Types.ObjectId.isValid(body.navbarCategoryId)) {
    return NextResponse.json(
      { error: 'Valid navbarCategoryId is required' },
      { status: 400 }
    );
  }

  // Check if navbar category exists
  const navbarCategory = await NavbarCategory.findById(body.navbarCategoryId);
  if (!navbarCategory) {
    return NextResponse.json(
      { error: 'Navbar category not found' },
      { status: 404 }
    );
  }

  // Optional validation for categoryId if provided
  if (body.categoryId) {
    if (!mongoose.Types.ObjectId.isValid(body.categoryId)) {
      return NextResponse.json(
        { error: 'Invalid categoryId' },
        { status: 400 }
      );
    }
    const category = await Category.findById(body.categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
  }

  // Optional validation for subcategoryId if provided
  if (body.subcategoryId) {
    if (!mongoose.Types.ObjectId.isValid(body.subcategoryId)) {
      return NextResponse.json(
        { error: 'Invalid subcategoryId' },
        { status: 400 }
      );
    }
    const subcategory = await Subcategory.findById(body.subcategoryId);
    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }
  }

  try {
    const product = await Product.create(body);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await connectDB();
  const { _id, ...data } = await request.json();
  console.log('Received body for PUT:', { _id, data });

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

  const product = await Product.findByIdAndUpdate(_id, data, { new: true });
  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  await connectDB();
  const { _id } = await request.json();
  await Product.findByIdAndDelete(_id);
  return NextResponse.json({ message: 'Product deleted successfully' });
} 