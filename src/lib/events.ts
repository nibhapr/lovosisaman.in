import { connectDB } from './db';
import Event from '@/app/models/Event';
import type { Event as EventType } from '@/types/event';

export async function getEventById(id: string): Promise<EventType | null> {
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
      content2: event.content2,
      content3: event.content3,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      image2: event.image2,
      image3: event.image3,
      status: event.status as EventType['status'],
      category: event.category as EventType['category'],
      slug: event.slug
    };
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }
}

export async function getEventBySlug(slug: string): Promise<EventType | null> {
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
      description: event.description,
      content: event.content,
      content2: event.content2,
      content3: event.content3,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      image2: event.image2,
      image3: event.image3,
      status: event.status as EventType['status'],
      category: event.category as EventType['category'],
      slug: event.slug
    };
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }
} 