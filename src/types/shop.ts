interface Category {
  id: string;
  _id?: string;  // Add this for MongoDB compatibility
  name: string;
  slug: string;
  description?: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Subcategory {
  id: string;
  _id?: string;  // Add this for MongoDB compatibility
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  categoryId: string;
  subcategoryId: string;
  features: string[];
  specifications: Record<string, string>;
  catalogPdf?: string;
  catalogExcel?: string;
}

export type { Category, Subcategory, Product };
