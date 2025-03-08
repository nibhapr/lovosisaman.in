import { connectDB } from '@/lib/db';
import Category from '@/app/models/Category';
import Image from 'next/image';
import Link from 'next/link';

async function getCategories() {
  await connectDB();
  return await Category.find({});
}

export default async function ShopPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/shop/${category.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold group-hover:text-blue-600">
                  {category.name}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 