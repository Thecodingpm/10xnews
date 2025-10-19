import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getPosts, getCategories } from '@/lib/firebase-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    let posts: Array<{ slug: string; updatedAt: Date }> = []
    let categories: Array<{ slug: string; updatedAt: Date }> = []
    
    // Try Firebase first, then fallback to Prisma
    try {
      const [firebasePosts, firebaseCategories] = await Promise.all([
        getPosts(),
        getCategories()
      ])
      
      if (firebasePosts) {
        posts = firebasePosts
          .filter(post => post.published)
          .map(post => ({
            slug: post.slug,
            updatedAt: post.updatedAt
          }))
      }
      
      if (firebaseCategories) {
        categories = firebaseCategories.map(cat => ({
          slug: cat.slug,
          updatedAt: cat.updatedAt || new Date()
        }))
      }
    } catch (firebaseError) {
      // Fallback to Prisma if Firebase fails
      if (prisma && process.env.DATABASE_URL) {
        // Get all published posts
        posts = await prisma.post.findMany({
          where: {
            published: true,
          },
          select: {
            slug: true,
            updatedAt: true,
          },
          orderBy: {
            publishedAt: 'desc',
          },
        })

        // Get all categories
        categories = await prisma.category.findMany({
          select: {
            slug: true,
            updatedAt: true,
          },
        })
      }
    }

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
    ]

    // Pakistan category and subcategories
    const pakistanPages = [
      {
        url: `${baseUrl}/categories/pakistan`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/categories/pakistan/politics`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categories/pakistan/economy`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categories/pakistan/sports`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categories/pakistan/culture`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/categories/pakistan/breaking`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.9,
      },
    ]

    // Blog post pages
    const blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Category pages
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...pakistanPages, ...blogPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
