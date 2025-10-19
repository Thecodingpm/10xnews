import { prisma } from '@/lib/prisma'
import { getPosts, getFeaturedPosts } from '@/lib/firebase-data'
// import HeroSection from '@/components/blog/HeroSection'
// import PostCard from '@/components/blog/PostCard'
// import { HeaderAd, SidebarAd } from '@/components/AdSlot'
import Link from 'next/link'
import Image from 'next/image'
import ThemeDebug from '@/components/ThemeDebug'

export default async function Home() {
  console.log('Fetching posts for home page...')
  
  let featuredPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    publishedAt: Date | null;
    readTime: number;
    views: number;
    author: { name: string | null };
    category: { name: string; color: string | null } | null;
  }> = []
  let latestPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    publishedAt: Date | null;
    readTime: number;
    views: number;
    author: { name: string | null };
    category: { name: string; color: string | null } | null;
  }> = []
  
  try {
    // Try Firebase first, then fallback to Prisma if available
    try {
      const [firebaseFeatured, firebaseLatest] = await Promise.all([
        getFeaturedPosts(3),
        getPosts(6)
      ])
      featuredPosts = firebaseFeatured || []
      latestPosts = firebaseLatest || []
      console.log('Fetched from Firebase - Featured:', featuredPosts.length, 'Latest:', latestPosts.length)
    } catch (firebaseError) {
      console.log('Firebase not available, trying Prisma...', firebaseError)
      
      // Fallback to Prisma if Firebase fails
      if (prisma && process.env.DATABASE_URL) {
        [featuredPosts, latestPosts] = await Promise.all([
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
            orderBy: [
              { publishedAt: 'desc' },
              { createdAt: 'desc' }
            ],
            take: 6
          })
        ])
        console.log('Fetched from Prisma')
      }
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    featuredPosts = []
    latestPosts = []
  }

  console.log('Featured posts:', featuredPosts.length)
  console.log('Latest posts:', latestPosts.length)
  console.log('Latest posts data:', latestPosts.map(p => ({ id: p.id, title: p.title, publishedAt: p.publishedAt })))

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Articles Feed */}
        <div className="space-y-6">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <div key={post.id}>
                
                {/* Article Card */}
                <article className="group">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="md:w-2/5">
                      <div className="aspect-video md:aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
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
                No articles yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Check back soon for the latest tech news.
              </p>
              <a
                href="/admin/posts/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create First Article
              </a>
            </div>
          )}
        </div>

      </div>
      <ThemeDebug />
    </div>
  )
}