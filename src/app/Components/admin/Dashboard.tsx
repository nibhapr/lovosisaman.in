"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';

interface ContactData {
  date: string;
  count: number;
}

interface DashboardStats {
  totalContacts: number;
  totalSubscribers: number;
  totalReviews: number;
  totalEvents: number;
  totalBlogs: number;
  totalCategories: number;
  totalSubcategories: number;
  averageRating: number;
  contactsData: ContactData[];
  newsletterData: ContactData[];
  reviewsData: ContactData[];
  eventsData: ContactData[];
  blogsData: ContactData[];
  categoriesData: ContactData[];
  subcategoriesData: ContactData[];
  totalProducts: number;
  productsData: ContactData[];
}

interface APIResponse {
  createdAt?: string;
  subscriptionDate?: string;
  date?: string;
}

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalSubscribers: 0,
    totalReviews: 0,
    totalEvents: 0,
    totalBlogs: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    averageRating: 0,
    contactsData: [],
    newsletterData: [],
    reviewsData: [],
    eventsData: [],
    blogsData: [],
    categoriesData: [],
    subcategoriesData: [],
    totalProducts: 0,
    productsData: []
  });

  useEffect(() => {
    fetchUserInfo();
    fetchDashboardStats();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok) {
        setUsername(data.username);
        setLastLoginAt(data.lastLoginAt);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const getDateFromItem = (item: APIResponse): Date => {
    if (item.createdAt) return new Date(item.createdAt);
    if (item.subscriptionDate) return new Date(item.subscriptionDate);
    if (item.date) return new Date(item.date);
    return new Date();
  };

  const fetchDashboardStats = async () => {
    try {
      const [
        contactsResponse, 
        newsletterResponse, 
        reviewsResponse, 
        eventsResponse, 
        blogsResponse,
        categoriesResponse,
        subcategoriesResponse,
        productsResponse
      ] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/admin/newsletter'),
        fetch('/api/reviews'),
        fetch('/api/events'),
        fetch('/api/blog'),
        fetch('/api/categories'),
        fetch('/api/subcategories'),
        fetch('/api/products')
      ]);

      const contacts = await contactsResponse.json();
      const subscribers = await newsletterResponse.json();
      const reviews = await reviewsResponse.json();
      const events = await eventsResponse.json();
      const blogs = await blogsResponse.json();
      const categories = await categoriesResponse.json();
      const subcategories = await subcategoriesResponse.json();
      const products = await productsResponse.json();

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        return {
          date,
          contacts: contacts.filter((c: APIResponse) => 
            format(getDateFromItem(c), 'yyyy-MM-dd') === date
          ).length,
          subscribers: subscribers.filter((s: APIResponse) => 
            format(getDateFromItem(s), 'yyyy-MM-dd') === date
          ).length,
          reviews: reviews.filter((r: APIResponse) => 
            format(getDateFromItem(r), 'yyyy-MM-dd') === date
          ).length,
          events: events.filter((e: APIResponse) => 
            format(getDateFromItem(e), 'yyyy-MM-dd') === date
          ).length,
          blogs: blogs.filter((b: APIResponse) => 
            format(getDateFromItem(b), 'yyyy-MM-dd') === date
          ).length,
          categories: categories.filter((c: APIResponse) => 
            format(getDateFromItem(c), 'yyyy-MM-dd') === date
          ).length,
          subcategories: subcategories.filter((s: APIResponse) => 
            format(getDateFromItem(s), 'yyyy-MM-dd') === date
          ).length,
          products: products.filter((p: APIResponse) => 
            format(getDateFromItem(p), 'yyyy-MM-dd') === date
          ).length
        };
      }).reverse();

      const averageRating = reviews.length 
        ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length 
        : 0;

      setStats({
        totalContacts: contacts.length,
        totalSubscribers: subscribers.length,
        totalReviews: reviews.length,
        totalEvents: events.length,
        totalBlogs: blogs.length,
        totalCategories: categories.length,
        totalSubcategories: subcategories.length,
        averageRating,
        contactsData: last7Days.map(d => ({ date: d.date, count: d.contacts })),
        newsletterData: last7Days.map(d => ({ date: d.date, count: d.subscribers })),
        reviewsData: last7Days.map(d => ({ date: d.date, count: d.reviews })),
        eventsData: last7Days.map(d => ({ date: d.date, count: d.events })),
        blogsData: last7Days.map(d => ({ date: d.date, count: d.blogs })),
        categoriesData: last7Days.map(d => ({ date: d.date, count: d.categories })),
        subcategoriesData: last7Days.map(d => ({ date: d.date, count: d.subcategories })),
        totalProducts: products.length,
        productsData: last7Days.map(d => ({ date: d.date, count: d.products })),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-6"
    >
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/20">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">
          Welcome back, {username || 'Admin'}
        </h1>
        <p className="text-[#86868b] mt-2 text-lg">
          Here's what's happening with your website today.
        </p>
        {lastLoginAt && (
          <p className="text-sm text-[#86868b] mt-1">
            Last login: {new Date(lastLoginAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Total Contacts</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalContacts}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Newsletter Subscribers</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalSubscribers}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-yellow-600">{stats.totalReviews}</p>
            <div className="flex items-center">
              <p className="text-lg font-semibold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
              <svg className="w-5 h-5 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalEvents}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Total Blog Posts</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalBlogs}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Total Categories</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalCategories}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Total Subcategories</h3>
          <p className="text-3xl font-bold text-pink-600">{stats.totalSubcategories}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20"
        >
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalProducts}</p>
        </motion.div>
      </div>
    </motion.div>
  );
} 