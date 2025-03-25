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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link 
            key={category._id} 
            href={`/shop/${category.slug}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="relative h-48 w-full">
                <Image
                  src={category.image || '/images/placeholder.jpg'}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                {category.description && (
                  <p className="text-gray-600 line-clamp-2">{category.description}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 