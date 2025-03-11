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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Main Image */}
        {event.image && (
          <div className="relative h-96 w-full">
            <Image src={event.image} alt={event.title} fill className="object-cover" />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

          {/* Status and Date */}
          <div className="flex items-center space-x-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
              }`}>
              {event.status}
            </span>
            <span className="text-gray-600">
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </span>
          </div>

          {/* Content Sections */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700">{event.description}</p>

            {event.content && (
              <div className="mt-6">
                <p className="text-gray-700">{event.content}</p>
              </div>
            )}

            {event.content2 && (
              <div className="mt-6">
                <p className="text-gray-700">{event.content2}</p>
              </div>
            )}

            {event.content3 && (
              <div className="mt-6">
                <p className="text-gray-700">{event.content3}</p>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {event.image2 && (
              <div className="relative h-48 w-full">
                <Image src={event.image2} alt={`${event.title} - Image 2`} fill className="object-cover rounded-lg" />
              </div>
            )}
            {event.image3 && (
              <div className="relative h-48 w-full">
                <Image src={event.image3} alt={`${event.title} - Image 3`} fill className="object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Location:</span>
                <span className="ml-2 text-gray-600">{event.location}</span>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Time:</span>
                <span className="ml-2 text-gray-600">{event.time}</span>
              </div>
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
        </div>
      </div>

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