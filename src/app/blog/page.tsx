import { prisma } from '@/lib/prisma'
// import PostCard from '@/components/blog/PostCard'
// import { HeaderAd, SidebarAd } from '@/components/AdSlot'
import { AdSpace } from '@/components/AdDetection'
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { Metadata } from 'next'

interface BlogPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    tag?: string
    page?: string
  }>
}

async function getPosts(searchParams: Awaited<BlogPageProps['searchParams']>) {
  const page = parseInt(searchParams.page || '1')
  const limit = 9
  const skip = (page - 1) * limit

  try {
    const where: {
      published: boolean;
      OR?: Array<{title?: {contains: string, mode: 'insensitive'}, excerpt?: {contains: string, mode: 'insensitive'}, content?: {contains: string, mode: 'insensitive'}}>;
      category?: {slug: string};
      tags?: {has: string};
    } = {
      published: true,
    }

    if (searchParams.search) {
      where.OR = [
        { title: { contains: searchParams.search, mode: 'insensitive' } },
        { excerpt: { contains: searchParams.search, mode: 'insensitive' } },
        { content: { contains: searchParams.search, mode: 'insensitive' } },
      ]
    }

    if (searchParams.category) {
      where.category = {
        slug: searchParams.category,
      }
    }

    if (searchParams.tag) {
      where.tags = {
        has: searchParams.tag,
      }
    }

    let posts: Array<{
      id: string;
      title: string;
      slug: string;
      excerpt: string;
      coverImage: string | null;
      publishedAt: Date | null;
      readTime: number;
      views: number;
      author: { name: string | null };
      category: { name: string; slug: string; color: string | null } | null;
    }> = []
    let totalCount = 0
    
    if (prisma && process.env.DATABASE_URL) {
      [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
          where,
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
                slug: true,
                color: true,
              },
            },
          },
          orderBy: [
            { publishedAt: 'desc' },
            { createdAt: 'desc' }
          ],
          take: limit,
          skip,
        }),
        prisma.post.count({ where }),
      ])
    }

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], pagination: { currentPage: 1, totalPages: 1, totalCount: 0 } }
  }
}

async function getCategories() {
  try {
    if (!prisma || !process.env.DATABASE_URL) {
      return []
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const metadata: Metadata = {
  title: 'Tech News',
  description: 'Browse all our articles, tutorials, and insights.',
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const [{ posts, pagination }, categories] = await Promise.all([
    getPosts(resolvedSearchParams),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Ad */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <AdSpace size="medium">
              {/* <HeaderAd /> */}
          </AdSpace>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                defaultValue={resolvedSearchParams.search || ''}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Articles Feed */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={post.id}>
                {/* Ad Space - Every 3rd article */}
                {index > 0 && index % 3 === 0 && (
                  <div className="my-8">
                    <AdSpace size="medium" />
                  </div>
                )}
                
                {/* Article Card */}
                <article className="group">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="md:w-1/3">
                      <div className="aspect-video md:aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-2xl">📰</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-2/3 flex flex-col justify-between">
                      <div>
                        {/* Category */}
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                          {post.category?.name || 'TECH'}
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                        
                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                          {post.excerpt || 'Read the full story to discover more about this important development...'}
                        </p>
                      </div>
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{post.author?.name || '10xNews Staff'}</span>
                          <span>•</span>
                          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}</span>
                          <span>•</span>
                          <span>{post.readTime || 5} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or browse all articles.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={`/blog?page=${pageNumber}${resolvedSearchParams.search ? `&search=${resolvedSearchParams.search}` : ''}${resolvedSearchParams.category ? `&category=${resolvedSearchParams.category}` : ''}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pageNumber === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800'
                }`}
              >
                {pageNumber}
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Ad */}
        <div className="mt-12">
          <AdSpace size="medium" />
        </div>
      </div>
    </div>
  )
}