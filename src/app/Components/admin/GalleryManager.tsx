"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoAddOutline, IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import ImageUpload from '../shared/ImageUpload';

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  category: string;
  date: string;
}

const CATEGORIES = ['Products', 'Events', 'Company', 'Projects'];

export default function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [''],
    category: CATEGORIES[0]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      const data = await response.json();
      setGalleryItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setGalleryItems([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && selectedItem?._id ? `/api/gallery/${selectedItem._id}` : '/api/gallery';
      const method = isEditing ? 'PUT' : 'POST';
      
      const data = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== '')
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to save gallery item');
      
      await fetchGalleryItems();
      resetForm();
    } catch (error) {
      console.error('Error saving gallery item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete gallery item');
      
      await fetchGalleryItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      images: [''],
      category: CATEGORIES[0]
    });
    setIsEditing(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gallery Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <ImageUpload
                      value={image}
                      onChange={(url) => {
                        const newImages = [...formData.images];
                        newImages[index] = url;
                        setFormData({ ...formData, images: newImages });
                      }}
                      label={`Image ${index + 1}`}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <IoTrashOutline className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    images: [...formData.images, '']
                  })}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <IoAddOutline className="w-5 h-5" />
                  <span>Add Another Image</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Update' : 'Add'} Gallery Item
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Gallery List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="space-y-4">
            {Array.isArray(galleryItems) && galleryItems.length > 0 ? (
              galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setSelectedItem(item);
                          setFormData({
                            title: item.title,
                            description: item.description || '',
                            images: item.images,
                            category: item.category
                          });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <IoCreateOutline className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <IoTrashOutline className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {item.images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${item.title} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No gallery items found</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 