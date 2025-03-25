import { connectDB } from '@/lib/db';
import Category from '@/app/models/Category';
import Subcategory from '@/app/models/Subcategory';
import Image from 'next/image';
import Link from 'next/link';

async function getCategory(slug: string) {
  await connectDB();
  return await Category.findOne({ slug });
}

async function getSubcategories(categoryId: string) {
  await connectDB();
  return await Subcategory.find({ categoryId });
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategory(params.category);
  
  if (!category) {
    return <div className="container mx-auto px-4 py-12">Category not found</div>;
  }
  
  const subcategories = await getSubcategories(category._id.toString());

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/shop" className="text-blue-600 hover:underline">
          ← Back to Categories
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      
      {category.description && (
        <p className="text-gray-700 mb-8">{category.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subcategories.map((subcategory) => (
          <Link 
            key={subcategory._id} 
            href={`/shop/${params.category}/${subcategory.slug}`}
            className="group"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="relative h-48 w-full">
                <Image
                  src={subcategory.image || '/images/placeholder.jpg'}
                  alt={subcategory.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{subcategory.name}</h2>
                {subcategory.description && (
                  <p className="text-gray-600 line-clamp-2">{subcategory.description}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 