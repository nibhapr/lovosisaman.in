"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { IoDownloadOutline, IoEyeOutline, IoStarOutline, IoStar } from 'react-icons/io5';
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Features */}
          {product.features?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Features</h2>
              <ul className="list-disc list-inside space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {specifications && Object.keys(specifications).length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Specifications</h2>
              <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 py-2 last:border-0">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catalogs Section */}
          <div className="space-y-4">
            {/* PDF Catalog */}
            {product.catalogPdf && (
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="font-semibold mb-3">PDF Catalog</h3>
                <div className="flex flex-col space-y-3">
                  <div className="h-40 border rounded-lg overflow-hidden cursor-pointer" onClick={() => setPdfPreviewOpen(true)}>
                    <iframe
                      src={`${product.catalogPdf}#toolbar=0&view=FitH`}
                      className="w-full h-full pointer-events-none"
                      title="PDF Preview"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPdfPreviewOpen(true)}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <IoEyeOutline className="w-5 h-5 mr-2" />
                      Preview PDF
                    </button>
                    <a
                      href={product.catalogPdf}
                      download
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="font-semibold mb-3">Excel Catalog</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaFileExcel className="w-10 h-10 text-green-600 mr-3" />
                    <span className="text-gray-600">Excel Specifications</span>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={product.catalogExcel}
                      download
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <IoDownloadOutline className="w-5 h-5 mr-2" />
                      Download Excel
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Product Reviews</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                star <= Math.round(averageRating) 
                  ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                  : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-6 mb-8">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{review.userName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    star <= review.rating 
                      ? <IoStar key={star} className="w-5 h-5 text-yellow-400" />
                      : <IoStarOutline key={star} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Review Form */}
        {product._id && <ReviewForm itemId={product._id} itemType="product" onSubmitSuccess={() => {
          // Refresh reviews after new submission
          fetchReviews();
        }} />}
      </div>

      {/* Preview Modals */}
      <FilePreviewModal
        isOpen={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        fileUrl={product.catalogPdf || ''}
        fileType="pdf"
      />
    </div>
  );
} 