"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoAddOutline, IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import type { NavbarCategory, Category, Subcategory, Product } from '@/types/shop';
import ImageUpload from '@/app/Components/shared/ImageUpload';

export default function ProductManager() {
    const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        images: [''],
        navbarCategoryId: '',
        categoryId: '',
        subcategoryId: '',
        catalogImage: null as string | null,
        catalogImages: [''],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const generateSignature = async (timestamp: number) => {
        const response = await fetch('/api/generate-signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timestamp }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate signature');
        }

        const { signature } = await response.json();
        return signature;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validate navbarCategoryId
            if (!formData.navbarCategoryId || !navbarCategories.some(nc => nc._id === formData.navbarCategoryId)) {
                alert('Please select a valid navbar category');
                return;
            }

            console.log('Submitting form data:', formData);

            const productData = {
                ...formData,
                slug: generateSlug(formData.name),
                images: formData.images.filter(img => img.trim() !== ''),
                catalogImage: formData.catalogImage,
                categoryId: formData.categoryId || undefined,
                subcategoryId: formData.subcategoryId || undefined
            };

            console.log('Processed product data:', productData);

            const url = isEditing && selectedProduct?._id ? `/api/products/${selectedProduct._id}` : '/api/products';
            console.log('Sending request to:', url);

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save product');
            }

            await fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error instanceof Error ? error.message : 'An error occurred while saving the product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            images: [''],
            navbarCategoryId: '',
            categoryId: '',
            subcategoryId: '',
            catalogImage: null,
            catalogImages: [''],
        });
        setIsEditing(false);
        setSelectedProduct(null);
    };

    const fetchNavbarCategories = async () => {
        try {
            console.log('Fetching navbar categories...');
            const response = await fetch('/api/navbarcategories');

            // Log the raw response for debugging
            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Received navbar categories:', data);

                if (Array.isArray(data) && data.length > 0) {
                    setNavbarCategories(data);
                } else {
                    console.warn('Received empty or invalid navbar categories data:', data);
                }
            } else {
                console.error('Failed to fetch navbar categories:', response.status, response.statusText);
                // Try to get error details
                const errorText = await response.text();
                console.error('Error details:', errorText);
            }
        } catch (error) {
            console.error('Error fetching navbar categories:', error);
        }
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
                console.log('Fetched products:', data);
                setProducts(data.map((product: any) => ({
                    ...product,
                    categoryId: product.categoryId?._id || product.categoryId,
                    subcategoryId: product.subcategoryId?._id || product.subcategoryId
                })));
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
        console.log('Component mounted, fetching data...');
        fetchNavbarCategories();
        fetchCategories();
        fetchSubcategories();
        fetchProducts();
    }, []);

    // Add new filtered categories state
    const filteredCategories = categories.filter(
        cat => cat.navbarCategoryId === formData.navbarCategoryId
    );

    // Update filteredSubcategories to consider navbarCategoryId
    const filteredSubcategories = subcategories.filter(
        sub => sub.categoryId === formData.categoryId &&
            categories.find(cat => cat._id === sub.categoryId)?.navbarCategoryId === formData.navbarCategoryId
    );

    const handlePdfError = (pdfUrl: string) => {
        console.error('Failed to load PDF:', pdfUrl);
        setIsLoadingPdf(false);
        alert('Failed to load PDF. Please make sure it\'s a valid PDF file and properly uploaded.');

        // Try reloading with cache-busting
        const iframe = document.querySelector(`iframe[src="${pdfUrl}"]`) as HTMLIFrameElement;
        if (iframe) {
            const newUrl = `${pdfUrl}?t=${new Date().getTime()}`;
            iframe.src = newUrl;
        }
    };

    const handleCatalogImageUpload = async (index: number, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'catalog');

            const response = await fetch('/api/files', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload catalog image');
            }

            const data = await response.json();

            setFormData(prev => {
                const newCatalogImages = [...prev.catalogImages];
                newCatalogImages[index] = data.secure_url;
                return {
                    ...prev,
                    catalogImages: newCatalogImages,
                };
            });
        } catch (error) {
            console.error('Error uploading catalog image:', error);
            alert('Failed to upload catalog image');
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
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Navbar Category
                        </label>
                        <select
                            value={formData.navbarCategoryId}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    navbarCategoryId: e.target.value,
                                    categoryId: '',
                                    subcategoryId: '',
                                });
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a navbar category</option>
                            {navbarCategories.map((navbarCategory) => (
                                <option key={navbarCategory._id} value={navbarCategory._id}>
                                    {navbarCategory.name}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            disabled={!formData.navbarCategoryId}
                        >
                            <option value="">Select a category (optional)</option>
                            {filteredCategories.map((category) => (
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
                            disabled={!formData.categoryId}
                        >
                            <option value="">Select a subcategory (optional)</option>
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
                        <div className="flex items-center space-x-4">
                            <ImageUpload
                                value={formData.catalogImage || ''}
                                onChange={(url: string) => {
                                    console.log('Catalog image URL received:', url);
                                    setFormData(prevState => {
                                        const newState = {
                                            ...prevState,
                                            catalogImage: url
                                        };
                                        console.log('Updated form data:', newState);
                                        return newState;
                                    });
                                }}
                                label="Catalog Image"
                            />
                        </div>
                        {formData.catalogImage && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Catalog image uploaded successfully</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prevState => ({
                                            ...prevState,
                                            catalogImage: null
                                        }));
                                    }}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Remove catalog image
                                </button>
                            </div>
                        )}
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
                                        Navbar Category: {typeof product.navbarCategoryId === 'string'
                                            ? navbarCategories.find(nc => nc._id === product.navbarCategoryId)?.name || 'Unknown Navbar Category'
                                            : product.navbarCategoryId.name} |
                                        Category: {product.categoryId ? (categories.find(c =>
                                            String(c._id) === String(product.categoryId)
                                        )?.name || 'Unknown Category') : 'No Category'} |
                                        {product.subcategoryId ? `Subcategory: ${subcategories.find(s =>
                                            String(s._id) === String(product.subcategoryId)
                                        )?.name || 'Unknown Subcategory'} |` : ''}
                                        {product.catalogImage && (
                                            <button
                                                onClick={() => product.catalogImage && window.open(product.catalogImage, '_blank')}
                                                className="text-blue-600 hover:text-blue-700 underline ml-1"
                                            >
                                                View Catalog
                                            </button>
                                        )}
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
                                            navbarCategoryId: typeof product.navbarCategoryId === 'string' ? product.navbarCategoryId : product.navbarCategoryId?._id || '',
                                            name: product.name,
                                            images: product.images,
                                            categoryId: product.categoryId || '',
                                            subcategoryId: product.subcategoryId || '',
                                            catalogImage: product.catalogImage || null,
                                            catalogImages: product.catalogImages || [''],
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