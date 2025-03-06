'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    image: string;
    date: string;
    author: string;
    category: string;
    slug: string;
    youtubeUrl?: string;
}

interface ImageUploadResponse {
  url: string;
  success: boolean;
  error?: string;
}

const BLOG_CATEGORIES = [
  'Technology',
  'Innovation',
  'Education',
  'Manufacturing',
  'Digital Services'
];

export default function BlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Omit<BlogPost, '_id' | 'date'>>({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        youtubeUrl: '',
        category: '',
        slug: '',
        author: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/blog');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setPosts(data);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/api/blog/${selectedPost?.slug}` : '/api/blog';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save post');
            }

            await fetchPosts();
            setIsEditing(false);
            setSelectedPost(null);
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                image: '',
                youtubeUrl: '',
                category: '',
                slug: '',
                author: ''
            });
        } catch (error) {
            console.error('Failed to save post:', error);
            setError(error instanceof Error ? error.message : 'Failed to save post');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            return {
                url: data.url,
                success: true
            };
        } catch (error) {
            console.error('Image upload error:', error);
            return {
                url: '',
                success: false,
                error: error instanceof Error ? error.message : 'Failed to upload image'
            };
        }
    };

    const getYoutubeVideoId = (url: string) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : '';
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`/api/blog/${slug}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            await fetchPosts();
            setSelectedPost(null);
            setIsEditing(false);
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                image: '',
                youtubeUrl: '',
                category: '',
                slug: '',
                author: ''
            });
        } catch (error) {
            console.error('Failed to delete post:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete post');
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
            <h2 className="text-2xl font-bold mb-6">Blog Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Post List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Posts</h3>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedPost(null);
                                setFormData({
                                    title: '',
                                    content: '',
                                    excerpt: '',
                                    image: '',
                                    youtubeUrl: '',
                                    category: '',
                                    slug: '',
                                    author: ''
                                });
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            New Post
                        </button>
                    </div>

                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="p-4 rounded-lg border hover:border-blue-500 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div
                                        className="flex-grow cursor-pointer"
                                        onClick={() => {
                                            setSelectedPost(post);
                                            setFormData({
                                                title: post.title || '',
                                                content: post.content || '',
                                                excerpt: post.excerpt || '',
                                                image: post.image || '',
                                                youtubeUrl: post.youtubeUrl || '',
                                                category: post.category || '',
                                                slug: post.slug || '',
                                                author: post.author || ''
                                            });
                                            setIsEditing(true);
                                        }}
                                    >
                                        <h4 className="font-medium">{post.title}</h4>
                                        <p className="text-sm text-gray-600">
                                            {new Date(post.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(post.slug);
                                        }}
                                        className="ml-4 p-2 text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Post Form */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {isEditing ? 'Edit Post' : 'New Post'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                Image
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const result = await uploadImage(file);
                                            if (result.success) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    image: result.url
                                                }));
                                            } else {
                                                setError(result.error || 'Failed to upload image');
                                            }
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formData.image && (
                                    <img 
                                        src={formData.image} 
                                        alt="Preview" 
                                        className="h-20 w-20 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                YouTube Video URL (optional)
                            </label>
                            <input
                                type="url"
                                id="youtubeUrl"
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={handleInputChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.youtubeUrl && getYoutubeVideoId(formData.youtubeUrl) && (
                                <div className="mt-2">
                                    <iframe
                                        width="200"
                                        height="113"
                                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(formData.youtubeUrl)}`}
                                        title="YouTube video preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a category</option>
                                {BLOG_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                                Author
                            </label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setSelectedPost(null);
                                    setFormData({
                                        title: '',
                                        content: '',
                                        excerpt: '',
                                        image: '',
                                        youtubeUrl: '',
                                        category: '',
                                        slug: '',
                                        author: ''
                                    });
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {isEditing ? 'Update Post' : 'Create Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
} 