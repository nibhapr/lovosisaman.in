import { getBlogPost } from '@/lib/blog';
import BlogPost from '@/app/Components/blog/BlogPost';

export default async function BlogSlugPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  return <BlogPost post={post} />;
} 