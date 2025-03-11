"use client";

import { use } from 'react';
import { useState, useEffect } from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Review } from '@/types/review';
import EventDetail from '@/app/Components/events/EventDetail';
import type { Event } from '@/types/event';

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async (eventId: string) => {
    const response = await fetch(`/api/reviews?itemId=${eventId}&itemType=event`);
    if (response.ok) {
      const data = await response.json();
      setReviews(data);
    }
  };

  useEffect(() => {
    async function fetchEvent() {
      const response = await fetch(`/api/events/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
        fetchReviews(data._id);
      }
    }
    fetchEvent();
  }, [resolvedParams.id]);

  if (!event) return <div>Loading...</div>;

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <EventDetail event={event} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="flex items-center gap-2 mb-6">
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
              <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{review.name}</h3>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      star <= review.rating
                        ? <IoStar key={star} className="w-4 h-4 text-yellow-400" />
                        : <IoStarOutline key={star} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ReviewForm
          itemId={event._id}
          itemType="event"
          onSubmitSuccess={() => fetchReviews(event._id)}
        />
      </div>
    </div>
  );
} 