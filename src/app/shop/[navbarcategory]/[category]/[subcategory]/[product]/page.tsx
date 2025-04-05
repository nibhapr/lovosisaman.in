"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { IoDownloadOutline, IoStarOutline, IoStar, IoClose } from 'react-icons/io5';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Product, Review } from '@/types/shop';

export default function ProductPage({
  params
}: {
  params: Promise<{ category: string; subcategory: string; product: string }>
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categoryName, setCategoryName] = useState<string>('');
  const [subcategoryName, setSubcategoryName] = useState<string>('');
  const resolvedParams = use(params);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [catalogImages, setCatalogImages] = useState<string[]>([]);
  const [currentCatalogIndex, setCurrentCatalogIndex] = useState(0);

  const fetchReviews = async () => {
    if (product?._id) {
      const response = await fetch(`/api/reviews?itemId=${product._id}&itemType=product`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/preview?slug=${resolvedParams.product}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Product data:', data);
        setProduct(data);

        // Handle single catalogImage path
        if (data.catalogImage) {
          console.log('Setting catalog image:', data.catalogImage);
          setCatalogImages([data.catalogImage]); // Convert single path to array
        } else {
          console.warn('No catalog image found');
          setCatalogImages([]);
        }

        // Fetch category and subcategory data
        if (data.categoryId) {
          const categoryRes = await fetch(`/api/categories/${data.categoryId}`);
          if (categoryRes.ok) {
            const categoryData = await categoryRes.json();
            setCategoryName(categoryData.name);
          }
        }

        if (data.subcategoryId) {
          const subcategoryRes = await fetch(`/api/subcategories/${data.subcategoryId}`);
          if (subcategoryRes.ok) {
            const subcategoryData = await subcategoryRes.json();
            setSubcategoryName(subcategoryData.name);
          }
        }
      } else {
        console.error('Failed to fetch product data:', response.status);
      }
    }
    fetchProduct();
  }, [resolvedParams.product]);

  useEffect(() => {
    fetchReviews();
  }, [product?._id]);

  useEffect(() => {
    if (isReviewsOpen || isContactFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReviewsOpen, isContactFormOpen]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading product information...</div>
      </div>
    );
  }

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const response = await fetch('/api/catalog-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          companyName: formData.get('companyName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          productName: product?.name,
          catalogImages: catalogImages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create catalog request');
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Show success message
      alert('Request submitted successfully!');

      // Close form after successful submission
      setIsContactFormOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create catalog request: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Render breadcrumbs navigation
  const renderBreadcrumbs = () => (
    <div className="container mx-auto px-4 py-3">
      <nav className="text-sm text-gray-500 flex items-center">
        {categoryName && (
          <>
            <span className="hover:text-gray-700 transition-colors">{categoryName}</span>
            <span className="mx-2">/</span>
          </>
        )}
        {subcategoryName && (
          <>
            <span className="hover:text-gray-700 transition-colors">{subcategoryName}</span>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">{product?.name}</span>
      </nav>
    </div>
  );

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= Math.round(rating) ? (
            <IoStar className="w-4 h-4 text-yellow-400" />
          ) : (
            <IoStarOutline className="w-4 h-4 text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 w-full">
        {renderBreadcrumbs()}
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
            {product.name}
          </h1>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Side */}
          <div className="space-y-6 mx-auto w-full max-w-md">
            {/* Main Product Image */}
            <div className="group">
              <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-100 shadow-md h-[450px]">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Image Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-md overflow-hidden
                      ${currentImageIndex === index ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200'}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Catalog Request Button */}
            <button
              onClick={() => setIsContactFormOpen(true)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <IoDownloadOutline className="w-4 h-4" />
              Request Product Catalog
            </button>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-yellow-400 rounded-full"></span>
                    Customer Reviews
                  </h2>
                </div>
                <button
                  onClick={() => setIsReviewsOpen(true)}
                  className="px-4 py-1.5 bg-yellow-400 text-white text-sm rounded-lg hover:bg-yellow-500"
                >
                  Write a Review
                </button>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {renderStars(averageRating)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${(averageRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.slice(0, 2).map((review) => (
                    <div
                      key={review._id}
                      className="bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xs">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{review.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-xs">
                        {review.comment.substring(0, 100)}{review.comment.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">No reviews yet</p>
                  </div>
                )}

                {reviews.length > 2 && (
                  <button
                    onClick={() => setIsReviewsOpen(true)}
                    className="w-full py-2 text-blue-600 bg-blue-50 rounded-lg text-sm hover:bg-blue-100"
                  >
                    See all {reviews.length} reviews
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Catalog Preview */}
          <div className="mx-auto w-full max-w-md">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100 min-h-[550px]">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                Product Catalog
              </h2>

              <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-100 bg-white">
                {catalogImages.length > 0 ? (
                  <div className="relative h-full">
                    <Image
                      src={catalogImages[currentCatalogIndex]}
                      alt={`${product.name} Catalog Page ${currentCatalogIndex + 1}`}
                      fill
                      className="object-contain"
                    />

                    {catalogImages.length > 1 && (
                      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                        {catalogImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentCatalogIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all
                              ${currentCatalogIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                            aria-label={`View catalog page ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">No catalog images available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewsOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300" />
          <div className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full shadow-lg animate-modalSlideIn max-h-[calc(100vh-120px)] flex flex-col">
              <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10 rounded-t-lg">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Product Reviews</h2>
                  <p className="text-xs text-gray-500 mt-1">Share your experience with others</p>
                </div>
                <button
                  onClick={() => setIsReviewsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3 mb-4">
                  {reviews.length > 0 ? (
                    <>
                      <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-xs">
                                {reviews[0].name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">{reviews[0].name}</h3>
                              <p className="text-xs text-gray-500">
                                {new Date(reviews[0].createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                            <div className="flex">
                              {renderStars(reviews[0].rating)}
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {reviews[0].rating}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-xs bg-gray-50 p-2 rounded-lg">{reviews[0].comment}</p>
                      </div>

                      {reviews.length > 1 && (
                        <button
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-blue-600 hover:text-blue-700 text-xs font-medium transition-all flex items-center justify-center gap-2"
                        >
                          {showAllReviews ? (
                            <>
                              Show Less
                              <svg className="w-3 h-3 transition-transform duration-300 -rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              Show {reviews.length - 1} More {reviews.length - 1 === 1 ? 'Review' : 'Reviews'}
                              <svg className="w-3 h-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>
                      )}

                      {showAllReviews && (
                        <div className="space-y-3 animate-fadeIn">
                          {reviews.slice(1).map((review: Review) => (
                            <div
                              key={review._id}
                              className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-xs">
                                      {review.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900 text-sm">{review.name}</h3>
                                    <p className="text-xs text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                  <div className="flex">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-xs font-medium text-gray-700">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 text-xs bg-gray-50 p-2 rounded-lg">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium text-sm">No reviews yet.</p>
                      <p className="text-gray-400 text-xs">Be the first to review this product!</p>
                    </div>
                  )}
                </div>

                {product._id && (
                  <div className="border-t pt-4">
                    <ReviewForm itemId={product._id} itemType="product" onSubmitSuccess={fetchReviews} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300" />
          <div className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-lg animate-modalSlideIn">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Request Catalog</h2>
                <button
                  onClick={() => setIsContactFormOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <IoClose className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-xs font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter your phone number"
                  />
                </div>

                <p className="text-xs text-gray-500 italic">
                  We'll send the catalog to your email address & phone number.
                </p>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs shadow-sm"
                >
                  Submit & Download
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        iframe {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}