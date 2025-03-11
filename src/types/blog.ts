import { Types } from 'mongoose';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  image: string;
  category: string;
  author: string;
  date: string;
  excerpt?: string;
  youtubeUrl?: string;
  readingTime?: string;
  createdAt: Date;
  updatedAt: Date;
} 