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
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-6">
          Explore{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {subcategory.name}
          </span>
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg font-medium">
            {subcategory.description}
          </span>
          <br />
          <span className="text-base mt-4 block text-gray-600">
            Discover our premium selection of products crafted just for you.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/shop/${params.category}/${params.subcategory}/${product.slug}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="relative h-56 w-full">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors duration-300">
                  {product.name}
                </h2>
                <p className="text-gray-600 mt-3 line-clamp-2">
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