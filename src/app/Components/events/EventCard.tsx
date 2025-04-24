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
      className="bg-black rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow border border-zinc-800"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          unoptimized={imageUrl.startsWith('/api/files/')}
        />
      </div>
      <div className="p-6">
        <Link href={`/events/${event.slug}`}>
          <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-700 transition-all">
            {event.title}
          </h3>
        </Link>
        <p className="text-gray-400 mb-4">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-400">
            <span className="font-medium text-gray-300">Date:</span>
            <span className="ml-2">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <span className="font-medium text-gray-300">Time:</span>
            <span className="ml-2">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <span className="font-medium text-gray-300">Location:</span>
            <span className="ml-2">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/50">
            {event.category}
          </span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            event.status === 'upcoming' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' :
            event.status === 'ongoing' ? 'bg-green-900/30 text-green-400 border border-green-800/50' :
            'bg-zinc-900/30 text-gray-400 border border-zinc-800/50'
          }`}>
            {event.status}
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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