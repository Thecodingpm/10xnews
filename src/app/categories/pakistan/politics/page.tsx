import { getPosts, getCategories } from '@/lib/firebase-data'
import PostCard from '@/components/blog/PostCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PoliticsPageProps {
  params: Promise<Record<string, never>>
}

async function getPoliticsPosts() {
  try {
    const [posts, categories] = await Promise.all([
      getPosts(),
      getCategories()
    ])

    if (!posts || !categories) {
      return null
    }

    // Filter posts by Pakistan politics - we'll look for posts with category slug 'pakistan-politics'
    // or posts in Pakistan category that contain 'politics' in their content/tags
    const politicsPosts = Array.isArray(posts) ? posts.filter(post => 
      post.published && 
      (post.category?.slug === 'pakistan-politics' || 
       (post.category?.slug === 'pakistan' && 
        (post.title?.toLowerCase().includes('politics') ||
         post.title?.toLowerCase().includes('political') ||
         post.excerpt?.toLowerCase().includes('politics') ||
         post.excerpt?.toLowerCase().includes('political'))))
    ) : []

    return {
      posts: politicsPosts,
      totalPosts: politicsPosts.length
    }
  } catch (error) {
    console.error('Error fetching politics posts:', error)
    return null
  }
}

export async function generateMetadata() {
  return {
    title: 'Pakistan Politics | 10xNews',
    description: 'Latest political news and analysis from Pakistan. Stay updated with government updates, elections, and political developments.',
    keywords: ['Pakistan politics', 'political news', 'government', 'elections', 'political analysis', '10xNews']
  }
}

export default async function PoliticsPage({}: PoliticsPageProps) {
  const data = await getPoliticsPosts()

  if (!data) {
    notFound()
  }

  const { posts, totalPosts } = data

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pakistan Politics
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Latest political news and analysis from Pakistan
            </p>
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
                  <span className="ml-4 text-gray-500 dark:text-gray-400">Politics</span>
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
            Political News & Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} available
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No political articles yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for political news and analysis from Pakistan.
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
