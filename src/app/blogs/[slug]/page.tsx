"use client";

import { useEffect, useState, use } from 'react';
import { BlogPost } from '@/types/blog';
import BlogPostComponent from '@/app/Components/blog/BlogPost';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import { IoStar, IoStarOutline, IoClose } from 'react-icons/io5';
import type { Review } from '@/types/review';

export default function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog data
        const blogResponse = await fetch(`/api/blog/${resolvedParams.slug}`);
        if (!blogResponse.ok) {
          throw new Error('Failed to fetch blog');
        }
        const blogData = await blogResponse.json();
        setBlog(blogData);

        // Fetch reviews if blog data is available
        if (blogData?._id) {
          const reviewsResponse = await fetch(
            `/api/reviews?itemId=${blogData._id}&itemType=blog`
          );
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch blog');
      }
    };

    fetchData();
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (isReviewsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReviewsOpen]);

  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Loading...</div>;

  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-black min-h-screen">
      <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-8 mb-12">
        <BlogPostComponent post={blog} />
      </div>

      <button 
        onClick={() => setIsReviewsOpen(true)}
        className="flex flex-col sm:flex-row items-center justify-between bg-zinc-900 p-8 rounded-xl shadow-lg hover:bg-zinc-800 transition-colors w-full border border-zinc-800 gap-4"
      >
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">Reader Reviews</h2>
          <p className="text-gray-400">Share your thoughts about this article</p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                star <= Math.round(averageRating) 
                  ? <IoStar key={star} className="w-6 h-6 text-yellow-400" />
                  : <IoStarOutline key={star} className="w-6 h-6 text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-300">({reviews.length})</span>
          </div>
          <div className="text-sm text-gray-400">
            {averageRating.toFixed(1)} out of 5
          </div>
        </div>
      </button>

      {isReviewsOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-all duration-300" />
          
          <div className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
            <div className="bg-zinc-900 rounded-xl max-w-3xl w-full shadow-2xl animate-modalSlideIn max-h-[calc(100vh-120px)] flex flex-col border border-zinc-800">
              <div className="sticky top-0 bg-zinc-900 p-6 border-b border-zinc-800 flex items-center justify-between z-10 rounded-t-xl">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Reader Reviews</h2>
                  <p className="text-sm text-gray-400 mt-1">Share your thoughts with others</p>
                </div>
                <button 
                  onClick={() => setIsReviewsOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-gray-400 hover:text-gray-300"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6 mb-8">
                  {reviews.length > 0 ? (
                    <>
                      <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-900/50 rounded-full w-12 h-12 flex items-center justify-center">
                              <span className="text-blue-400 font-semibold text-lg">
                                {reviews[0].name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-200 text-lg">{reviews[0].name}</h3>
                              <p className="text-sm text-gray-400">
                                {new Date(reviews[0].createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-lg">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                star <= reviews[0].rating 
                                  ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                                  : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-300 ml-2">
                              {reviews[0].rating}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed bg-zinc-900/50 p-4 rounded-lg">{reviews[0].comment}</p>
                      </div>

                      {reviews.length > 1 && (
                        <button
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-sm"
                        >
                          {showAllReviews ? (
                            <>
                              Show Less
                              <svg className="w-4 h-4 transition-transform duration-300 -rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              Show {reviews.length - 1} More {reviews.length - 1 === 1 ? 'Review' : 'Reviews'}
                              <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>
                      )}

                      {showAllReviews && (
                        <div className="space-y-4 animate-fadeIn">
                          {reviews.slice(1).map((review) => (
                            <div 
                              key={review._id} 
                              className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-lg">
                                      {review.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{review.name}</h3>
                                    <p className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      star <= review.rating 
                                        ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                                        : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 ml-2">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 bg-zinc-800/50 rounded-xl">
                      <div className="text-gray-400 mb-3">
                        <svg className="w-12 h-12 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-300 font-medium">No reviews yet.</p>
                      <p className="text-gray-400 text-sm">Be the first to review this article!</p>
                    </div>
                  )}
                </div>

                {blog._id && (
                  <div className="border-t border-zinc-800 pt-6">
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
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}