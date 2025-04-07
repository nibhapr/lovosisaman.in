import NestedNavbar from '../Components/products/NestedNavbar';
import Breadcrumbs from '../Components/products/Breadcrumbs';

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