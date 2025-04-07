"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/lovosis logo.png';

// Update the interfaces
interface Product {
  id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

interface NavbarCategory {
  id: string;
  name: string;
  slug: string;
  categories: Category[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add new state for tracking expanded items
  const [expandedNavbarCategory, setExpandedNavbarCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);

  // Add state for mega menu
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all three endpoints in parallel
        const [navbarResponse, categoriesResponse, subcategoriesResponse] = await Promise.all([
          fetch('/api/navbarcategories'),
          fetch('/api/categories'),
          fetch('/api/subcategories')
        ]);

        const navbarData = await navbarResponse.json();
        const categoriesData = await categoriesResponse.json();
        const subcategoriesData = await subcategoriesResponse.json();

        // Combine the data into a hierarchical structure
        const formattedData = navbarData.map((navbarCategory: any) => ({
          id: navbarCategory._id || '',
          name: navbarCategory.name || '',
          slug: navbarCategory.slug || '',
          categories: categoriesData
            .filter((category: any) => category.navbarCategoryId === navbarCategory._id)
            .map((category: any) => ({
              id: category._id || '',
              name: category.name || '',
              slug: category.slug || '',
              subCategories: subcategoriesData
                .filter((subcategory: any) => subcategory.categoryId === category._id)
                .map((subcategory: any) => ({
                  id: subcategory._id || '',
                  name: subcategory.name || '',
                  slug: subcategory.slug || '',
                  products: [] // Add products if needed
                }))
            }))
        }));

        setNavbarCategories(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNavbarCategories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const megaMenu = document.getElementById('mega-menu');
      const megaMenuButton = document.getElementById('mega-menu-button');

      if (megaMenu && megaMenuButton) {
        if (!megaMenu.contains(event.target as Node) &&
          !megaMenuButton.contains(event.target as Node)) {
          setIsMegaMenuOpen(false);
          setExpandedNavbarCategory(null);
          setExpandedCategory(null);
          setExpandedSubCategory(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Toggle mega menu
  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
    if (!isMegaMenuOpen) {
      // Reset expanded states when opening
      setExpandedNavbarCategory(null);
      setExpandedCategory(null);
      setExpandedSubCategory(null);
    }
  };

  // Add click handlers
  const handleNavbarCategoryClick = (navbarCategoryId: string) => {
    setExpandedNavbarCategory(expandedNavbarCategory === navbarCategoryId ? null : navbarCategoryId);
    // Reset category expansion when changing navbar category
    setExpandedCategory(null);
    setExpandedSubCategory(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    // Reset subcategory expansion when changing category
    setExpandedSubCategory(null);
  };


  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-bold text-white flex items-center gap-2 hover:text-indigo-400 transition-all duration-300">
              <Image
                src={logo.src}
                alt="Lovosis Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">lovosis</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {['About', 'Services'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="px-3 py-2 text-gray-300 hover:text-white rounded hover:bg-slate-800 transition-all duration-200 mx-1"
              >
                {item}
              </Link>
            ))}

            {/* Products Mega Menu Button */}
            <div className="relative mx-1">
              <button
                id="mega-menu-button"
                onClick={toggleMegaMenu}
                className="px-3 py-2 text-gray-300 hover:text-white rounded hover:bg-slate-800 transition-all duration-200 flex items-center gap-1"
              >
                Products
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Menu */}
              {isMegaMenuOpen && (
                <div
                  id="mega-menu"
                  className="absolute -left-96 mt-2 w-[900px] bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/30 p-6 grid grid-cols-3 gap-6 transition-all duration-300 ease-in-out z-50"
                >
                  {loading ? (
                    <div className="col-span-3 text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400 mx-auto"></div>
                      <p className="mt-2 text-gray-400">Loading products...</p>
                    </div>
                  ) : navbarCategories.length > 0 ? (
                    <>
                      {/* NavbarCategory Column */}
                      <div className="space-y-3 border-r border-slate-700/30 pr-6">
                        <h3 className="text-xs text-indigo-400 uppercase tracking-wider mb-6 font-semibold pl-2">Product Groups</h3>
                        <div className="space-y-1">
                          {navbarCategories.map((navbarCategory) => (
                            <div
                              key={navbarCategory.id}
                              onClick={() => handleNavbarCategoryClick(navbarCategory.id)}
                              className={`font-medium text-gray-300 hover:text-white cursor-pointer flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${expandedNavbarCategory === navbarCategory.id
                                ? 'bg-gradient-to-r from-slate-700/90 to-slate-700/50 text-white shadow-lg'
                                : 'hover:bg-slate-700/40 hover:shadow-md'
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                {navbarCategory.name}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 transition-transform duration-300 ${expandedNavbarCategory === navbarCategory.id ? 'rotate-180 text-indigo-400' : 'text-gray-500'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Category Column */}
                      <div className={`space-y-3 border-r border-slate-700/30 pr-6 transition-all duration-300 ${expandedNavbarCategory ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}>
                        {expandedNavbarCategory && (
                          <>
                            <h3 className="text-xs text-indigo-400 uppercase tracking-wider mb-6 font-semibold pl-2">Categories</h3>
                            <div className="space-y-1">
                              {navbarCategories
                                .find(nc => nc.id === expandedNavbarCategory)
                                ?.categories.map((category) => (
                                  <div
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`font-medium text-gray-300 hover:text-white cursor-pointer flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${expandedCategory === category.id
                                      ? 'bg-gradient-to-r from-slate-700/90 to-slate-700/50 text-white shadow-lg'
                                      : 'hover:bg-slate-700/40 hover:shadow-md'
                                      }`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                      {category.name}
                                    </span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className={`h-4 w-4 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180 text-purple-400' : 'text-gray-500'}`}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* SubCategory Column */}
                      <div className={`space-y-3 transition-all duration-300 ${expandedCategory ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}>
                        {expandedCategory && expandedNavbarCategory && (
                          <>
                            <h3 className="text-xs text-indigo-400 uppercase tracking-wider mb-6 font-semibold pl-2">Sub Categories</h3>
                            <div className="space-y-1">
                              {navbarCategories
                                .find(nc => nc.id === expandedNavbarCategory)
                                ?.categories
                                .find(c => c.id === expandedCategory)
                                ?.subCategories.map((subCategory) => (
                                  <Link
                                    key={subCategory.id}
                                    href={`/products/${navbarCategories.find(nc => nc.id === expandedNavbarCategory)?.slug}/${navbarCategories.find(nc => nc.id === expandedNavbarCategory)?.categories.find(c => c.id === expandedCategory)?.slug}/${subCategory.slug}`}
                                    className={`text-gray-300 hover:text-white flex items-center gap-2 p-3 rounded-lg hover:bg-slate-700/40 transition-all duration-200 hover:shadow-md group`}
                                    onClick={() => {
                                      setIsMegaMenuOpen(false);
                                      setExpandedNavbarCategory(null);
                                      setExpandedCategory(null);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                    {subCategory.name}
                                  </Link>
                                ))}
                            </div>
                          </>
                        )}
                      </div>

                    </>
                  ) : (
                    <div className="col-span-3 text-center py-8 bg-gradient-to-b from-slate-700/30 to-slate-700/10 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-gray-400">No categories available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {['Blogs', 'Events', 'Gallery'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="px-3 py-2 text-gray-300 hover:text-white rounded hover:bg-slate-800 transition-all duration-200 mx-1"
              >
                {item}
              </Link>
            ))}

            <Link
              href="/contact"
              className="ml-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none transition duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
            overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-slate-700 mt-1">
            {['About', 'Services', 'Products'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800 transition duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}

            {['Blogs', 'Events', 'Gallery'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800 transition duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}

            <Link
              href="/contact"
              className="block px-3 py-2 mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 transition duration-200"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;