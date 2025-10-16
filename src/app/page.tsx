import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/blog/HeroSection'
import PostCard from '@/components/blog/PostCard'
import { HeaderAd, SidebarAd } from '@/components/AdSlot'

export default async function Home() {
  const [featuredPosts, latestPosts] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, featured: true },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, color: true } }
      },
      orderBy: { publishedAt: 'desc' },
      take: 3
    }),
    prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, color: true } }
      },
      orderBy: { publishedAt: 'desc' },
      take: 6
    })
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection featuredPosts={featuredPosts} />

      {/* Header Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeaderAd />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Latest Posts Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Latest Articles
                </h2>
                <a
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View all articles →
          </a>
        </div>

              {latestPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {latestPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
                    No articles yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Check back soon for new content!
                  </p>
                </div>
              )}
            </section>

            {/* In-Content Ad */}
            <div className="my-12">
              <HeaderAd />
            </div>

            {/* Categories Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Browse by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Technology', color: 'bg-blue-500', count: 12 },
                  { name: 'Programming', color: 'bg-green-500', count: 8 },
                  { name: 'Web Development', color: 'bg-purple-500', count: 15 },
                  { name: 'Design', color: 'bg-pink-500', count: 6 },
                ].map((category) => (
                  <a
                    key={category.name}
                    href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 ${category.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`} />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count} articles
                    </p>
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Popular Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Posts
                </h3>
                <div className="space-y-4">
                  {latestPosts.slice(0, 5).map((post, index) => (
                    <a
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {post.views} views
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Stay Updated
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest articles delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="w-full bg-white text-blue-600 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}