"use client";

import { use } from 'react';
import { useState, useEffect } from 'react';
import { IoStar, IoStarOutline, IoClose } from 'react-icons/io5';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Review } from '@/types/review';
import EventDetail from '@/app/Components/events/EventDetail';
import type { Event } from '@/types/event';

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(1);

  const fetchReviews = async (eventId: string) => {
    const response = await fetch(`/api/reviews?itemId=${eventId}&itemType=event`);
    if (response.ok) {
      const data = await response.json();
      setReviews(data);
    }
  };

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`/api/events/${resolvedParams.slug}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
        fetchReviews(data._id);
      }
    }
    fetchEvent();
  }, [resolvedParams.slug]);

  if (!event) return <div>Loading...</div>;

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const showMoreReviews = () => {
    setVisibleReviews(reviews.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <EventDetail event={event} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <button
          onClick={() => setIsReviewsOpen(true)}
          className="flex flex-col sm:flex-row items-center justify-between bg-white p-8 rounded-xl shadow-sm hover:bg-gray-50 transition-colors w-full border border-gray-100 gap-4"
        >
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Reviews</h2>
            <p className="text-gray-500">Share your thoughts about this event</p>
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
              <span className="text-lg font-medium text-gray-900">({reviews.length})</span>
            </div>
            <div className="text-sm text-gray-500">
              {averageRating.toFixed(1)} out of 5
            </div>
          </div>
        </button>

        {isReviewsOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-all duration-300" />

            <div className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
              <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl animate-modalSlideIn max-h-[calc(100vh-120px)] flex flex-col">
                <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between z-10 rounded-t-xl">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Reviews</h2>
                    <p className="text-sm text-gray-500 mt-1">Share your experience with others</p>
                  </div>
                  <button
                    onClick={() => setIsReviewsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <IoClose className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6 mb-8">
                    {reviews.length > 0 ? (
                      <>
                        {reviews.slice(0, visibleReviews).map((review, index) => (
                          <div key={review._id} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
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

                        {reviews.length > 1 && (
                          <button
                            onClick={() => setVisibleReviews(visibleReviews === 1 ? reviews.length : 1)}
                            className="w-full text-blue-600 hover:text-blue-700 font-medium py-3 flex items-center justify-center gap-2"
                          >
                            {visibleReviews === 1 ? (
                              <>
                                Show {reviews.length - 1} More Reviews
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </>
                            ) : (
                              <>
                                Show Less
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </>
                            )}
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="text-gray-400 mb-3">
                          <svg className="w-12 h-12 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">No reviews yet.</p>
                        <p className="text-gray-400 text-sm">Be the first to review this event!</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <ReviewForm
                      itemId={event._id}
                      itemType="event"
                      onSubmitSuccess={() => fetchReviews(event._id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 