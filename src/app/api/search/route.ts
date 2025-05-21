import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import NavbarCategory from '@/app/models/NavbarCategory';
import Category from '@/app/models/Category';
import Subcategory from '@/app/models/Subcategory';
import Product from '@/app/models/Product';
import Blog from '@/app/models/Blog';
import Event from '@/app/models/Event';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const searchRegex = new RegExp(query, 'i');

    // Search across all collections in parallel
    const [
      navbarCategories,
      categories,
      subcategories,
      products,
      blogs,
      events
    ] = await Promise.all([
      NavbarCategory.find({ name: searchRegex }).limit(5),
      Category.find({ name: searchRegex }).limit(5),
      Subcategory.find({ name: searchRegex }).limit(5),
      Product.find({ name: searchRegex }).limit(5),
      Blog.find({ 
        $or: [
          { title: searchRegex },
          { content: searchRegex }
        ]
      }).limit(5),
      Event.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).limit(5)
    ]);

    // Format and combine results
    const results = [
      ...navbarCategories.map(nc => ({
        title: nc.name,
        url: `/products/${nc.slug}`,
        type: 'Product Group'
      })),
      ...categories.map(c => ({
        title: c.name,
        url: `/products/${c.navbarCategoryId}/${c.slug}`,
        type: 'Category'
      })),
      ...subcategories.map(sc => ({
        title: sc.name,
        url: `/products/${sc.categoryId}/${sc.slug}`,
        type: 'Subcategory'
      })),
      ...products.map(p => ({
        title: p.name,
        url: `/products/${p.navbarCategoryId}/${p.categoryId}/${p.subcategoryId || 'no-subcategory'}/${p.slug}`,
        type: 'Product'
      })),
      ...blogs.map(b => ({
        title: b.title,
        url: `/blogs/${b.slug}`,
        type: 'Blog'
      })),
      ...events.map(e => ({
        title: e.title,
        url: `/events/${e.slug}`,
        type: 'Event'
      }))
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}