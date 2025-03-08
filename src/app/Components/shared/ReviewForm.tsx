'use client';

import { useState } from 'react';
import { IoStar, IoStarOutline } from 'react-icons/io5';

interface ReviewFormProps {
  itemId: string;
  itemType: 'blog' | 'event' | 'product';
  onSuccess?: () => void;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({ itemId, itemType, onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 0,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          itemId,
          itemType
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', rating: 0, comment: '' });
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">Write a Review</h3>
      
      {success ? (
        <div className="text-green-600">Thank you for your review!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className="text-2xl text-yellow-400"
                >
                  {star <= formData.rating ? <IoStar /> : <IoStarOutline />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              value={formData.comment}
              onChange={e => setFormData({...formData, comment: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              required
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  );
} 