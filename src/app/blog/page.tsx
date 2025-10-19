import { getPosts as getFirebasePosts, getCategories as getFirebaseCategories } from '@/lib/firebase-data'
import { getAllFallbackPosts } from '@/lib/fallback-data'
// import PostCard from '@/components/blog/PostCard'
// import { HeaderAd, SidebarAd } from '@/components/AdSlot'
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
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

  try {
    // Get all published posts from Firebase
    let allPosts = await getFirebasePosts()
    
    // If Firebase fails or returns no posts, use fallback data
    if (!Array.isArray(allPosts) || allPosts.length === 0) {
      console.log('No posts from Firebase, using fallback data')
      allPosts = getAllFallbackPosts()
    }
    
    // Filter posts based on search parameters
    let filteredPosts = Array.isArray(allPosts) ? allPosts.filter(post => post.published) : []
    
    // Apply search filter
    if (searchParams.search) {
      const searchTerm = searchParams.search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply category filter
    if (searchParams.category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.slug === searchParams.category
      )
    }
    
    // Apply tag filter
    if (searchParams.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.includes(searchParams.tag!)
      )
    }
    
    // Sort by publishedAt (newest first)
    filteredPosts.sort((a, b) => {
      if (!a.publishedAt && !b.publishedAt) return 0
      if (!a.publishedAt) return 1
      if (!b.publishedAt) return -1
      return b.publishedAt.getTime() - a.publishedAt.getTime()
    })
    
    // Apply pagination
    const totalCount = filteredPosts.length
    const skip = (page - 1) * limit
    const posts = filteredPosts.slice(skip, skip + limit)
    
    // Transform to match expected format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      views: post.views,
      author: { name: post.author.name },
      category: post.category ? {
        name: post.category.name,
        slug: post.category.slug,
        color: post.category.color
      } : null,
    }))

    return {
      posts: transformedPosts,
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
    const categories = await getFirebaseCategories()
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
  const [{ posts, pagination }] = await Promise.all([
    getPosts(resolvedSearchParams),
    getCategories(),
  ])

  return (
    <div className="min-h-screen">

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
            posts.map((post) => (
              <div key={post.id}>
                
                {/* Article Card */}
                <article className="group">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="md:w-2/5">
                      <div className="aspect-video md:aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-2xl">📰</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-3/5 flex flex-col justify-between">
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

      </div>
    </div>
  )
}