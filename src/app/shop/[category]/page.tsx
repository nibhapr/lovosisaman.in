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
  const subcategories = category ? await getSubcategories(category._id) : [];

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Products in this{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {category.name}
          </span>{" "}
          Category
        </h1>
        <p className="text-gray-600">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {category.description}
          </span>
          <br />
          <span className="text-sm mt-2 block">
            Browse our selection of products in the below subcategories of this{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {category.name}
            </span>{" "}
            category.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory._id}
            href={`/shop/${params.category}/${subcategory.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 w-full">
                <Image
                  src={subcategory.image}
                  alt={subcategory.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold group-hover:text-blue-600">
                  {subcategory.name}
                </h2>
                <p className="text-gray-600 mt-2">{subcategory.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 