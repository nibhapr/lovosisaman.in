"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDownOutline } from 'react-icons/io5';

interface NavItem {
  name: string;
  slug: string;
  subcategories?: {
    name: string;
    slug: string;
  }[];
}

const categories: NavItem[] = [
  {
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Smartphones', slug: 'smartphones' },
    ],
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    subcategories: [
      { name: 'Men', slug: 'men' },
      { name: 'Women', slug: 'women' },
    ],
  },
];

export default function NestedNavbar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex space-x-8">
          {categories.map((category) => (
            <li
              key={category.slug}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category.slug)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                href={`/shop/${category.slug}`}
                className="flex items-center space-x-1 py-4 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>{category.name}</span>
                <IoChevronDownOutline className="w-4 h-4" />
              </Link>

              <AnimatePresence>
                {activeCategory === category.slug && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
                  >
                    {category.subcategories?.map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        href={`/shop/${category.slug}/${subcategory.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 