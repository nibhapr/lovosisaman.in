import BlogCard from '../Components/blog/BlogCard';
import { getBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import { Metadata } from 'next';

const BLOG_CATEGORIES = [
  'Technology',
  'Innovation',
  'Education',
  'Manufacturing',
  'Digital Services'
];

export const metadata: Metadata = {
  title: "Our Blog - Latest Insights and Trends",
  description: "Stay updated with the latest insights, trends, and news in technology, innovation, and education.",
  keywords: "blog, technology, innovation, education, manufacturing, digital services, trends, insights",
  robots: {
    index: true,
    follow: true
  },
  authors: [{ name: "Lovosis Technologies" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Our Blog - Latest Insights and Trends",
    description: "Explore our blog for the latest insights and trends in technology and innovation.",
    url: "https://lovosis.com/blogs",
    images: [
      {
        url: "https://lovosis.com/blogs",
        width: 800,
        height: 600,
        alt: "Our Blog - Latest Insights and Trends"
      }
    ]
  }
};

export default async function BlogPage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  const posts = await getBlogPosts({ 
    category: searchParams.category 
  });

  return (
    <div className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Stay updated with the latest insights, trends, and news in technology and innovation.
          </p>

          {/* Categories Section */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link 
              href="/blogs"
              className={`px-4 py-2 rounded-full transition-colors ${
                !searchParams.category 
                  ? 'bg-blue-600 text-white'
                  : 'border border-zinc-800 text-gray-300 hover:border-zinc-700 hover:bg-zinc-900'
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
                    : 'border border-zinc-800 text-gray-300 hover:border-zinc-700 hover:bg-zinc-900'
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
              date={post.date}
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