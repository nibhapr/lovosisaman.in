'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
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
import { useEffect, useState } from 'react';

interface BlogPostProps {
    post: {
        title: string;
        content?: string;
        content2?: string;
        content3?: string;
        content4?: string;
        image?: string;
        image2?: string;
        image3?: string;
        date: string;
        author: string;
        category: string;
        readingTime?: string;
        youtubeUrl?: string;
        excerpt?: string;
    }
}

export default function BlogPost({ post }: BlogPostProps) {
    const [shareUrl, setShareUrl] = useState('');
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

    // Function to get the display URL for images
    const getDisplayUrl = (url: string) => {
        if (!url) return '';
        return url;
    };

    // Format date safely
    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'MMM dd, yyyy');
        } catch (error) {
            try {
                return format(new Date(dateString), 'MMM dd, yyyy');
            } catch (e) {
                return dateString;
            }
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(window.location.href);
        }
    }, []);

    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-6 bg-white text-black"
        >
            <header className="mb-8 bg-white">
                <h1 className="text-4xl font-bold mb-4 text-black">{post.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 bg-white">
                    <span className="flex items-center gap-1 bg-white">
                        <IoCalendarOutline className="text-blue-600" />
                        {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1 bg-white">
                        <IoPersonOutline className="text-blue-600" />
                        {post.author}
                    </span>
                    <span className="flex items-center gap-1 bg-white">
                        <IoFolderOutline className="text-blue-600" />
                        {post.category}
                    </span>
                    {post.readingTime && (
                        <span className="flex items-center gap-1 bg-white">
                            <IoTimeOutline className="text-blue-600" />
                            {post.readingTime}
                        </span>
                    )}
                </div>
            </header>

            {post.image && (
                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden border border-gray-300 bg-white">
                    <Image
                        src={getDisplayUrl(post.image)}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {post.content && (
                <div 
                    className="prose prose-lg max-w-none mb-8 prose-headings:text-black prose-a:text-blue-600 hover:prose-a:text-blue-500 bg-white"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            )}

            {post.image2 && (
                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden border border-gray-300 bg-white">
                    <Image
                        src={getDisplayUrl(post.image2)}
                        alt={`${post.title} - additional image 1`}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {post.content2 && (
                <div 
                    className="prose prose-lg max-w-none mb-8 prose-headings:text-black prose-a:text-blue-600 hover:prose-a:text-blue-500 bg-white"
                    dangerouslySetInnerHTML={{ __html: post.content2 }}
                />
            )}

            {post.image3 && (
                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden border border-gray-300 bg-white">
                    <Image
                        src={getDisplayUrl(post.image3)}
                        alt={`${post.title} - additional image 2`}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {post.content3 && (
                <div 
                    className="prose prose-lg max-w-none mb-8 prose-headings:text-black prose-a:text-blue-600 hover:prose-a:text-blue-500 bg-white"
                    dangerouslySetInnerHTML={{ __html: post.content3 }}
                />
            )}

            {post.content4 && (
                <div 
                    className="prose prose-lg max-w-none mb-8 prose-headings:text-black prose-a:text-blue-600 hover:prose-a:text-blue-500 bg-white"
                    dangerouslySetInnerHTML={{ __html: post.content4 }}
                />
            )}

            {post.youtubeUrl && (
                <div className="aspect-video mb-8 rounded-xl overflow-hidden border border-gray-300 bg-white">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(post.youtubeUrl)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            <div className="mt-8 border-t border-gray-300 pt-4 bg-white">
                <div className="flex items-center gap-4 bg-white">
                    <span className="flex items-center gap-2 text-gray-600 bg-white">
                        <IoShareSocialOutline className="text-blue-600" />
                        Share:
                    </span>
                    <button
                        onClick={() => handleShare('twitter')}
                        className="text-blue-600 hover:text-blue-500 transition-colors bg-white"
                    >
                        <IoLogoTwitter size={24} />
                    </button>
                    <button
                        onClick={() => handleShare('linkedin')}
                        className="text-blue-600 hover:text-blue-500 transition-colors bg-white"
                    >
                        <IoLogoLinkedin size={24} />
                    </button>
                    <button
                        onClick={() => handleShare('facebook')}
                        className="text-blue-600 hover:text-blue-500 transition-colors bg-white"
                    >
                        <IoLogoFacebook size={24} />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}