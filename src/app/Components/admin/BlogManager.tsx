'use client';

import { useState, useEffect } from 'react';
import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import type { BlogPost } from '@/types/blog';
import ImageUpload from '@/app/Components/shared/ImageUpload';

const BLOG_CATEGORIES = [
    'Technology',
    'Innovation',
    'Education',
    'Manufacturing',
    'Digital Services'
];

const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens
};

export default function BlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Omit<BlogPost, '_id' | 'date'>>({
        title: '',
        content: '',
        content2: '',
        content3: '',
        content4: '',
        excerpt: '',
        image: '',
        image2: '',
        image3: '',
        youtubeUrl: '',
        category: '',
        slug: '',
        author: '',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/blogs');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.title || !formData.content) {
            setError('Title and content are required');
            setIsSubmitting(false);
            return;
        }

        if (!formData.image) {
            setError('Main image is required');
            setIsSubmitting(false);
            return;
        }

        try {
            const blogData = {
                ...formData,
                author: formData.author || "Default Author Name",
                slug: generateSlug(formData.title),
                content: formData.content || undefined,
                content2: formData.content2 || undefined,
                content3: formData.content3 || undefined,
                content4: formData.content4 || undefined,
                image: formData.image || undefined,
                image2: formData.image2 || undefined,
                image3: formData.image3 || undefined
            };

            const url = isEditing ? `/api/blog/${selectedPost?._id}` : '/api/blog';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to save post');
            }

            await fetchPosts();
            resetForm();
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving post:', error);
            setError(error instanceof Error ? error.message : 'Failed to save post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (post: BlogPost) => {
        console.log('Editing post:', post); // Add this for debugging
        setSelectedPost(post);
        setFormData({
            title: post.title,
            content: post.content || '',
            content2: post.content2 || '',
            content3: post.content3 || '',
            content4: post.content4 || '',
            excerpt: post.excerpt || '',
            image: post.image || '',
            image2: post.image2 || '',
            image3: post.image3 || '',
            youtubeUrl: post.youtubeUrl || '',
            category: post.category,
            slug: post.slug,
            author: post.author,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        });
        setIsEditing(true);
    };

    const handleDelete = async (slug: string) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            setIsDeleting(true);
            const response = await fetch(`/api/blog/${slug}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete post');
        } finally {
            setIsDeleting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            content2: '',
            content3: '',
            content4: '',
            excerpt: '',
            image: '',
            image2: '',
            image3: '',
            youtubeUrl: '',
            category: '',
            slug: '',
            author: '',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        setIsEditing(false);
        setSelectedPost(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Blog Manager</h1>

            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            {BLOG_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Author</label>
                    <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Image Upload Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <ImageUpload
                            value={formData.image || ''}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            label="Main Image"
                        />
                    </div>
                    <div>
                        <ImageUpload
                            value={formData.image2 || ''}
                            onChange={(url) => setFormData({ ...formData, image2: url })}
                            label="Second Image"
                        />
                    </div>
                    <div>
                        <ImageUpload
                            value={formData.image3 || ''}
                            onChange={(url) => setFormData({ ...formData, image3: url })}
                            label="Third Image"
                        />
                    </div>
                </div>

                {/* Content Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Main Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows={6}
                            required
                        />
                    </div>

                    {/* Additional Content Fields */}
                    {['content2', 'content3', 'content4'].map((field, index) => (
                        <div key={field}>
                            <label className="block mb-2">Additional Content {index + 1}</label>
                            <textarea
                                value={formData[field as keyof typeof formData] as string}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                className="w-full p-2 border rounded"
                                rows={4}
                            />
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                    </button>
                </div>
            </form>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="border p-4 rounded">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">{post.title}</h3>
                                    <p className="text-gray-600">{post.category}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <IoCreateOutline className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.slug)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <IoTrashOutline className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}