"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/navbarlogo/lovosis-logo.png';
import iso from '../../../public/navbarlogo/iso.png';
import ce from '../../../public/navbarlogo/CE.png';
// import worlddidac from '../../../public/navbarlogo/wda.png';
import si from '../../../public/navbarlogo/SI.png';
import sk from '../../../public/navbarlogo/SK.png';
import zed from '../../../public/navbarlogo/zed.png';
import gmp from '../../../public/navbarlogo/gmp.png';
// Interfaces remain the same
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
  const [loading, setLoading] = useState(true);
  const [expandedNavbarCategory, setExpandedNavbarCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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
                  products: []
                }))
            }))
        }));

        setNavbarCategories(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNavbarCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set active section based on current path
    const path = window.location.pathname;
    const section = path.split('/')[1];
    setActiveSection(section || 'home');
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
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    console.log("Toggling menu. Current state:", isOpen);
    setIsOpen(!isOpen);
  };

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
    if (!isMegaMenuOpen) {
      setExpandedNavbarCategory(null);
      setExpandedCategory(null);
    }
  };

  const handleNavbarCategoryClick = (navbarCategoryId: string) => {
    setExpandedNavbarCategory(expandedNavbarCategory === navbarCategoryId ? null : navbarCategoryId);
    setExpandedCategory(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <nav className="bg-white text-black sticky top-0 z-50 shadow-lg">
      {/* Top bar with logo and certifications */}
      <div className="bg-white py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logo.src}
                alt="Lovosis Logo"
                width={200}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Certification Badges */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Google 360° */}
            <Link href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="group relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer">
                360°
              </div>
            </Link>

            {/* ISO 9001 */}
            <div className="group relative">
              <Image
                src={iso.src}
                alt="ISO"
                width={40}
                height={40}
                className="rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              />
            </div>

            {/* CE */}
            <div className="group relative">
              <Image
                src={ce.src}
                alt="CE"
                width={40}
                height={40}
                className="rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              />
            </div>

            {/* Additional 4 badges */}
            <div className="group relative">
              <Image
                src={si.src}
                alt="SI"
                width={40}
                height={40}
                className="rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              />
            </div>

            <div className="group relative">
              <Image
                src={sk.src}
                alt="SK"
                width={40}
                height={40}
                className="rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              />
            </div>

            <div className="group relative">
              <Image
                src={zed.src}
                alt="ZED"
                width={40}
                height={40}
                className="rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              />
            </div>

            <div className="group relative">
              <Image
                src={gmp.src}
                alt="GMP"
                width={40}
                height={40}
                className="rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              />
            </div>
          </div>

          {/* <div className="hidden md:flex items-center space-x-4">
            <div className="group relative">
              <Image
                src={worlddidac.src}
                alt="Worlddidac"
                width={100}
                height={100}
                className="rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              />
            </div>
          </div> */}

          {/* Contact Info */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center space-x-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+917012970281" className="text-sm hover:underline">+91 7012970281</a>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@lovosis.com" className="text-sm hover:underline">info@lovosis.com</a>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+919747745544" className="text-sm hover:underline">+91 9747745544</a>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:lovosist@gmail.com" className="text-sm hover:underline">lovosist@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Main Menu Items */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide ${activeSection === 'home' ? 'bg-white text-black' : 'text-gray-800 hover:bg-gray-100'} transition-all duration-300`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide ${activeSection === 'about' ? 'bg-white text-indigo-800' : 'text-gray-800 hover:bg-gray-100'} transition-all duration-300`}
            >
              About
            </Link>

            <Link
              href="/services"
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide ${activeSection === 'services' ? 'bg-white text-indigo-800' : 'text-gray-800 hover:bg-gray-100'} transition-all duration-300`}
            >
              Services
            </Link>

            {/* Products Mega Menu Button */}
            <div className="relative">
              <button
                id="mega-menu-button"
                onClick={toggleMegaMenu}
                className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide flex items-center gap-2 ${activeSection === 'products' ? 'bg-white text-black' : 'bg-white text-black'} transition-all duration-300`}
              >
                Products
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Menu Redesigned */}
              {isMegaMenuOpen && (
                <div
                  id="mega-menu"
                  className="absolute left-1/2 transform -translate-x-1/2 mt-4 w-[900px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out z-50"
                >
                  <div className="flex">
                    {/* Left sidebar */}
                    <div className="w-64 bg-white p-6 border-r border-gray-200">
                      <h3 className="text-black text-lg font-semibold mb-6">Product Groups</h3>

                      {loading ? (
                        <div className="flex items-center justify-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                        </div>
                      ) : navbarCategories.length > 0 ? (
                        <div className="space-y-2">
                          {navbarCategories.map((navbarCategory) => (
                            <div
                              key={navbarCategory.id}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${expandedNavbarCategory === navbarCategory.id
                                ? 'bg-gray-100 text-black'
                                : 'text-black hover:bg-gray-100'
                                } transition-all duration-200`}
                              onClick={() => handleNavbarCategoryClick(navbarCategory.id)}
                            >
                              <span className="text-sm font-medium">{navbarCategory.name}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 transition-transform ${expandedNavbarCategory === navbarCategory.id ? 'rotate-90' : ''
                                  }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="black"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center py-8">
                          No categories available
                        </div>
                      )}
                    </div>

                    {/* Right content area */}
                    <div className="flex-1 p-6">
                      {expandedNavbarCategory ? (
                        <div className="grid grid-cols-2 gap-6">
                          {/* Categories */}
                          <div>
                            <h3 className="text-black text-sm font-semibold uppercase tracking-wider mb-4">Categories</h3>
                            <div className="grid grid-cols-1 gap-2">
                              {navbarCategories
                                .find(nc => nc.id === expandedNavbarCategory)
                                ?.categories.map((category) => (
                                  <div
                                    key={category.id}
                                    className={`p-3 rounded-lg cursor-pointer ${expandedCategory === category.id
                                      ? 'bg-gray-100 text-black'
                                      : 'text-black hover:bg-gray-100'
                                      } transition-all duration-200`}
                                    onClick={() => handleCategoryClick(category.id)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">{category.name}</span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-4 w-4 transition-transform ${expandedCategory === category.id ? 'rotate-90' : ''
                                          }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="black"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Subcategories */}
                          <div>
                            {expandedCategory && (
                              <>
                                <h3 className="text-black text-sm font-semibold uppercase tracking-wider mb-4">Sub Categories</h3>
                                <div className="grid grid-cols-1 gap-2">
                                  {navbarCategories
                                    .find(nc => nc.id === expandedNavbarCategory)
                                    ?.categories
                                    .find(c => c.id === expandedCategory)
                                    ?.subCategories.map((subCategory) => (
                                      <Link
                                        key={subCategory.id}
                                        href={`/products/${navbarCategories.find(nc => nc.id === expandedNavbarCategory)?.slug
                                          }/${navbarCategories
                                            .find(nc => nc.id === expandedNavbarCategory)
                                            ?.categories.find(c => c.id === expandedCategory)?.slug
                                          }/${subCategory.slug}`}
                                        className="p-3 rounded-lg text-black hover:bg-gray-100 transition-all duration-200"
                                        onClick={() => {
                                          setIsMegaMenuOpen(false);
                                          setExpandedNavbarCategory(null);
                                          setExpandedCategory(null);
                                        }}
                                      >
                                        <span className="text-sm">{subCategory.name}</span>
                                      </Link>
                                    ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl text-gray-300 mb-4">🔍</div>
                            <h3 className="text-black text-lg font-medium mb-2">Explore Our Products</h3>
                            <p className="text-gray-500 text-sm max-w-md">
                              Select a product group from the left to browse our extensive catalog of educational equipment.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-100 p-4 flex justify-between items-center border-t border-gray-200">
                    <Link
                      href="/products"
                      className="text-xs font-medium text-black hover:text-gray-700 transition-colors duration-200"
                      onClick={() => setIsMegaMenuOpen(false)}
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blogs"
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide ${activeSection === 'blogs' ? 'bg-white text-indigo-800' : 'text-gray-800 hover:bg-gray-100'} transition-all duration-300`}
            >
              Blogs
            </Link>

            <Link
              href="/events"
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide ${activeSection === 'events' ? 'bg-white text-indigo-800' : 'text-gray-800 hover:bg-gray-100'} transition-all duration-300`}
            >
              Events
            </Link>

            <Link
              href="/gallery"
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide ${activeSection === 'gallery' ? 'bg-white text-indigo-800' : 'text-gray-800 hover:bg-gray-100'} transition-all duration-300`}
            >
              Gallery
            </Link>
          </div>

          {/* Contact Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-black text-white font-medium rounded-full shadow-lg hover:shadow-gray-800/20 transform transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-black hover:bg-gray-100 focus:outline-none transition-all duration-300"
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out z-40 ${isOpen
          ? 'max-h-screen opacity-100 visible'
          : 'max-h-0 opacity-0 invisible'
          } overflow-hidden bg-white`}
      >
        <div className="px-5 py-4 space-y-3 divide-y divide-gray-100">
          <Link
            href="/"
            className="block py-3 text-black font-medium hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/about"
            className="block py-3 text-black font-medium hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          <Link
            href="/services"
            className="block py-3 text-black font-medium hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>

          <Link
            href="/products"
            className="block py-3 text-black font-medium hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>

          <Link
            href="/blogs"
            className="block py-3 text-black font-medium hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>

          <Link
            href="/events"
            className="block py-3 text-black font-medium hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>

          <Link
            href="/gallery"
            className="block py-3 text-black font-medium hover:text-gray-600 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Gallery
          </Link>

          <Link
            href="/contact"
            className="block py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile contact info */}
          <div className="py-4 space-y-2">
            <div className="flex items-center space-x-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+917012970281" className="text-sm hover:underline">+91 7012970281</a>
            </div>

            <div className="flex items-center space-x-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@lovosis.com" className="text-sm hover:underline">info@lovosis.com</a>
            </div>
            <div className="flex items-center space-x-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+919747745544" className="text-sm hover:underline">+91 9747745544</a>
            </div>
            <div className="flex items-center space-x-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:lovosist@gmail.com" className="text-sm hover:underline">lovosist@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;