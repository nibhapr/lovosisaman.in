"use client";

import { useState, useEffect } from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Review } from '@/types/review';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

export default function EventPage({ params }: { params: { id: string } }) {
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
      const response = await fetch(`/api/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
        fetchReviews(data._id);
      }
    }
    fetchEvent();
  }, [params.id]);

  if (!event) return <div>Loading...</div>;

  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Date: {event.date}</p>
            <p className="font-semibold">Time: {event.time}</p>
          </div>
          <div>
            <p className="font-semibold">Location: {event.location}</p>
            <p className="font-semibold">Category: {event.category}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-8">
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
          itemId={event._id} 
          itemType="event" 
          onSubmitSuccess={() => fetchReviews(event._id)} 
        />
      </div>
    </div>
  );
} 