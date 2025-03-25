"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { IoDownloadOutline, IoEyeOutline, IoStarOutline, IoStar, IoClose } from 'react-icons/io5';
import FilePreviewModal from '@/app/Components/shop/FilePreviewModal';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Product, Review } from '@/types/shop';
import Link from 'next/link';

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

  // Move fetchReviews outside useEffect
  const fetchReviews = async () => {
    if (product?._id) {
      const response = await fetch(`/api/reviews?itemId=${product._id}&itemType=product`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    }
  };

  const fetchCategoryAndSubcategory = async () => {
    if (product?.categoryId && product?.subcategoryId) {
      const [categoryRes, subcategoryRes] = await Promise.all([
        fetch(`/api/categories/${product.categoryId}`),
        fetch(`/api/subcategories/${product.subcategoryId}`)
      ]);

      if (categoryRes.ok && subcategoryRes.ok) {
        const categoryData = await categoryRes.json();
        const subcategoryData = await subcategoryRes.json();
        setCategoryName(categoryData.name);
        setSubcategoryName(subcategoryData.name);
      }
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/preview?slug=${resolvedParams.product}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    }
    fetchProduct();
  }, [resolvedParams.product]);

  useEffect(() => {
    fetchReviews();
  }, [product?._id]);

  useEffect(() => {
    fetchCategoryAndSubcategory();
  }, [product?.categoryId, product?.subcategoryId]);

  // Add useEffect to handle body scroll
  useEffect(() => {
    if (isReviewsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReviewsOpen]);

  if (!product) {
    return <div>Loading...</div>;
  }

  // Convert specifications Map to an object if needed
  const specifications = product.specifications instanceof Map
    ? Object.fromEntries(product.specifications)
    : product.specifications;

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Parallax background effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
      </div>

      {/* Enhanced Breadcrumb with animated underline */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-[0_8px_32px_rgba(31,_38,_135,_0.1)] border border-white/20">
          {categoryName && (
            <>
              <Link
                href={`/shop/${resolvedParams.category}`}
                className="text-blue-600 hover:text-blue-800 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {categoryName}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          {subcategoryName && (
            <>
              <Link
                href={`/shop/${resolvedParams.category}/${resolvedParams.subcategory}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {subcategoryName}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-800 font-medium">{product.name}</span>
        </ol>
      </nav>

      {/* Main grid with staggered animation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery with perspective effect */}
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] transition-all duration-500 transform hover:-translate-y-1 perspective-1000">
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
              style={{ transform: `rotateY(${currentImageIndex === index ? 0 : 10}deg)` }}
            >
              <Image
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Enhanced navigation arrows */}
          {product.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={() => setCurrentImageIndex(prev =>
                  prev === 0 ? product.images.length - 1 : prev - 1
                )}
                className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev =>
                  prev === product.images.length - 1 ? 0 : prev + 1
                )}
                className="p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                →
              </button>
            </div>
          )}

          {/* Enhanced image indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentImageIndex === index
                    ? 'bg-white scale-110 shadow-lg'
                    : 'bg-white/50 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product info with typewriter effect */}
        <div className="space-y-8 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-[0_8px_32px_rgba(31,_38,_135,_0.1)] border border-white/20 hover:shadow-[0_8px_32px_rgba(31,_38,_135,_0.2)] transition-all duration-500">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-blue-600">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed animate-fadeIn">{product.description}</p>
          </div>

          {/* Features with staggered animation */}
          {product.features?.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slideIn">
                Features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feature: string, index: number) => (
                  <li 
                    key={index} 
                    className="flex items-center space-x-3 bg-white/90 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications with accordion effect */}
          {specifications && Object.keys(specifications).length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-slideIn">
                Specifications
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(specifications).map(([key, value], index) => (
                  <div 
                    key={key} 
                    className="flex justify-between py-3 px-4 bg-white/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Catalogs Section with glowing effect */}
      <div className="space-y-4 mt-12">
        {product.catalogPdf && (
          <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-[0_8px_32px_rgba(31,_38,_135,_0.1)] border border-white/20 relative overflow-hidden">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,_102,_241,_0.1),_transparent)] animate-pulse"></div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 relative z-10">PDF Catalog</h3>
            <div className="flex flex-wrap gap-3 relative z-10">
              <button
                onClick={() => setIsContactFormOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Button glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,_255,_255,_0.3),_transparent)] opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <IoDownloadOutline className="w-5 h-5 mr-2" />
                Download Catalog
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section with particle effect */}
      <div className="mt-16 relative">
        {/* Particle container */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <button
          onClick={() => setIsReviewsOpen(true)}
          className="flex flex-col sm:flex-row items-center justify-between bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-[0_8px_32px_rgba(31,_38,_135,_0.1)] hover:shadow-[0_8px_32px_rgba(31,_38,_135,_0.2)] transition-all duration-500 transform hover:-translate-y-1 w-full border border-white/20 relative overflow-hidden"
        >
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Reviews</h2>
            <p className="text-gray-500">Share your thoughts about this product</p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= Math.round(averageRating)
                    ? <IoStar key={star} className="w-6 h-6 text-yellow-400" />
                    : <IoStarOutline key={star} className="w-6 h-6 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-900">({reviews.length})</span>
            </div>
            <div className="text-sm text-gray-500">
              {averageRating.toFixed(1)} out of 5
            </div>
          </div>
        </button>
      </div>

      {/* Reviews Modal with enhanced glass morphism */}
      {isReviewsOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40 transition-all duration-300" />
          <div className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl max-w-3xl w-full shadow-[0_8px_32px_rgba(31,_38,_135,_0.2)] animate-modalSlideIn max-h-[calc(100vh-120px)] flex flex-col border border-white/20">
              {/* Modal Header - Sticky */}
              <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between z-10 rounded-t-xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Product Reviews</h2>
                  <p className="text-sm text-gray-500 mt-1">Share your experience with others</p>
                </div>
                <button
                  onClick={() => setIsReviewsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Existing Reviews */}
                <div className="space-y-6 mb-8">
                  {reviews.length > 0 ? (
                    <>
                      {/* Show first review with enhanced styling */}
                      <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-lg">
                                {reviews[0].name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{reviews[0].name}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(reviews[0].createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                star <= reviews[0].rating
                                  ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                                  : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700 ml-2">
                              {reviews[0].rating}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{reviews[0].comment}</p>
                      </div>

                      {/* Enhanced Show More button */}
                      {reviews.length > 1 && (
                        <button
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-sm"
                        >
                          {showAllReviews ? (
                            <>
                              Show Less
                              <svg className="w-4 h-4 transition-transform duration-300 -rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              Show {reviews.length - 1} More {reviews.length - 1 === 1 ? 'Review' : 'Reviews'}
                              <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>
                      )}

                      {/* Additional reviews with smooth animation */}
                      {showAllReviews && (
                        <div className="space-y-4 animate-fadeIn">
                          {reviews.slice(1).map((review: Review) => (
                            <div
                              key={review._id}
                              className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-lg">
                                      {review.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{review.name}</h3>
                                    <p className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      star <= review.rating
                                        ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                                        : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 ml-2">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <div className="text-gray-400 mb-3">
                        <svg className="w-12 h-12 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No reviews yet.</p>
                      <p className="text-gray-400 text-sm">Be the first to review this product!</p>
                    </div>
                  )}
                </div>

                {/* Review Form */}
                {product._id && (
                  <div className="border-t pt-6">
                    <ReviewForm itemId={product._id} itemType="product" onSubmitSuccess={fetchReviews} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Contact Form Modal with glass morphism */}
      {isContactFormOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40 transition-all duration-300" />
          <div className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl max-w-md w-full shadow-[0_8px_32px_rgba(31,_38,_135,_0.2)] animate-modalSlideIn border border-white/20">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Download Catalog</h2>
                <button
                  onClick={() => setIsContactFormOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

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
                      productName: product.name,
                      catalogUrl: product.catalogPdf
                    })
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.error || 'Failed to submit request');
                  }

                  alert('Thank you! We will send the catalog to your email id or phone number shortly.');
                  setIsContactFormOpen(false);
                } catch (error) {
                  console.error('Error:', error);
                  alert('Failed to submit request. Please try again.');
                }
              }} className="p-6 space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <p className="text-sm text-gray-500 italic">
                  We'll send the catalog to your email address & phone number.
                </p>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Submit & Download
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 