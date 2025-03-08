"use client";

import { getBlogPost } from '@/lib/blog';
import BlogPost from '@/app/Components/blog/BlogPost';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import { useState, useEffect } from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import type { Review } from '@/types/review';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export default function BlogSlugPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchData() {
      const postData = await getBlogPost(params.slug);
      setPost(postData);

      if (postData?._id) {
        const response = await fetch(`/api/reviews?itemId=${postData._id}&itemType=blog`);
        if (response.ok) {
          const reviewsData = await response.json();
          setReviews(reviewsData);
        }
      }
    }
    fetchData();
  }, [params.slug]);

  if (!post) {
    return <div>Post not found</div>;
  }

  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BlogPost post={post} />
      
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
          itemId={post._id} 
          itemType="blog" 
          onSubmitSuccess={async () => {
            const response = await fetch(`/api/reviews?itemId=${post._id}&itemType=blog`);
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