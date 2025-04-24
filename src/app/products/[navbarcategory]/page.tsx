import { connectDB } from '@/lib/db';
import NavbarCategory from '@/app/models/NavbarCategory';
import Category from '@/app/models/Category';
import Product from '@/app/models/Product';
import Image from 'next/image';
import Link from 'next/link';

async function getNavbarCategory(slug: string) {
  await connectDB();
  return await NavbarCategory.findOne({ slug });
}

async function getCategories(navbarCategoryId: string) {
  await connectDB();
  return await Category.find({ navbarCategoryId });
}

async function getProducts(navbarCategoryId: string) {
  await connectDB();
  return await Product.find({ 
    navbarCategoryId,
    categoryId: { $exists: false },
    subcategoryId: { $exists: false }
  }).lean();
}

export default async function NavbarCategoryPage({
  params
}: {
  params: { navbarcategory: string }
}) {
  const navbarCategory = await getNavbarCategory(params.navbarcategory);

  if (!navbarCategory) {
    return <div className="container mx-auto px-4 py-12">Navbar Category not found</div>;
  }

  const categories = await getCategories(navbarCategory._id.toString());
  const uncategorizedProducts = await getProducts(navbarCategory._id.toString());

  return (
    <div className="container mx-auto px-4 py-12 bg-black min-h-screen">
      <div className="mb-8">
        <nav className="flex space-x-2 text-sm text-gray-400">
          <Link href="/products" className="hover:text-blue-400 hover:underline">
            Products
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300">{navbarCategory.name}</span>
        </nav>
      </div>

      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        {navbarCategory.name}
      </h1>
      {navbarCategory.description && (
        <p className="text-gray-300 mb-8">{navbarCategory.description}</p>
      )}

      {categories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products/${params.navbarcategory}/${category.slug}`}
                className="group"
              >
                <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-gray-800">
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
                    <h2 className="text-xl font-semibold mb-2 text-gray-100">{category.name}</h2>
                    {category.description && (
                      <p className="text-gray-400 line-clamp-2">{category.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {uncategorizedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Other Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uncategorizedProducts.map((product) => (
              <Link
                key={product._id as string}
                href={`/products/${params.navbarcategory}/_/_/${product.slug}`}
                className="group"
              >
                <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-gray-800">
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
                    <h2 className="text-xl font-semibold mb-2 text-gray-100">{product.name}</h2>
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
    </div>
  );
}
