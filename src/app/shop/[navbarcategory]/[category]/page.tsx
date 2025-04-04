import { connectDB } from '@/lib/db';
import Category from '@/app/models/Category';
import Subcategory from '@/app/models/Subcategory';
import Image from 'next/image';
import Link from 'next/link';

async function getCategory(slug: string) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug });

    if (!category) {
      console.error(`Category with slug "${slug}" not found. Check the database for existing categories.`);
      console.log('Available categories:', await Category.find({}, { slug: 1, name: 1 }));
      return null;
    }

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getSubcategories(categoryId: string) {
  try {
    await connectDB();
    return await Subcategory.find({ categoryId });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

export default async function CategoryPage({
  params
}: {
  params: { navbarcategory: string, category: string }
}) {
  const category = await getCategory(params.category);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Category not found</h1>
        <p className="text-gray-700">
          The category "{params.category}" does not exist.
        </p>
        <Link
          href={`/shop/${params.navbarcategory}`}
          className="mt-4 text-blue-600 hover:underline"
        >
          &larr; Back to {params.navbarcategory}
        </Link>
      </div>
    );
  }

  const subcategories = await getSubcategories(category._id.toString());

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

      {category.description && (
        <p className="text-gray-700 mb-8">{category.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory._id}
            href={`/shop/${params.navbarcategory}/${params.category}/${subcategory.slug}`}
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