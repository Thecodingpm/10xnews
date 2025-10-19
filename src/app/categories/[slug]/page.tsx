import { getPosts, getCategories } from '@/lib/firebase-data'
import PostCard from '@/components/blog/PostCard'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCategoryPosts(slug: string) {
  try {
    const [posts, categories] = await Promise.all([
      getPosts(),
      getCategories()
    ])

    if (!posts || !categories) {
      return null
    }

    // Find the category by slug
    const category = categories.find(cat => cat.slug === slug)
    if (!category) {
      return null
    }

    // Filter posts by category
    const categoryPosts = Array.isArray(posts) ? posts.filter(post => 
      post.published && 
      post.category?.slug === slug
    ) : []

    return {
      category,
      posts: categoryPosts,
      totalPosts: categoryPosts.length
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
    title: `${data.category.name} | 10xNews`,
    description: `Latest news and articles in ${data.category.name} category. Stay updated with the most recent ${data.category.name.toLowerCase()} content.`,
    keywords: [data.category.name, 'news', 'articles', '10xNews']
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
              {totalPosts} {totalPosts === 1 ? 'article' : 'articles'} in this category
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No articles yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new content in this category.
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