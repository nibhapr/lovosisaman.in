import { connectDB } from './db';
import Event from '@/app/models/Event';
import type { Event as EventType } from '@/types/event';

export async function getEvent(id: string): Promise<EventType | null> {
  try {
    await connectDB();
    const event = await Event.findById(id).lean() as any;
    
    if (!event) {
      console.log('No event found for id:', id);
      return null;
    }

    return {
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      content: event.content,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      status: event.status as EventType['status'],
      category: event.category as EventType['category']
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
} 