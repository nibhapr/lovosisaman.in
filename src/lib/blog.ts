import { connectDB } from './db';
import Blog from '@/app/models/Blog';

export async function getBlogPosts(options: { category?: string } = {}) {
  await connectDB();
  const query = options.category ? { category: options.category } : {};
  const posts = await Blog.find(query).sort({ date: -1 });
  return JSON.parse(JSON.stringify(posts));
}

export async function getBlogPost(slug: string) {
  await connectDB();
  const post = await Blog.findOne({ slug });
  return post ? JSON.parse(JSON.stringify(post)) : null;
} 