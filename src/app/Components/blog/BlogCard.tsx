'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date: string;
  author: string;
  category: string;
  slug: string;
}

export default function BlogCard({
  title,
  excerpt,
  image,
  date,
  author,
  category,
  slug,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{format(new Date(date), 'MMM dd, yyyy')}</span>
            <span>{author}</span>
            <span>{category}</span>
          </div>
          
          <Link 
            href={`/blogs/${slug}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 