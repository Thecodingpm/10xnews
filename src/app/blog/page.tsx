import { prisma } from '@/lib/prisma'
import PostCard from '@/components/blog/PostCard'
import { HeaderAd, SidebarAd } from '@/components/AdSlot'
import { SearchIcon } from '@heroicons/react/24/outline'

interface BlogPageProps {
  searchParams: {
    search?: string
    category?: string
    tag?: string
    page?: string
  }
}

async function getPosts(searchParams: BlogPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1')
  const limit = 9
  const skip = (page - 1) * limit

  try {
    const where: any = {
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

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              image: true,
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
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
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

export const metadata = {
  title: 'Blog',
  description: 'Browse all our articles, tutorials, and insights.',
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const [{ posts, pagination }, categories] = await Promise.all([
    getPosts(resolvedSearchParams),
    getCategories(),
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover insightful articles, tutorials, and industry insights
            </p>
          </div>
        </div>
      </div>

      {/* Header Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeaderAd />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-8">
              <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search articles..."
                    defaultValue={searchParams.search || ''}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Results */}
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    {pagination.hasPrevPage && (
                      <a
                        href={`/blog?page=${pagination.currentPage - 1}${
                          searchParams.search ? `&search=${searchParams.search}` : ''
                        }${searchParams.category ? `&category=${searchParams.category}` : ''}${
                          searchParams.tag ? `&tag=${searchParams.tag}` : ''
                        }`}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Previous
                      </a>
                    )}

                    <span className="text-gray-600 dark:text-gray-400">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    {pagination.hasNextPage && (
                      <a
                        href={`/blog?page=${pagination.currentPage + 1}${
                          searchParams.search ? `&search=${searchParams.search}` : ''
                        }${searchParams.category ? `&category=${searchParams.category}` : ''}${
                          searchParams.tag ? `&tag=${searchParams.tag}` : ''
                        }`}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Next
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
                  No articles found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your search criteria or browse our categories.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <a
                      key={category.id}
                      href={`/blog?category=${category.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        searchParams.category === category.slug
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {category._count.posts}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'javascript',
                    'react',
                    'nextjs',
                    'typescript',
                    'web-development',
                    'tutorial',
                    'programming',
                    'css',
                    'html',
                    'nodejs',
                  ].map((tag) => (
                    <a
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
