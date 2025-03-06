"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HiOutlineHome,
  HiOutlineEnvelope,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineNewspaper,
  HiOutlineCalendar,
  HiOutlineSquares2X2,
  HiOutlineRectangleStack,
  HiOutlineShoppingBag,
  HiOutlineStar,
  HiOutlineArrowRightOnRectangle,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const menuItems = [
  { name: 'Dashboard', icon: HiOutlineHome, path: '/admin/dashboard' },
  { name: 'Contacts', icon: HiOutlineEnvelope, path: '/admin/dashboard/contacts' },
  { name: 'Newsletter', icon: HiOutlineNewspaper, path: '/admin/dashboard/newsletter' },
  { name: 'Blog', icon: HiOutlineDocumentText, path: '/admin/dashboard/blog' },
  { name: 'Events', icon: HiOutlineCalendar, path: '/admin/dashboard/events' },
  { name: 'Categories', icon: HiOutlineSquares2X2, path: '/admin/dashboard/categories' },
  { name: 'Subcategories', icon: HiOutlineRectangleStack, path: '/admin/dashboard/subcategories' },
  { name: 'Products', icon: HiOutlineShoppingBag, path: '/admin/dashboard/products' },
  { name: 'Reviews', icon: HiOutlineStar, path: '/admin/dashboard/reviews' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} min-h-screen bg-white/60 backdrop-blur-xl border-r border-white/20 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-lg`}>
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/20 backdrop-blur-xl">
          <h1 className={`font-semibold text-[#1d1d1f] ${isCollapsed ? 'hidden' : 'block'}`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
          >
            {isCollapsed ? <HiOutlineBars3 size={20} /> : <HiOutlineXMark size={20} />}
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200 ${
                    pathname === item.path
                      ? 'bg-[#007AFF]/10 text-[#007AFF] shadow-sm'
                      : 'hover:bg-black/5 active:bg-black/10 text-[#1d1d1f]'
                  }`}
                >
                  <item.icon size={22} />
                  <span className={`${isCollapsed ? 'hidden' : 'block'} font-medium`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200 w-full hover:bg-[#FF3B30]/10 active:bg-[#FF3B30]/20 text-[#FF3B30]`}
        >
          <HiOutlineArrowRightOnRectangle size={22} />
          <span className={`${isCollapsed ? 'hidden' : 'block'} font-medium`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}