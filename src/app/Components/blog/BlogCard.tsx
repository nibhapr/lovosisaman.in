'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

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
  // Function to get the display URL for the image
  const getDisplayUrl = (url: string) => {
    if (!url) return '';
    // If it's already a MongoDB file URL, use it directly
    return url;
  };

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      // Try to parse as ISO string first
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      try {
        // If that fails, try with regular Date constructor
        return format(new Date(dateString), 'MMM dd, yyyy');
      } catch (e) {
        // If all parsing fails, return the original string
        return dateString;
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
    >
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={getDisplayUrl(image)}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-black hover:text-gray-700 transition-all duration-300">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{formatDate(date)}</span>
            <span className="text-gray-600">{author}</span>
            <span className="text-gray-600">{category}</span>
          </div>
          
          <Link 
            href={`/blogs/${slug}`}
            className="text-blue-600 hover:text-blue-500 transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}