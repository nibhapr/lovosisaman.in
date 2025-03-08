import { connectDB } from './db';
import Event from '@/app/models/Event';
import type { Event as EventType } from '@/types/event';

export async function getEvent(slug: string): Promise<EventType | null> {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean() as any;
    
    if (!event) {
      console.log('No event found for slug:', slug);
      return null;
    }

    return {
      _id: event._id.toString(),
      title: event.title,
      slug: event.slug,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      status: event.status as EventType['status']
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
} 