"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { IoDownloadOutline, IoEyeOutline, IoStarOutline, IoStar, IoClose } from 'react-icons/io5';
import { FaFileExcel } from 'react-icons/fa';
import FilePreviewModal from '@/app/Components/shop/FilePreviewModal';
import ReviewForm from '@/app/Components/shared/ReviewForm';
import type { Product, Review } from '@/types/shop';

export default function ProductPage({
  params
}: {
  params: Promise<{ category: string; subcategory: string; product: string }>
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const resolvedParams = use(params);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images - Enhanced container */}
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-xl overflow-hidden bg-gray-100 shadow-lg">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>

        {/* Product Info - Enhanced styling */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Features - Enhanced styling */}
          {product.features?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications - Enhanced styling */}
          {specifications && Object.keys(specifications).length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Specifications</h2>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catalogs Section - Enhanced styling */}
          <div className="space-y-4">
            {/* PDF Catalog */}
            {product.catalogPdf && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">PDF Catalog</h3>
                <div className="space-y-4">
                  <div 
                    className="h-48 border rounded-lg overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-200 shadow-sm" 
                    onClick={() => setPdfPreviewOpen(true)}
                  >
                    <iframe
                      src={`${product.catalogPdf}#toolbar=0&view=FitH`}
                      className="w-full h-full pointer-events-none"
                      title="PDF Preview"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setPdfPreviewOpen(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <IoEyeOutline className="w-5 h-5 mr-2" />
                      Preview PDF
                    </button>
                    <a
                      href={product.catalogPdf}
                      download
                      className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <IoDownloadOutline className="w-5 h-5 mr-2" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Excel Catalog */}
            {product.catalogExcel && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Excel Catalog</h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <FaFileExcel className="w-10 h-10 text-green-600 mr-3" />
                    <span className="text-gray-700">Excel Specifications</span>
                  </div>
                  <a
                    href={product.catalogExcel}
                    download
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <IoDownloadOutline className="w-5 h-5 mr-2" />
                    Download Excel
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section - Enhanced styling */}
      <div className="mt-16">
        <button 
          onClick={() => setIsReviewsOpen(true)}
          className="flex flex-col sm:flex-row items-center justify-between bg-white p-8 rounded-xl shadow-sm hover:bg-gray-50 transition-colors w-full border border-gray-100 gap-4"
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

      {/* Reviews Modal - Updated styles */}
      {isReviewsOpen && (
        <>
          {/* Blur Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-all duration-300" />
          
          {/* Modal Content - Increased top spacing */}
          <div className="fixed inset-x-0 top-[100px] bottom-0 z-50 flex items-start justify-center overflow-hidden p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full shadow-2xl animate-modalSlideIn max-h-[calc(100vh-120px)] flex flex-col">
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

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        fileUrl={product.catalogPdf || ''}
        fileType="pdf"
      />
    </div>
  );
} 