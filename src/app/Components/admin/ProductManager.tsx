"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoAddOutline, IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import type { Category, Subcategory, Product } from '@/types/shop';
import ImageUpload from '@/app/Components/shared/ImageUpload';

export default function ProductManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [''],
        categoryId: '',
        subcategoryId: '',
        features: [''],
        specifications: {} as Record<string, string>,
        catalogPdf: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            ...formData,
            slug: generateSlug(formData.name),
            images: formData.images.filter(img => img.trim() !== ''),
            features: formData.features.filter(feature => feature.trim() !== ''),
        };

        try {
            const url = isEditing && selectedProduct?._id
                ? `/api/products/${selectedProduct._id}`
                : '/api/products';

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                fetchProducts();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            images: [''],
            categoryId: '',
            subcategoryId: '',
            features: [''],
            specifications: {},
            catalogPdf: '',
        });
        setIsEditing(false);
        setSelectedProduct(null);
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

    const fetchSubcategories = async () => {
        try {
            const response = await fetch('/api/subcategories');
            if (response.ok) {
                const data = await response.json();
                setSubcategories(data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (productId: string | undefined) => {
        if (!productId) return;
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                await fetchProducts();
            } else {
                const error = await response.json();
                console.error('Error:', error);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
        fetchProducts();
    }, []);

    const filteredSubcategories = subcategories.filter(
        sub => sub.categoryId === formData.categoryId
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <h2 className="text-2xl font-semibold mb-6">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    categoryId: e.target.value,
                                    subcategoryId: '',
                                });
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subcategory
                        </label>
                        <select
                            value={formData.subcategoryId}
                            onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={!formData.categoryId}
                        >
                            <option value="">Select a subcategory</option>
                            {filteredSubcategories.map((subcategory) => (
                                <option key={subcategory._id} value={subcategory._id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>
                        <div className="space-y-4">
                            {formData.images.map((image, index) => (
                                <div key={`image-${index}`} className="flex items-center space-x-4">
                                    <ImageUpload
                                        value={image}
                                        onChange={(url: string) => {
                                            const newImages = [...formData.images];
                                            newImages[index] = url;
                                            setFormData(prevState => ({
                                                ...prevState,
                                                images: newImages
                                            }));
                                        }}
                                        label={`Image ${index + 1}`}
                                        index={index}
                                    />
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = formData.images.filter((_, i) => i !== index);
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    images: newImages
                                                }));
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
                                onClick={() => {
                                    setFormData(prevState => ({
                                        ...prevState,
                                        images: [...prevState.images, '']
                                    }));
                                }}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                            >
                                <IoAddOutline className="w-5 h-5" />
                                <span>Add Another Image</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catalog PDF
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    try {
                                        const response = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formData,
                                        });
                                        if (response.ok) {
                                            const data = await response.json();
                                            setFormData(prev => ({ ...prev, catalogPdf: data.url }));
                                        }
                                    } catch (error) {
                                        console.error('Error uploading PDF:', error);
                                    }
                                }
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Features
                        </label>
                        {formData.features.map((feature, index) => (
                            <div key={`feature-${index}`} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => {
                                        const newFeatures = [...formData.features];
                                        newFeatures[index] = e.target.value;
                                        setFormData({ ...formData, features: newFeatures });
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newFeatures = formData.features.filter((_, i) => i !== index);
                                        setFormData({ ...formData, features: newFeatures });
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            + Add another feature
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specifications
                        </label>
                        {Object.entries(formData.specifications).map(([key, value], index) => (
                            <div key={`spec-${index}`} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={key}
                                    onChange={(e) => {
                                        const newSpecs = { ...formData.specifications };
                                        const oldValue = newSpecs[key];
                                        delete newSpecs[key];
                                        newSpecs[e.target.value] = oldValue;
                                        setFormData({ ...formData, specifications: newSpecs });
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
                                    placeholder="Specification name"
                                />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            specifications: {
                                                ...formData.specifications,
                                                [key]: e.target.value
                                            }
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
                                    placeholder="Specification value"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isEditing ? 'Update' : 'Add'} Product
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
                <h2 className="text-2xl font-semibold mb-6">Products</h2>
                <div className="space-y-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Category: {categories.find(c => c._id === product.categoryId)?.name} | Subcategory: {subcategories.find(s => s._id === product.subcategoryId)?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setSelectedProduct({
                                            ...product,
                                            _id: product._id
                                        });
                                        setFormData({
                                            name: product.name,
                                            description: product.description,
                                            images: product.images,
                                            categoryId: product.categoryId,
                                            subcategoryId: product.subcategoryId,
                                            features: product.features || [''],
                                            specifications: product.specifications || {},
                                            catalogPdf: product.catalogPdf || '',
                                        });
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <IoCreateOutline className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id as string)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <IoTrashOutline className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
} 