"use client";

import { useState, useEffect } from 'react';
import EventCard from '../Components/events/EventCard';
import { motion } from 'framer-motion';
import { Event } from '@/types/event';

const EVENT_CATEGORIES = [
  'All',
  'Technology',
  'Innovation',
  'Education',
  'Manufacturing',
  'Digital Services'
] as const;

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-6">
          Events
        </h1>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {EVENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 text-gray-300 hover:bg-zinc-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}