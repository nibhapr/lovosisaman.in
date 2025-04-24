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

const categories: NavItem[] = [];

export default function NestedNavbar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();

  const fetchCategories = async (navbarCategoryId: string) => {
    const response = await fetch(`/api/categories?navbarCategoryId=${navbarCategoryId}`);
    return await response.json();
  };

  const fetchSubcategories = async (categoryId: string) => {
    const response = await fetch(`/api/subcategories?categoryId=${categoryId}`);
    return await response.json();
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-xl">
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
                href={`/products/${category.slug}`}
                className="flex items-center space-x-1 py-4 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-semibold">
                  {category.name}
                </span>
                <IoChevronDownOutline className="w-4 h-4" />
              </Link>

              <AnimatePresence>
                {activeCategory === category.slug && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-48 bg-gray-900 shadow-lg rounded-lg py-2 z-50 border border-gray-800"
                  >
                    {category.subcategories?.map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        href={`/products/${category.slug}/${subcategory.slug}`}
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-blue-400 transition-colors"
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