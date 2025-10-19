import { getPosts, getCategories } from '@/lib/firebase-data'
import PostCard from '@/components/blog/PostCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface BreakingPageProps {
  params: Promise<Record<string, never>>
}

async function getBreakingPosts() {
  try {
    const [posts, categories] = await Promise.all([
      getPosts(),
      getCategories()
    ])

    if (!posts || !categories) {
      return null
    }

    // Filter posts by Pakistan breaking news
    const breakingPosts = Array.isArray(posts) ? posts.filter(post => 
      post.published && 
      (post.category?.slug === 'pakistan-breaking' || 
       (post.category?.slug === 'pakistan' && 
        (post.title?.toLowerCase().includes('breaking') ||
         post.title?.toLowerCase().includes('urgent') ||
         post.title?.toLowerCase().includes('latest') ||
         post.title?.toLowerCase().includes('update') ||
         post.title?.toLowerCase().includes('developing') ||
         post.excerpt?.toLowerCase().includes('breaking') ||
         post.excerpt?.toLowerCase().includes('urgent') ||
         post.excerpt?.toLowerCase().includes('latest'))))
    ) : []

    return {
      posts: breakingPosts,
      totalPosts: breakingPosts.length
    }
  } catch (error) {
    console.error('Error fetching breaking posts:', error)
    return null
  }
}

export async function generateMetadata() {
  return {
    title: 'Pakistan Breaking News | 10xNews',
    description: 'Latest breaking news and urgent updates from Pakistan. Stay informed with real-time news and developing stories.',
    keywords: ['Pakistan breaking news', 'urgent news', 'latest updates', 'developing stories', 'real-time news', '10xNews']
  }
}

export default async function BreakingPage({}: BreakingPageProps) {
  const data = await getBreakingPosts()

  if (!data) {
    notFound()
  }

  const { posts, totalPosts } = data

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pakistan Breaking News
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Latest breaking news and urgent updates from Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Breaking News Alert */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="animate-pulse bg-white w-3 h-3 rounded-full mr-3"></div>
              <span className="font-semibold">LIVE UPDATES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/categories/pakistan" className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Pakistan
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-gray-500 dark:text-gray-400">Breaking News</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Breaking News & Urgent Updates
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} available
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No breaking news yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for breaking news and urgent updates from Pakistan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
