"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed inset-y-0">
        <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
      </div>
      <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
        {children}
      </main>
    </div>
  );
} 