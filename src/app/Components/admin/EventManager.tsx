"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoTrashOutline, IoPencilOutline, IoAddOutline } from 'react-icons/io5';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    category: string;
    slug: string;
    youtubeUrl?: string;
    additionalDetails?: string;
}

const EVENT_CATEGORIES = ['Technology', 'Workshop', 'Conference', 'Webinar'];

export default function EventManager() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        category: '',
        slug: '',
        youtubeUrl: '',
        additionalDetails: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            console.log('Events data:', data);
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setError('Failed to fetch events');
        }
    };

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
            
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to upload image');
            }
            
            return data.url;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw new Error('Image upload failed');
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;
            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile);
            }

            const eventData = {
                ...formData,
                image: imageUrl,
                slug: formData.slug || generateSlug(formData.title)
            };

            const url = isEditing ? `/api/events/${selectedEvent?.slug}` : '/api/events';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) throw new Error('Failed to save event');

            fetchEvents();
            resetForm();
        } catch (error) {
            console.error('Error saving event:', error);
            setError('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (event: Event) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`/api/events/${event._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete event');
            }

            await fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete event');
        }
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            image: event.image,
            category: event.category,
            slug: event.slug,
            youtubeUrl: event.youtubeUrl || '',
            additionalDetails: event.additionalDetails || ''
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            image: '',
            category: '',
            slug: '',
            youtubeUrl: '',
            additionalDetails: ''
        });
        setImageFile(null);
        setSelectedEvent(null);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
        >
            <h2 className="text-2xl font-bold mb-6">Event Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border"
                            required
                        />

                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border h-32"
                            required
                        />

                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border"
                            required
                        />

                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border"
                            required
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border"
                            required
                        />

                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border"
                            required
                        >
                            <option value="">Select Category</option>
                            {EVENT_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="w-full px-4 py-2 rounded-lg border"
                        />

                        <input
                            type="url"
                            placeholder="YouTube URL (optional)"
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border"
                        />

                        <textarea
                            placeholder="Additional Details (optional)"
                            value={formData.additionalDetails}
                            onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border h-32"
                        />

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Events List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{event.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(event.date).toLocaleDateString()} - {event.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <IoPencilOutline className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <IoTrashOutline className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 