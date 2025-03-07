interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Subcategory extends Omit<Category, 'id'> {
  id: string;
  categoryId: string;
  categoryName: string;
}

interface Product extends Category {
  categoryId: string;
  subcategoryId: string;
  price: number;
  stock: number;
}

export type { Category, Subcategory, Product }; 