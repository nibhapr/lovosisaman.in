'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    IoCalendarOutline,
    IoPersonOutline,
    IoFolderOutline,
    IoTimeOutline,
    IoShareSocialOutline,
    IoLogoTwitter,
    IoLogoLinkedin,
    IoLogoFacebook
} from 'react-icons/io5';

interface BlogPostProps {
    post: {
        title: string;
        content: string;
        image: string;
        date: string;
        author: string;
        category: string;
        readingTime?: string; // Optional new field
        youtubeUrl?: string; // Add this field
    }
}

export default function BlogPost({ post }: BlogPostProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out this article: ${post.title}`;

    const handleShare = (platform: string) => {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        };
        window.open(urls[platform as keyof typeof urls], '_blank');
    };

    const getYoutubeVideoId = (url: string) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : '';
    };

    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 px-4"
        >
            <div className="max-w-4xl mx-auto">
                {/* Category Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-8 text-center"
                >
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all">
                        <IoFolderOutline className="w-4 h-4 mr-2" />
                        {post.category}
                    </span>
                </motion.div>

                {/* Title with animated background */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-8"
                >
                    <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur-lg opacity-30"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <h1 className="relative text-4xl md:text-5xl font-bold text-gray-900 text-center p-4 leading-tight">
                        {post.title}
                    </h1>
                </motion.div>

                {/* Featured Image with parallax effect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                    className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-12"
                >
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700"
                        style={{
                            transform: "scale(1.1)",
                        }}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

                    {/* Floating meta information on the image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white backdrop-blur-sm bg-black/20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <IoPersonOutline className="w-5 h-5 mr-2" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center">
                                    <IoCalendarOutline className="w-5 h-5 mr-2" />
                                    <span>{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
                                </div>
                            </div>
                            {post.readingTime && (
                                <div className="flex items-center">
                                    <IoTimeOutline className="w-5 h-5 mr-2" />
                                    <span>{post.readingTime} min read</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {post.youtubeUrl && getYoutubeVideoId(post.youtubeUrl) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYoutubeVideoId(post.youtubeUrl)}`}
                                title="YouTube video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Content Container with glass effect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    {/* Share Buttons with hover effects */}
                    <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2">
                        <div className="flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-4"
                            >
                                <IoShareSocialOutline className="w-5 h-5 text-gray-500" />
                            </motion.div>
                            {['twitter', 'linkedin', 'facebook'].map((platform) => (
                                <motion.button
                                    key={platform}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleShare(platform)}
                                    className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                                    aria-label={`Share on ${platform}`}
                                >
                                    {platform === 'twitter' && <IoLogoTwitter className="w-5 h-5" />}
                                    {platform === 'linkedin' && <IoLogoLinkedin className="w-5 h-5" />}
                                    {platform === 'facebook' && <IoLogoFacebook className="w-5 h-5" />}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Content with enhanced glass morphism */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 border border-white/20">
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.article>
    );
} 