"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ImageUpload from '@/app/Components/shared/ImageUpload';

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
    const [isLoading, setIsLoading] = useState(true);
    const [newImage, setNewImage] = useState<string>('');

    useEffect(() => {
        fetchGalleryItems();
    }, [selectedCategory]);

    const fetchGalleryItems = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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

    const handleImageUpload = (url: string) => {
        setNewImage(url);
    };

    const handleSubmitNewImage = async () => {
        if (!newImage) return;

        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: [newImage], category: selectedCategory }),
            });

            if (!response.ok) throw new Error('Failed to upload image');

            fetchGalleryItems();
            setNewImage('');
        } catch (error) {
            console.error('Error uploading new image:', error);
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
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                    selectedCategory === category
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-white/80 text-gray-600 hover:bg-blue-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm shadow-xl">
                    {isLoading ? (
                        [...Array(9)].map((_, i) => (
                            <div key={i} className="aspect-square animate-pulse bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl shadow-md" />
                        ))
                    ) : (
                        galleryItems.map((item) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="aspect-square relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                                onClick={() => {
                                    setSelectedItem(item);
                                    setCurrentImageIndex(0);
                                }}
                            >
                                {item.images && item.images.length > 0 ? (
                                    <>
                                        <Image
                                            src={item.images[0]}
                                            alt={item.title}
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                                <h3 className="text-white font-semibold text-xl mb-3 drop-shadow-lg">{item.title}</h3>
                                                {item.description && (
                                                    <p className="text-white/95 text-sm line-clamp-2 mb-2 drop-shadow-lg">{item.description}</p>
                                                )}
                                                {item.images.length > 1 && (
                                                    <div className="flex items-center mt-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                                                        <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-white text-sm font-medium">{item.images.length} images</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
                                <div className="relative flex-1 bg-black">
                                    <Image
                                        src={selectedItem.images[currentImageIndex]}
                                        alt={selectedItem.title}
                                        fill
                                        className="object-contain"
                                        quality={100}
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                    />
                                    
                                    {selectedItem.images.length > 1 && (
                                        <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between">
                                            {currentImageIndex > 0 && (
                                                <button
                                                    onClick={handlePrevImage}
                                                    className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors backdrop-blur-sm"
                                                >
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                            )}
                                            {currentImageIndex < selectedItem.images.length - 1 && (
                                                <button
                                                    onClick={handleNextImage}
                                                    className="p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors backdrop-blur-sm"
                                                >
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="w-full md:w-80 p-6 flex flex-col bg-white dark:bg-gray-900">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold dark:text-white">{selectedItem.title}</h2>
                                        <button
                                            onClick={() => setSelectedItem(null)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                        >
                                            <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {selectedItem.description && (
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedItem.description}</p>
                                    )}

                                    {selectedItem.images.length > 1 && (
                                        <div className="mt-auto">
                                            <div className="grid grid-cols-4 gap-2">
                                                {selectedItem.images.map((img, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`relative aspect-square rounded-lg overflow-hidden ${
                                                            currentImageIndex === index ? 'ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100'
                                                        }`}
                                                    >
                                                        <Image
                                                            src={img}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            sizes="80px"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                                                {currentImageIndex + 1} of {selectedItem.images.length}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
} 