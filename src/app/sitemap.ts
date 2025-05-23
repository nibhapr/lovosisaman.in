import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import Category from '@/app/models/Category'
import Subcategory from '@/app/models/Subcategory'
import Product from '@/app/models/Product'
import NavbarCategory from '@/app/models/NavbarCategory'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'lovosis.in'
  
  await connectDB()

  // Fetch all categories, subcategories, products, and navbar categories
  const categories = await Category.find({})
  const subcategories = await Subcategory.find({})
  const products = await Product.find({})
  const navbarCategories = await NavbarCategory.find({})

  // Generate shop routes
  const shopRoutes = categories.flatMap(category => {
    const categoryRoute = {
      url: `${baseUrl}/products/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }

    const subcategoryRoutes = subcategories
      .filter(sub => sub.categoryId === category._id.toString())
      .map(sub => ({
        url: `${baseUrl}/products/${category.slug}/${sub.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))

    const productRoutes = products
      .filter(prod => prod.categoryId === category._id.toString())
      .map(prod => {
        const sub = subcategories.find(sub => sub._id.toString() === prod.subcategoryId);
        return {
          url: `${baseUrl}/products/${category.slug}/${sub?.slug}/${prod.slug}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'daily' as const,
          priority: 0.6,
        };
      })

    return [categoryRoute, ...subcategoryRoutes, ...productRoutes]
  })

  // Base routes that we know exist
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/services',
    '/careers',
    '/blog',
    '/events',
    '/gallery',
    '/terms-of-service',
    '/privacy-policy',
    '/cookie-policy',
    '/sitemap.xml',
    '/robots.txt',
    '/services/it-services',
    '/services/electronics-manufacturing',
    '/products',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Generate navbar category routes
  const navbarCategoryRoutes = navbarCategories.map(category => ({
    url: `${baseUrl}/products/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...shopRoutes, ...navbarCategoryRoutes]
} 