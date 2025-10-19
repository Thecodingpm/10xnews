import { getPosts, getCategories } from '@/lib/firebase-data'
import PostCard from '@/components/blog/PostCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import { generateBreadcrumbStructuredData } from '@/lib/seo'

interface HealthPageProps {
  params: Promise<Record<string, never>>
}

async function getHealthPosts() {
  try {
    const [posts, categories] = await Promise.all([
      getPosts(),
      getCategories()
    ])

    if (!posts || !categories) {
      return null
    }

    // Find the Health category
    const healthCategory = categories.find(cat => cat.slug === 'health')
    if (!healthCategory) {
      return null
    }

    // Filter posts by Health category
    const healthPosts = Array.isArray(posts) ? posts.filter(post => 
      post.published && 
      post.category?.slug === 'health'
    ) : []

    return {
      category: healthCategory,
      posts: healthPosts,
      totalPosts: healthPosts.length
    }
  } catch (error) {
    console.error('Error fetching health posts:', error)
    return null
  }
}

export async function generateMetadata() {
  return {
    title: 'Health News | 10xNews',
    description: 'Latest health news, medical updates, and wellness insights. Stay informed about health and medical developments.',
    keywords: ['health news', 'medical news', 'wellness updates', 'healthcare news', 'medical research', '10xNews'],
    openGraph: {
      title: 'Health News | 10xNews',
      description: 'Latest health news, medical updates, and wellness insights.',
      type: 'website',
    },
  }
}

export default async function HealthPage({}: HealthPageProps) {
  const data = await getHealthPosts()

  if (!data) {
    notFound()
  }

  const { category, posts, totalPosts } = data

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Health', url: '/categories/health' }
  ])

  return (
    <div className="min-h-screen">
      <JsonLd data={breadcrumbData} />
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Health News
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Latest health news, medical updates, and wellness insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Health News
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} available
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏥</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No health articles yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for the latest health news and medical updates.
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
