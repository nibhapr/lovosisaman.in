import { connectDB } from '@/lib/db';
import Product from '@/app/models/Product';
import { useRouter } from 'next/router';

async function getProducts(subcategoryId: string) {
  await connectDB();
  return await Product.find({ subcategoryId });
}

export default async function ProductsPage() {
  const router = useRouter();
  const { subcategory } = router.query;

  const subcategoryId = Array.isArray(subcategory) ? subcategory[0] : subcategory;

  const products = subcategoryId ? await getProducts(subcategoryId) : [];

  // Optionally, handle the case where subcategory is undefined
  if (!subcategoryId) {
    return <div>Subcategory not found</div>;
  }

  return (
    <div>
      <h1>Products in {subcategoryId}</h1>
      {products.map(product => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
} 