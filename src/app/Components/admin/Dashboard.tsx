"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoPersonOutline,
  IoMailOutline,
  IoAnalyticsOutline,
  IoCartOutline,
  IoTrendingUpOutline,
  IoDownloadOutline,
  IoAddOutline
} from 'react-icons/io5';

const stats = [
  { name: 'Total Users', value: '1,234', icon: IoPersonOutline, change: '+12%', color: '#007AFF' },
  { name: 'Messages', value: '456', icon: IoMailOutline, change: '+5%', color: '#5856D6' },
  { name: 'Analytics', value: '89%', icon: IoAnalyticsOutline, change: '+2%', color: '#34C759' },
  { name: 'Orders', value: '789', icon: IoCartOutline, change: '+8%', color: '#FF9500' },
];

export default function Dashboard() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Get user info from token
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (response.ok) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

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
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#1d1d1f]">Dashboard Overview</h2>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white/60 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-black/5 active:bg-black/10 transition-colors flex items-center space-x-2 text-[#1d1d1f]">
            <IoDownloadOutline className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button className="px-5 py-2.5 bg-[#007AFF] text-white rounded-2xl hover:opacity-90 active:opacity-80 transition-all flex items-center space-x-2">
            <IoAddOutline className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#86868b] text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-semibold mt-1 text-[#1d1d1f]">{stat.value}</p>
              </div>
              <div className={`p-3.5 rounded-2xl`} style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center space-x-1 text-[#34C759]">
                <IoTrendingUpOutline className="w-4 h-4" />
                <span className="font-medium">{stat.change}</span>
              </div>
              <span className="text-[#86868b] text-sm ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20">
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Total Users</h3>
          <p className="text-3xl font-bold text-[#007AFF] mt-2">1,234</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20">
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Total Orders</h3>
          <p className="text-3xl font-bold text-[#5856D6] mt-2">567</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/20">
          <h3 className="text-lg font-semibold text-[#1d1d1f]">Revenue</h3>
          <p className="text-3xl font-bold text-[#34C759] mt-2">$12,345</p>
        </div>
      </div>
    </motion.div>
  );
} 