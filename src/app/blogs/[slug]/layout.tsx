import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${params.slug}`);
    const blog = await response.json();

    return {
      title: `${blog.title} | Lovosis Technologies Pvt Ltd | Blog`,
      description: blog.excerpt || 'Read our latest blog post at Lovosis Technologies',
      keywords: `${blog.title}, blog, technology, Lovosis Technologies`,
      openGraph: {
        title: `${blog.title} | Lovosis Technologies Pvt Ltd | Blog`,
        description: blog.excerpt || 'Read our latest blog post at Lovosis Technologies',
        type: 'article',
        url: `https://lovosis.in/blogs/${params.slug}`,
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: ['Lovosis Technologies'],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${blog.title} | Lovosis Technologies Pvt Ltd | Blog`,
        description: blog.excerpt || 'Read our latest blog post at Lovosis Technologies',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post | Lovosis Technologies Pvt Ltd',
      description: 'Read our latest blog post at Lovosis Technologies',
    };
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
