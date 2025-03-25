import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductModel from '@/app/models/Product';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    await connectDB();
    const product = await ProductModel.findOne({ slug });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 