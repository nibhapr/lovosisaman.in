export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: 'Technology' | 'Innovation' | 'Education' | 'Manufacturing' | 'Digital Services';
} 