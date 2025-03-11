import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Blog from '@/app/models/Blog';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query = category ? { category } : {};
    const skip = (page - 1) * limit;

    const posts = await Blog.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Remove empty optional fields
    const blogData = {
      ...data,
      content: data.content || undefined,
      content2: data.content2 || undefined,
      content3: data.content3 || undefined,
      content4: data.content4 || undefined,
      image: data.image || undefined,
      image2: data.image2 || undefined,
      image3: data.image3 || undefined,
      youtubeUrl: data.youtubeUrl || undefined
    };

    const post = await Blog.create(blogData);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
} 