"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Event } from '@/types/event';
import RegistrationModal from '@/app/Components/events/RegistrationModal';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <Link href={`/events/${event._id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-500">
            <span className="font-medium">Date:</span>
            <span className="ml-2">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <span className="font-medium">Time:</span>
            <span className="ml-2">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <span className="font-medium">Location:</span>
            <span className="ml-2">{event.location}</span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          disabled={event.status === 'completed'}
        >
          {event.status === 'completed' ? 'Event Completed' : 'Register Now'}
        </button>
      </div>

      {showModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
} 