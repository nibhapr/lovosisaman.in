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
    <nav className="bg-black text-white sticky top-0 z-50 backdrop-blur-sm border-b border-zinc-900 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="text-3xl font-bold flex items-center gap-3 group"
            >
              <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logo.src}
                  alt="Lovosis Logo"
                  width={60}
                  height={45}
                  className="object-contain"
                />
              </div>
              {/* <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent font-extrabold">
                lovosis
              </span> */}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {['About', 'Services'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="px-4 py-2 text-gray-500 hover:text-blue-400 rounded-lg hover:bg-black/60 transition-all duration-300 mx-1 font-medium"
              >
                {item}
              </Link>
            ))}

            {/* Products Mega Menu Button */}
            <div className="relative mx-1">
              <button
                id="mega-menu-button"
                onClick={toggleMegaMenu}
                className="px-4 py-2 text-gray-500 hover:text-blue-400 rounded-lg hover:bg-black/60 transition-all duration-300 flex items-center gap-2 font-medium group"
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
                  className="absolute -left-96 mt-2 w-[900px] bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-900 p-6 grid grid-cols-3 gap-6 transition-all duration-300 ease-in-out z-50"
                >
                  {loading ? (
                    <div className="col-span-3 text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading products...</p>
                    </div>
                  ) : navbarCategories.length > 0 ? (
                    <>
                      {/* NavbarCategory Column */}
                      <div className="space-y-3 border-r border-zinc-900 pr-6">
                        <h3 className="text-xs bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent uppercase tracking-wider mb-6 font-semibold pl-2">Product Groups</h3>
                        
                        <div className="space-y-1">
                          {navbarCategories.map((navbarCategory) => (
                            <div
                              key={navbarCategory.id}
                              className={`font-medium text-gray-400 hover:text-white flex items-center justify-between p-3 rounded-lg ${
                                expandedNavbarCategory === navbarCategory.id
                                  ? 'bg-zinc-900'
                                  : 'hover:bg-zinc-900'
                              }`}
                            >
                              <Link
                                href={`/products/${navbarCategory.slug}`}
                                className="flex items-center gap-2 flex-grow"
                                onClick={() => {
                                  setIsMegaMenuOpen(false);
                                  setExpandedNavbarCategory(null);
                                  setExpandedCategory(null);
                                }}
                              >
                                {navbarCategory.name}
                              </Link>
                              <button
                                onClick={() => handleNavbarCategoryClick(navbarCategory.id)}
                                className="p-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Category and SubCategory columns remain similar with updated colors */}
                      <div className="space-y-3 border-r border-zinc-800 pr-6">
                        {expandedNavbarCategory && (
                          <>
                            <h3 className="text-xs text-blue-400 uppercase tracking-wider mb-6 font-semibold pl-2">Categories</h3>
                            <div className="space-y-1">
                              {navbarCategories
                                .find(nc => nc.id === expandedNavbarCategory)
                                ?.categories.map((category) => (
                                  <div
                                    key={category.id}
                                    className={`font-medium text-white flex items-center justify-between p-3 rounded-lg ${
                                      expandedCategory === category.id
                                        ? 'bg-zinc-900'
                                        : 'hover:bg-zinc-900'
                                    }`}
                                  >
                                    <Link 
                                      href={`/products/${navbarCategories.find(nc => nc.id === expandedNavbarCategory)?.slug}/${category.slug}`}
                                      className="flex items-center gap-2 flex-grow"
                                      onClick={() => {
                                        setIsMegaMenuOpen(false);
                                        setExpandedNavbarCategory(null);
                                        setExpandedCategory(null);
                                      }}
                                    >
                                      {category.name}
                                    </Link>
                                    <button
                                      onClick={() => handleCategoryClick(category.id)}
                                      className="p-1"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* SubCategory Column */}
                      <div className="space-y-3">
                        {expandedCategory && expandedNavbarCategory && (
                          <>
                            <h3 className="text-xs text-blue-400 uppercase tracking-wider mb-6 font-semibold pl-2">Sub Categories</h3>
                            <div className="space-y-1">
                              {navbarCategories
                                .find(nc => nc.id === expandedNavbarCategory)
                                ?.categories
                                .find(c => c.id === expandedCategory)
                                ?.subCategories.map((subCategory) => (
                                  <Link
                                    key={subCategory.id}
                                    href={`/products/${navbarCategories.find(nc => nc.id === expandedNavbarCategory)?.slug}/${navbarCategories.find(nc => nc.id === expandedNavbarCategory)?.categories.find(c => c.id === expandedCategory)?.slug}/${subCategory.slug}`}
                                    className="text-white flex items-center gap-2 p-3 rounded-lg hover:bg-zinc-900"
                                    onClick={() => {
                                      setIsMegaMenuOpen(false);
                                      setExpandedNavbarCategory(null);
                                      setExpandedCategory(null);
                                    }}
                                  >
                                    {subCategory.name}
                                  </Link>
                                ))}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="col-span-3 text-center py-8 bg-black/80 rounded-xl">
                      <p className="text-gray-500">No categories available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {['Blogs', 'Events', 'Gallery'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="px-4 py-2 text-gray-500 hover:text-blue-400 rounded-lg hover:bg-black/60 transition-all duration-300 mx-1 font-medium"
              >
                {item}
              </Link>
            ))}

            <Link
              href="/contact"
              className="ml-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-black/60 focus:outline-none transition-all duration-300"
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
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-zinc-900 mt-1">
            {['About', 'Services', 'Products'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-black/60 font-medium transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}

            {['Blogs', 'Events', 'Gallery'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block px-3 py-2 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-black/60 font-medium transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;