"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface GalleryImage {
    _id: string;
    title: string;
    description?: string;
    images: string[];
    category: string;
    date: string;
}

const CATEGORIES = ['All', 'Products', 'Events', 'Company', 'Projects'];

export default function Gallery() {
    const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchGalleryItems();
    }, [selectedCategory]);

    const fetchGalleryItems = async () => {
        try {
            const url = selectedCategory === 'All'
                ? '/api/gallery'
                : `/api/gallery?category=${selectedCategory}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch gallery items');

            const data = await response.json();
            setGalleryItems(data);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItem && currentImageIndex < selectedItem.images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedItem && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Our Gallery
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Explore our collection of images showcasing our products, events, and company culture.
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map((item) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="group relative cursor-pointer"
                            onClick={() => {
                                setSelectedItem(item);
                                setCurrentImageIndex(0);
                            }}
                        >
                            <div className="relative aspect-square rounded-xl overflow-hidden">
                                {item.images && item.images.length > 0 ? (
                                    <Image
                                        src={item.images[0]}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image available</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="text-lg font-semibold">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-sm opacity-90">{item.description}</p>
                                        )}
                                        <p className="text-sm mt-2">{item.images?.length || 0} images</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modal */}
                {selectedItem && (
                    <div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
                            {selectedItem.images && selectedItem.images.length > 0 ? (
                                <Image
                                    src={selectedItem.images[currentImageIndex]}
                                    alt={selectedItem.title}
                                    width={1200}
                                    height={800}
                                    className="object-contain w-full h-full"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">No image available</span>
                                </div>
                            )}

                            {selectedItem.images && selectedItem.images.length > 1 && (
                                <>
                                    {currentImageIndex > 0 && (
                                        <button
                                            onClick={handlePrevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    {currentImageIndex < selectedItem.images.length - 1 && (
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                                        >
                                            Next
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 