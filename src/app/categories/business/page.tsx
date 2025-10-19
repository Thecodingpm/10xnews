import { getPosts, getCategories } from '@/lib/firebase-data'
import PostCard from '@/components/blog/PostCard'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import { generateBreadcrumbStructuredData } from '@/lib/seo'

interface BusinessPageProps {
  params: Promise<Record<string, never>>
}

async function getBusinessPosts() {
  try {
    const [posts, categories] = await Promise.all([
      getPosts(),
      getCategories()
    ])

    if (!posts || !categories) {
      return null
    }

    // Find the Business category
    const businessCategory = categories.find(cat => cat.slug === 'business')
    if (!businessCategory) {
      return null
    }

    // Filter posts by Business category
    const businessPosts = Array.isArray(posts) ? posts.filter(post => 
      post.published && 
      post.category?.slug === 'business'
    ) : []

    return {
      category: businessCategory,
      posts: businessPosts,
      totalPosts: businessPosts.length
    }
  } catch (error) {
    console.error('Error fetching business posts:', error)
    return null
  }
}

export async function generateMetadata() {
  return {
    title: 'Business News | 10xNews',
    description: 'Latest business news, market updates, and economic insights. Stay informed about the business world.',
    keywords: ['business news', 'market updates', 'economic news', 'business insights', 'finance', '10xNews'],
    openGraph: {
      title: 'Business News | 10xNews',
      description: 'Latest business news, market updates, and economic insights.',
      type: 'website',
    },
  }
}

export default async function BusinessPage({}: BusinessPageProps) {
  const data = await getBusinessPosts()

  if (!data) {
    notFound()
  }

  const { posts, totalPosts } = data

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Business', url: '/categories/business' }
  ])

  return (
    <div className="min-h-screen">
      <JsonLd data={breadcrumbData} />
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Business News
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Latest business news, market updates, and economic insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Business News
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} available
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No business articles yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for the latest business news and market updates.
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
