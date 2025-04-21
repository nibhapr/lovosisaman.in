import { connectDB } from '@/lib/db';
import NavbarCategory from '@/app/models/NavbarCategory';
import Category from '@/app/models/Category';
import Image from 'next/image';
import Link from 'next/link';


async function getNavbarCategories() {
  await connectDB();
  return await NavbarCategory.find({});
}

async function getCategories() {
  await connectDB();
  return await Category.find({});
}

export default async function ShopPage() {
  const navbarCategories = await getNavbarCategories();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Categories</h1>

      {/* Desktop View */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {navbarCategories.map((navbarCategory) => {
          const categoryItems = categories.filter(
            (category) => category.navbarCategoryId === navbarCategory._id.toString()
          );

          return (
            <div key={navbarCategory._id.toString()} className="mb-12">
              <Link href={`/products/${navbarCategory.slug}`} className="block">
                <h2 className="text-xl font-semibold mb-4 text-blue-600 hover:underline">
                  {navbarCategory.name}
                </h2>

                {navbarCategory.image && (
                  <div className="relative h-32 w-full mb-4">
                    <Image
                      src={navbarCategory.image.startsWith('/api/files/')
                        ? `https://${process.env.NEXT_PUBLIC_DOMAIN}${navbarCategory.image}`
                        : navbarCategory.image}
                      alt={navbarCategory.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}

                {navbarCategory.description && (
                  <p className="text-gray-600 mb-4">{navbarCategory.description}</p>
                )}
              </Link>
              
              {/* Display categories under this navbar category */}
              {categoryItems.length > 0 && (
                <div className="ml-4 mt-2">
                  <ul className="space-y-2">
                    {categoryItems.map((category) => (
                      <li key={category._id.toString()}>
                        <Link 
                          href={`/products/${navbarCategory.slug}/${category.slug}`}
                          className="text-gray-700 hover:text-blue-600 hover:underline text-sm"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden grid grid-cols-1 gap-4">
        {navbarCategories.map((navbarCategory) => {
          const categoryItems = categories.filter(
            (category) => category.navbarCategoryId === navbarCategory._id.toString()
          );

          return (
            <div key={navbarCategory._id.toString()} className="mb-6">
              <Link href={`/products/${navbarCategory.slug}`} className="block">
                <h2 className="text-xl font-semibold mb-4 text-blue-600 hover:underline">
                  {navbarCategory.name}
                </h2>

                {navbarCategory.image && (
                  <div className="relative h-40 w-full mb-4">
                    <Image
                      src={navbarCategory.image.startsWith('/api/files/')
                        ? `https://${process.env.NEXT_PUBLIC_DOMAIN}${navbarCategory.image}`
                        : navbarCategory.image}
                      alt={navbarCategory.name}
                      fill
                      sizes="100vw"
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}

                {navbarCategory.description && (
                  <p className="text-gray-600 mb-4">{navbarCategory.description}</p>
                )}
              </Link>
              
              {/* Display categories under this navbar category for mobile */}
              {categoryItems.length > 0 && (
                <div className="ml-2 mt-1">
                  <ul className="space-y-2">
                    {categoryItems.map((category) => (
                      <li key={category._id.toString()}>
                        <Link 
                          href={`/products/${navbarCategory.slug}/${category.slug}`}
                          className="text-gray-700 hover:text-blue-600 hover:underline text-sm"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}