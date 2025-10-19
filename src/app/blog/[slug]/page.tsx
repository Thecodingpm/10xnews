import { notFound } from 'next/navigation'
import { getPostBySlug, incrementPostViews } from '@/lib/firebase-data'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ClockIcon, EyeIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import MultiImageContent from '@/components/blog/MultiImageContent'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  try {
    const post = await getPostBySlug(slug)

    if (!post) {
      return null
    }

    // Increment view count
    await incrementPostViews(post.id)

    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author.name || '10xNews Staff' }],
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name || '10xNews Staff'],
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen">

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          {post.category && (
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4">
              {post.category.name}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {formatDate(post.publishedAt!)}
              </time>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeIcon className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {(post.author.name || 'A').charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {post.author.name || '10xNews Staff'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {post.author.name || '10xNews Staff'}
              </p>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={630}
              className="rounded-lg w-full"
              priority
            />
          </div>
        )}

        {/* Content */}
        <MultiImageContent 
          content={post.content} 
          images={post.images || []} 
        />


        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

    </div>
  )
}