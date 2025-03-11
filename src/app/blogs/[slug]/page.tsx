"use client";

import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/blog';
import BlogPostComponent from '@/app/Components/blog/BlogPost';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { use } from 'react';
import type { Review } from '@/types/review';

export default function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${resolvedParams.slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlog(data);

        if (data?._id) {
          const reviewsResponse = await fetch(`/api/reviews?itemId=${data._id}&itemType=blog`);
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch blog');
      }
    };

    fetchBlog();
  }, [resolvedParams.slug]);

  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Loading...</div>;

  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BlogPostComponent post={blog} />
      
      <div className="mt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                star <= Math.round(averageRating) 
                  ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                  : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{review.name}</h3>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      star <= review.rating 
                        ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                        : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ReviewForm 
          itemId={blog._id} 
          itemType="blog" 
          onSubmitSuccess={async () => {
            const response = await fetch(`/api/reviews?itemId=${blog._id}&itemType=blog`);
            if (response.ok) {
              const newReviews = await response.json();
              setReviews(newReviews);
            }
          }} 
        />
      </div>
    </div>
  );
} 