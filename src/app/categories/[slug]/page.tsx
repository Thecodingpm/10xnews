import { prisma } from '@/lib/prisma'
import PostCard from '@/components/blog/PostCard'
import { HeaderAd, SidebarAd } from '@/components/AdSlot'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCategoryPosts(slug: string) {
  try {
    if (!prisma || !process.env.DATABASE_URL) {
      return null
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { published: true },
          include: {
            author: { select: { name: true } },
            category: { select: { name: true, slug: true, color: true } }
          },
          orderBy: { publishedAt: 'desc' },
          take: 12
        },
        _count: {
          select: { posts: { where: { published: true } } }
        }
      }
    })

    if (!category) {
      return null
    }

    return {
      category,
      posts: category.posts,
      totalPosts: category._count.posts
    }
  } catch (error) {
    console.error('Error fetching category posts:', error)
    return null
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const data = await getCategoryPosts(resolvedParams.slug)
  
  if (!data) {
    return {
      title: 'Category Not Found | 10xNews',
      description: 'The requested category could not be found.'
    }
  }

  return {
    title: `${data.category.name} News | 10xNews`,
    description: `Latest ${data.category.name} news and updates on 10xNews. Stay informed with breaking news and insights.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const data = await getCategoryPosts(resolvedParams.slug)

  if (!data) {
    notFound()
  }

  const { category, posts, totalPosts } = data

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {totalPosts} {totalPosts === 1 ? 'story' : 'stories'} covering the latest in {category.name.toLowerCase()}
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
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={{
                    ...post,
                    coverImage: post.coverImage || undefined,
                    author: {
                      name: post.author.name || '10xNews Staff',
                      image: undefined
                    },
                    publishedAt: post.publishedAt || new Date(),
                    readTime: post.readTime || 5,
                    views: post.views || 0,
                    category: post.category ? {
                      name: post.category.name,
                      slug: post.category.slug || 'uncategorized',
                      color: post.category.color || 'bg-blue-500'
                    } : undefined
                  }} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No stories yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back soon for the latest {category.name.toLowerCase()} news.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Category Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  About {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Stay updated with the latest {category.name.toLowerCase()} news, insights, and analysis.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Stories</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {totalPosts}
                  </span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">📧</span>
                    </div>
                    <h3 className="text-lg font-semibold">
                      Stay Updated
                    </h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-4">
                    Get the latest {category.name.toLowerCase()} news delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-gray-500"
                    />
                    <button className="w-full bg-white text-blue-600 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                      Subscribe Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
