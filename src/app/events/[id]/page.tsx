import { getEvent } from '@/lib/events';
import EventDetail from '@/app/Components/events/EventDetail';
import { notFound } from 'next/navigation';

export default async function EventPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const event = await getEvent(params.id);
  
  if (!event) {
    return notFound();
  }

  return <EventDetail event={event} />;
} 