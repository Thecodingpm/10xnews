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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Cover Image */}
        {post.coverImage && (
          <div className={`relative ${featured ? 'h-64 md:h-80' : 'h-48'} overflow-hidden`}>
            <Link href={`/blog/${post.slug}`}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            {post.sponsored && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  Sponsored
                </span>
              </div>
            )}
            {post.featured && (
              <div className="absolute top-4 right-4">
                <span className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Category */}
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className={`inline-block text-sm font-medium mb-2 ${
                post.category.color || 'text-blue-600'
              } hover:underline`}
            >
              {post.category.name}
            </Link>
          )}

          {/* Title */}
          <h2 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            </div>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.publishedAt)}
            </time>
          </div>

          {/* Author */}
          <div className="flex items-center mt-4">
            <div className="flex-shrink-0">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </p>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
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
