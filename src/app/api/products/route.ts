import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/app/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');
    
    // Build query based on parameters
    let query: any = {};
    if (categoryId) query.categoryId = categoryId;
    if (subcategoryId) query.subcategoryId = subcategoryId;
    
    const products = await Product.find(query).sort({ name: 1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.name || !data.categoryId || !data.subcategoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Check if product with the same slug already exists
    const existingProduct = await Product.findOne({ slug: data.slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      );
    }

    const product = new Product(data);
    await product.save();
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 