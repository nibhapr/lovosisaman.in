import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/app/models/Product';
import File from '@/app/models/File';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Database error:', error);
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

    // Check if another product with the same slug exists (excluding this one)
    const existingProduct = await Product.findOne({
      slug: data.slug,
      _id: { $ne: params.id }
    });
    
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Another product with this slug already exists' },
        { status: 409 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Database error:', error);
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
    
    // Find the product first to get its images and PDF
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Delete the product
    await Product.findByIdAndDelete(params.id);
    
    // Delete associated files from MongoDB
    const filesToDelete = [];
    
    // Check for images
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image && image.startsWith('/api/files/')) {
          const fileId = image.split('/').pop();
          if (fileId) {
            filesToDelete.push(fileId);
          }
        }
      }
    }
    
    // Check for catalog PDF
    if (product.catalogPdf && product.catalogPdf.startsWith('/api/files/')) {
      const fileId = product.catalogPdf.split('/').pop();
      if (fileId) {
        filesToDelete.push(fileId);
      }
    }
    
    // Delete all associated files
    if (filesToDelete.length > 0) {
      await File.deleteMany({ _id: { $in: filesToDelete } });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 