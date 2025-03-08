export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
} 