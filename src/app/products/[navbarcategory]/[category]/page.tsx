import { connectDB } from '@/lib/db';
import Category from '@/app/models/Category';
import Subcategory from '@/app/models/Subcategory';
import Product from '@/app/models/Product';
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

async function getProducts(navbarCategoryId: string, categoryId: string) {
  try {
    await connectDB();
    return await Product.find({
      navbarCategoryId,
      categoryId,
      subcategoryId: { $exists: false }  // Only get products with no subcategory
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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
      <div className="container mx-auto px-4 py-12 bg-black text-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">Category not found</h1>
        <p className="text-gray-300">
          The category "{params.category}" does not exist.
        </p>
        <Link
          href={`/products/${params.navbarcategory}`}
          className="mt-4 text-blue-400 hover:text-blue-300 hover:underline"
        >
          &larr; Back to {params.navbarcategory}
        </Link>
      </div>
    );
  }

  const subcategories = await getSubcategories(category._id.toString());
  const products = await getProducts(category.navbarCategoryId.toString(), category._id.toString());

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{category.name}</h1>

        {category.description && (
          <p className="text-gray-300 mb-8">{category.description}</p>
        )}

        {/* Render subcategories if they exist */}
        {subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Subcategories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory._id}
                  href={`/products/${params.navbarcategory}/${params.category}/${subcategory.slug}`}
                  className="group"
                >
                  <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-blue-500/20 group-hover:-translate-y-1 border border-gray-800">
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
                      <h2 className="text-xl font-semibold mb-2 text-blue-400">{subcategory.name}</h2>
                      {subcategory.description && (
                        <p className="text-gray-400 line-clamp-2">{subcategory.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Always render products section if products exist */}
        {products.length > 0 && (
          <div>
            {subcategories.length > 0 && <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">Products</h2>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${params.navbarcategory}/${params.category}/_/${product.slug}`}
                  className="group"
                >
                  <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-blue-500/20 group-hover:-translate-y-1 border border-gray-800">
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.images?.[0] || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2 text-blue-400">{product.name}</h2>
                      {product.description && (
                        <p className="text-gray-400 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {subcategories.length === 0 && products.length === 0 && (
          <p className="text-gray-400">No subcategories or products found in this category.</p>
        )}
      </div>
    </div>
  );
}