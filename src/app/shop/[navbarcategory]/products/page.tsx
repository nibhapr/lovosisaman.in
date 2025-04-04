import { connectDB } from '@/lib/db';
import Product from '@/app/models/Product';
import NavbarCategory from '@/app/models/NavbarCategory';
import { useRouter } from 'next/router';

async function getProducts(filters: {
  navbarCategoryId?: string;
  categoryId?: string;
  subcategoryId?: string;
}) {
  await connectDB();
  return await Product.find(filters);
}

export default async function NavbarCategoryProductPage({
  params
}: {
  params: { navbarcategory: string; product: string }
}) {
  const navbarCategory = await getNavbarCategory(params.navbarcategory);
  const product = await getProduct(params.product);

  if (!navbarCategory || !product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Category: {navbarCategory.name}</p>
      <p>{product.description}</p>
      <div>
        <h2>Product Details</h2>
        <p>Features:</p>
        <ul>
          {product.features.map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p>Specifications:</p>
        <ul>
          {Object.entries(product.specifications).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function getNavbarCategory(slug: string) {
  await connectDB();
  return await NavbarCategory.findOne({ slug });
}

async function getProduct(slug: string) {
  await connectDB();
  return await Product.findOne({ slug }).populate('navbarCategoryId');
}

// Example usage in a component
const products = await getProducts({ navbarCategoryId: 'navbarCategoryIdValue' }); 