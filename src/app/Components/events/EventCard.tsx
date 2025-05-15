"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Event } from '@/types/event';
import RegistrationModal from '@/app/Components/events/RegistrationModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/events/${event.slug}`);
  };

  const imageUrl = event.image?.startsWith('/api/files/') 
    ? event.image 
    : event.image || '/images/placeholder.jpg';

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow border border-gray-200"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-contain"
          unoptimized={imageUrl.startsWith('/api/files/')}
        />
      </div>
      <div className="p-6">
        <Link href={`/events/${event.slug}`}>
          <h3 className="text-xl font-semibold mb-2 text-black hover:text-gray-700 transition-all">
            {event.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <span className="font-medium text-gray-800">Date:</span>
            <span className="ml-2">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="font-medium text-gray-800">Time:</span>
            <span className="ml-2">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="font-medium text-gray-800">Location:</span>
            <span className="ml-2">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-300">
            {event.category}
          </span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            event.status === 'upcoming' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
            event.status === 'ongoing' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
            'bg-gray-100 text-gray-800 border border-gray-300'
          }`}>
            {event.status}
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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