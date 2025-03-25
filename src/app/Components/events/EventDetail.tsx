"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Event } from '@/types/event';
import RegistrationModal from './RegistrationModal';

interface EventDetailProps {
  event: Event;
}

export default function EventDetail({ event }: EventDetailProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const images = [
    event.image,
    event.image2,
    event.image3
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>
      
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative h-64 w-full">
            <Image
              src={imageUrl}
              alt={`${event.title} - Image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              unoptimized={imageUrl.startsWith('/api/files/')}
            />
          </div>
        ))}
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <p className="text-gray-600">{event.description}</p>
        {event.content && <p className="text-gray-800">{event.content}</p>}
        {event.content2 && <p className="text-gray-800">{event.content2}</p>}
        {event.content3 && <p className="text-gray-800">{event.content3}</p>}
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Status:</strong> {event.status}</p>
        </div>
      </div>

      {/* Registration Button */}
      {event.status !== 'completed' && (
        <button
          onClick={() => setShowRegistrationModal(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Register for Event
        </button>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowRegistrationModal(false)}
        />
      )}
    </div>
  );
} 