import { Suspense } from 'react';
import EventsList from '@/app/events/EventsList';

export default function EventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Events</h1>
      <Suspense fallback={<div>Loading events...</div>}>
        <EventsList />
      </Suspense>
    </div>
  );
} 