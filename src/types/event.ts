export interface Event {
  _id: string;
  title: string;
  description: string;
  content?: string;
  content2?: string;
  content3?: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  image2?: string;
  image3?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: 'Technology' | 'Innovation' | 'Education' | 'Manufacturing' | 'Digital Services';
} 