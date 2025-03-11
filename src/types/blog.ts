import { Types } from 'mongoose';

export interface BlogPost {
  _id: string;
  title: string;
  content?: string;
  content2?: string;
  content3?: string;
  content4?: string;
  slug: string;
  image?: string;
  image2?: string;
  image3?: string;
  category: string;
  author: string;
  date: string;
  excerpt?: string;
  youtubeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
} 