import NestedNavbar from '../Components/shop/NestedNavbar';
import Breadcrumbs from '../Components/shop/Breadcrumbs';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NestedNavbar />
      <Breadcrumbs />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 