"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IoMailOutline, IoTrashOutline } from 'react-icons/io5';

interface Subscriber {
  _id: string;
  email: string;
  subscriptionDate: string;
  status: 'active' | 'inactive';
}

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setSubscribers(data);
    } catch (err) {
      setError('Failed to fetch subscribers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const response = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete subscriber');

      setSubscribers(subscribers.filter(sub => sub._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete subscriber');
    }
  };

  const updateSubscriberStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update local state
      setSubscribers(subscribers.map(sub => 
        sub._id === id ? { ...sub, status } : sub
      ));
    } catch (err) {
      console.error(err);
      alert('Failed to update subscriber status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            Total: {subscribers.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <IoMailOutline className="text-gray-400 mr-2" />
                      {subscriber.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(subscriber.subscriptionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={subscriber.status}
                      onChange={(e) => updateSubscriberStatus(subscriber._id, e.target.value as 'active' | 'inactive')}
                      className="ml-2 text-sm border rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(subscriber._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <IoTrashOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
} 