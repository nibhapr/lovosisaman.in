import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import Category from '@/app/models/Category'
import Subcategory from '@/app/models/Subcategory'
import Product from '@/app/models/Product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'localhost:3000'
  
  await connectDB()

  // Fetch all categories, subcategories and products
  const categories = await Category.find({})
  const subcategories = await Subcategory.find({})
  const products = await Product.find({})

  // Generate shop routes
  const shopRoutes = categories.flatMap(category => {
    const categoryRoute = {
      url: `${baseUrl}/shop/${category.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }

    const subcategoryRoutes = subcategories
      .filter(sub => sub.categoryId === category._id.toString())
      .map(sub => ({
        url: `${baseUrl}/shop/${category.slug}/${sub.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))

    const productRoutes = products
      .filter(prod => prod.categoryId === category._id.toString())
      .map(prod => {
        const sub = subcategories.find(sub => sub._id.toString() === prod.subcategoryId);
        return {
          url: `${baseUrl}/shop/${category.slug}/${sub?.slug}/${prod.slug}`,
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
    '/shop',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticRoutes, ...shopRoutes]
} 