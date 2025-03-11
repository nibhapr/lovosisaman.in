import { NextResponse } from 'next/server';
import { getBlogBySlug } from '@/lib/blog';
import { connectDB } from '@/lib/db';
import Blog from '@/app/models/Blog';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    console.log('Received update data:', data);
    
    // Handle all optional fields with explicit $set operator
    const updateData = {
      $set: {
        title: data.title,
        content: data.content,
        content2: data.content2,
        content3: data.content3,
        content4: data.content4,
        excerpt: data.excerpt,
        image: data.image,
        image2: data.image2,
        image3: data.image3,
        youtubeUrl: data.youtubeUrl,
        category: data.category,
        author: data.author,
        slug: data.slug
      }
    };
    
    console.log('Processing update for slug:', params.slug);
    console.log('Update data:', updateData);

    const post = await Blog.findOneAndUpdate(
      { slug: params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog post update error:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const post = await Blog.findOneAndDelete({ slug: params.slug }).exec();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog post deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 