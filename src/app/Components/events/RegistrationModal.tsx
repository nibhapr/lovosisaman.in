"use client";

import { useState } from 'react';

interface RegistrationModalProps {
  event: {
    _id: string;
    title: string;
    slug: string;
  };
  onClose: () => void;
}

export default function RegistrationModal({ event, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch(`/api/events/${event.slug}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Registration failed');
      
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-zinc-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Register for {event.title}
        </h2>
        
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="mb-4 text-green-400">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-medium text-white">Registration Successful!</p>
            <p className="text-gray-400 mt-2">Thank you for registering.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                required
                disabled={status === 'loading'}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                required
                disabled={status === 'loading'}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                required
                disabled={status === 'loading'}
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 flex-1 transition-all duration-300 ${
                  status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Registering...' : 'Register'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition-colors"
                disabled={status === 'loading'}
              >
                Cancel
              </button>
            </div>
            
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">
                Registration failed. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}