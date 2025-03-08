"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { IoDownloadOutline, IoEyeOutline } from 'react-icons/io5';
import { FaFileExcel } from 'react-icons/fa';
import FilePreviewModal from '@/app/Components/shop/FilePreviewModal';
import type { Product } from '@/types/shop';

export default function ProductPage({
  params
}: {
  params: Promise<{ category: string; subcategory: string; product: string }>
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const resolvedParams = use(params);

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

  if (!product) {
    return <div>Loading...</div>;
  }

  // Convert specifications Map to an object if needed
  const specifications = product.specifications instanceof Map
    ? Object.fromEntries(product.specifications)
    : product.specifications;

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