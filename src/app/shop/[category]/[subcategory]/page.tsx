import { connectDB } from '@/lib/db';
import Subcategory from '@/app/models/Subcategory';
import Product from '@/app/models/Product';
import Image from 'next/image';
import Link from 'next/link';

async function getSubcategory(slug: string) {
  await connectDB();
  return await Subcategory.findOne({ slug });
}

async function getProducts(subcategoryId: string) {
  await connectDB();
  return await Product.find({ subcategoryId });
}

export default async function SubcategoryPage({ 
  params 
}: { 
  params: { category: string; subcategory: string } 
}) {
  const subcategory = await getSubcategory(params.subcategory);
  const products = subcategory ? await getProducts(subcategory._id) : [];

  if (!subcategory) {
    return <div>Subcategory not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Products in this{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {subcategory.name}
          </span>{" "}
          Subcategory
        </h1>
        <p className="text-gray-600">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {subcategory.description}
          </span>
          <br />
          <span className="text-sm mt-2 block">
            Browse our selection of high-quality products below.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/shop/${params.category}/${params.subcategory}/${product.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 w-full">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold group-hover:text-blue-600">
                  {product.name}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 