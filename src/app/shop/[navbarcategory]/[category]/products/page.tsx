import { connectDB } from '@/lib/db';
import Product from '@/app/models/Product';
import { useRouter } from 'next/router';

async function getProducts(categoryId: string) {
  await connectDB();
  return await Product.find({ categoryId });
}

export default async function CategoryProductsPage() {
  const router = useRouter();
  const { category } = router.query;

  const categoryId = Array.isArray(category) ? category[0] : category;

  const products = categoryId ? await getProducts(categoryId) : [];

  const categoryName = category;

  // Optionally, handle the case where category is undefined
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <h1>Products in {categoryName}</h1>
      {products.map(product => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
} 