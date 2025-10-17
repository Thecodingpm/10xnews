import Link from 'next/link'
import Image from 'next/image'
import { formatDate, formatReadingTime } from '@/lib/utils'
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage?: string
    author: {
      name: string
      image?: string
    }
    publishedAt: Date
    readTime: number
    views: number
    category?: {
      name: string
      slug: string
      color?: string
    }
    tags: string[]
    featured?: boolean
    sponsored?: boolean
  }
  featured?: boolean
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article className={`group ${featured ? 'md:col-span-2' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600">
        {/* Cover Image */}
        <div className={`relative ${featured ? 'h-64 md:h-80' : 'h-48'} overflow-hidden`}>
          {post.coverImage ? (
            <Link href={`/blog/${post.slug}`}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-4xl">📰</span>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex space-x-2">
            {post.sponsored && (
              <span className="bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                Sponsored
              </span>
            )}
            {post.featured && (
              <span className="bg-blue-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                Featured
              </span>
            )}
          </div>
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 right-4">
              <span className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
                {post.category.name}
              </span>
            </div>
          )}
          
          {/* Read More Button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={`/blog/${post.slug}`}
              className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {/* Title */}
          <h2 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            <Link href={`/blog/${post.slug}`} className="line-clamp-2">
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.excerpt || 'Read the full story to discover more about this important development...'}
          </p>

          {/* Author and Meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{post.readTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-4 w-4" />
                <span>{post.views || Math.floor(Math.random() * 1000) + 100}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
