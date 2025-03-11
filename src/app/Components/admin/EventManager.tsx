'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import ImageUpload from '@/app/Components/shared/ImageUpload';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    slug: string;
    category: 'Technology' | 'Innovation' | 'Education' | 'Manufacturing' | 'Digital Services';
}

const EVENT_CATEGORIES = [
    'Technology',
    'Innovation',
    'Education',
    'Manufacturing',
    'Digital Services'
] as const;

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export default function EventManager() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [registrationData, setRegistrationData] = useState({
        name: '',
        email: '',
        phone: '',
        eventId: ''
    });
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
        slug: '',
        category: 'Technology' as typeof EVENT_CATEGORIES[number]
    });
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchRegistrations = async (event: Event) => {
        try {
            const response = await fetch(`/api/events/${event._id}/registrations`);
            if (!response.ok) throw new Error('Failed to fetch registrations');
            const data = await response.json();
            setRegistrations(data);
            setSelectedEventForRegistrations(event._id);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const eventData = {
                ...formData,
                slug: generateSlug(formData.title)
            };

            const url = isEditing ? `/api/events/${selectedEvent?._id}` : '/api/events';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save event');
            }
            
            await fetchEvents();
            resetForm();
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving event:', error);
            alert(error instanceof Error ? error.message : 'Failed to save event');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete event');
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            image: '',
            status: 'upcoming',
            slug: '',
            category: 'Technology'
        });
        setIsEditing(false);
        setSelectedEvent(null);
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/events/${selectedEvent?._id}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });
            if (!response.ok) throw new Error('Failed to register');
            setShowRegistrationModal(false);
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <h2 className="text-2xl font-semibold mb-6">
                    {isEditing ? 'Edit Event' : 'Add New Event'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time
                            </label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            label="Event Image"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'upcoming' | 'ongoing' | 'completed' })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof EVENT_CATEGORIES[number] })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a category</option>
                            {EVENT_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isEditing ? 'Update' : 'Add'} Event
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
                <h2 className="text-2xl font-semibold mb-6">Events</h2>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                    {event.image ? (
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{event.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(event.date).toLocaleDateString()} at {event.time}
                                    </p>
                                    <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                        {event.category}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setSelectedEvent(event);
                                        setFormData({
                                            title: event.title,
                                            description: event.description,
                                            date: event.date,
                                            time: event.time,
                                            location: event.location,
                                            image: event.image,
                                            status: event.status,
                                            slug: event.slug,
                                            category: event.category
                                        });
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <IoCreateOutline className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <IoTrashOutline className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        setRegistrationData(prev => ({ ...prev, eventId: event._id }));
                                        setShowRegistrationModal(true);
                                    }}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    Register
                                </button>
                                <button
                                    onClick={() => fetchRegistrations(event)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    View Registrations
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Registration Modal */}
            {showRegistrationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Register for Event</h3>
                        <form onSubmit={handleRegistration} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={registrationData.name}
                                    onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={registrationData.email}
                                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={registrationData.phone}
                                    onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Register
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowRegistrationModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedEventForRegistrations && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Event Registrations</h3>
                            <button 
                                onClick={() => setSelectedEventForRegistrations(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {registrations.map((reg) => (
                                <div key={reg._id} className="border rounded-lg p-4">
                                    <p><span className="font-medium">Name:</span> {reg.name}</p>
                                    <p><span className="font-medium">Email:</span> {reg.email}</p>
                                    <p><span className="font-medium">Phone:</span> {reg.phone}</p>
                                    <p><span className="font-medium">Registered:</span> {new Date(reg.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                            {registrations.length === 0 && (
                                <p className="text-center text-gray-500">No registrations yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}