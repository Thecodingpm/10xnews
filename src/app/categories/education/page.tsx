import { getPosts, getCategories } from '@/lib/firebase-data'
import PostCard from '@/components/blog/PostCard'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import { generateBreadcrumbStructuredData } from '@/lib/seo'

interface EducationPageProps {
  params: Promise<Record<string, never>>
}

async function getEducationPosts() {
  try {
    const [posts, categories] = await Promise.all([
      getPosts(),
      getCategories()
    ])

    if (!posts || !categories) {
      return null
    }

    // Find the Education category
    const educationCategory = categories.find(cat => cat.slug === 'education')
    if (!educationCategory) {
      return null
    }

    // Filter posts by Education category
    const educationPosts = Array.isArray(posts) ? posts.filter(post => 
      post.published && 
      post.category?.slug === 'education'
    ) : []

    return {
      category: educationCategory,
      posts: educationPosts,
      totalPosts: educationPosts.length
    }
  } catch (error) {
    console.error('Error fetching education posts:', error)
    return null
  }
}

export async function generateMetadata() {
  return {
    title: 'Education News | 10xNews',
    description: 'Latest education news, updates, and insights. Stay informed about educational developments and policies.',
    keywords: ['education news', 'educational updates', 'school news', 'university news', 'education policy', '10xNews'],
    openGraph: {
      title: 'Education News | 10xNews',
      description: 'Latest education news, updates, and insights.',
      type: 'website',
    },
  }
}

export default async function EducationPage({}: EducationPageProps) {
  const data = await getEducationPosts()

  if (!data) {
    notFound()
  }

  const { posts, totalPosts } = data

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Education', url: '/categories/education' }
  ])

  return (
    <div className="min-h-screen">
      <JsonLd data={breadcrumbData} />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Education News
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Latest education news, updates, and insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Education News
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} available
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No education articles yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for the latest education news and updates.
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
