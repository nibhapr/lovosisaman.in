import BlogCard from '../Components/blog/BlogCard';
import { getBlogPosts } from '@/lib/blog';
import Link from 'next/link';

const BLOG_CATEGORIES = [
  'Technology',
  'Innovation',
  'Education',
  'Manufacturing',
  'Digital Services'
];

export default async function BlogPage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  const posts = await getBlogPosts({ 
    category: searchParams.category 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Stay updated with the latest insights, trends, and news in technology and innovation.
          </p>

          {/* Categories Section */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link 
              href="/blogs"
              className={`px-4 py-2 rounded-full transition-colors ${
                !searchParams.category 
                  ? 'bg-blue-600 text-white'
                  : 'border border-blue-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              All
            </Link>
            {BLOG_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/blogs?category=${category}`}
                className={`px-4 py-2 rounded-full transition-colors ${
                  searchParams.category === category
                    ? 'bg-blue-600 text-white'
                    : 'border border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <BlogCard
              key={post._id}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              date={new Date(post.date).toLocaleDateString()}
              author={post.author}
              category={post.category}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 