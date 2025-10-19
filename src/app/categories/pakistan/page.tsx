import { getPosts, getCategories } from '@/lib/firebase-data'
import PostCard from '@/components/blog/PostCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PakistanPageProps {
  params: Promise<{}>
}

async function getPakistanPosts() {
  try {
    const [posts, categories] = await Promise.all([
      getPosts(),
      getCategories()
    ])

    if (!posts || !categories) {
      return null
    }

    // Find the Pakistan category
    const pakistanCategory = categories.find(cat => cat.slug === 'pakistan')
    if (!pakistanCategory) {
      return null
    }

    // Filter posts by Pakistan category
    const pakistanPosts = posts.filter(post => 
      post.published && 
      post.category?.slug === 'pakistan'
    )

    return {
      category: pakistanCategory,
      posts: pakistanPosts,
      totalPosts: pakistanPosts.length
    }
  } catch (error) {
    console.error('Error fetching Pakistan posts:', error)
    return null
  }
}

export async function generateMetadata() {
  return {
    title: 'Pakistan News | 10xNews',
    description: 'Latest news and articles about Pakistan. Stay updated with politics, economy, sports, culture, and breaking news from Pakistan.',
    keywords: ['Pakistan', 'news', 'politics', 'economy', 'sports', 'culture', 'breaking news', '10xNews']
  }
}

export default async function PakistanPage({ params }: PakistanPageProps) {
  const data = await getPakistanPosts()

  if (!data) {
    notFound()
  }

  const { category, posts, totalPosts } = data

  const subcategories = [
    { name: 'Politics', href: '/categories/pakistan/politics', description: 'Political news and analysis from Pakistan' },
    { name: 'Economy', href: '/categories/pakistan/economy', description: 'Economic updates and business news from Pakistan' },
    { name: 'Sports', href: '/categories/pakistan/sports', description: 'Sports news and updates from Pakistan' },
    { name: 'Culture', href: '/categories/pakistan/culture', description: 'Cultural events and stories from Pakistan' },
    { name: 'Breaking News', href: '/categories/pakistan/breaking', description: 'Latest breaking news from Pakistan' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-white text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pakistan News
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Stay updated with the latest news from Pakistan across all categories
            </p>
          </div>
        </div>
      </div>

      {/* Subcategories Navigation */}
      <div className="bg-gray-50 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Explore Pakistan News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories.map((subcat) => (
              <Link
                key={subcat.name}
                href={subcat.href}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-600"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {subcat.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {subcat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Pakistan News
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} available
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🇵🇰</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No articles yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new content about Pakistan.
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
