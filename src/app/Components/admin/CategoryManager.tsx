"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import type { Category } from '@/types/shop';
import ImageUpload from '@/app/Components/shared/ImageUpload';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      ...formData,
      slug: generateSlug(formData.name),
    };

    try {
      const url = isEditing 
        ? `/api/categories/${selectedCategory?._id}`
        : '/api/categories';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        fetchCategories();
        resetForm();
      } else {
        const error = await response.json();
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '' });
    setIsEditing(false);
    setSelectedCategory(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    setIsEditing(true);
    setSelectedCategory(category);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit' : 'Add'} Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div>
            <ImageUpload
              key={formData.image}
              value={formData.image}
              onChange={(url: string) => setFormData({ ...formData, image: url })}
              label="Category Image"
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Update' : 'Add'} Category
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* List Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-6">Categories</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {category.image && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <IoCreateOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category._id!)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <IoTrashOutline className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-500 text-center py-4">No categories found</p>
          )}
        </div>
      </motion.div>
    </div>
  );
} 