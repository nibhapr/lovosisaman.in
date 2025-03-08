"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { Review } from '@/types/review';

export default function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'blog' | 'event' | 'product'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete review');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = selectedType === 'all' 
    ? reviews 
    : reviews.filter(review => review.itemType === selectedType);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        star <= rating ? (
          <IoStar key={star} className="text-yellow-400 w-5 h-5" />
        ) : (
          <IoStarOutline key={star} className="text-yellow-400 w-5 h-5" />
        )
      ))}
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reviews Management</h2>
        <div className="flex gap-2">
          {['all', 'blog', 'event', 'product'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-4 py-2 rounded-lg ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{review.name}</h3>
                <p className="text-gray-600">{review.email}</p>
                <p className="text-gray-600">{review.phone}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 rounded-full text-sm capitalize bg-gray-100">
                  {review.itemType}
                </span>
                <StarRating rating={review.rating} />
              </div>
            </div>
            
            <p className="mt-4 text-gray-700">{review.comment}</p>
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDeleteReview(review._id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 