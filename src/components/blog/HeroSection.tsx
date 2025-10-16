'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRightIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline'
import { formatDate, formatReadingTime } from '@/lib/utils'

interface HeroPost {
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

interface HeroSectionProps {
  featuredPosts: HeroPost[]
}

export default function HeroSection({ featuredPosts }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Add safety check for featuredPosts
  const safeFeaturedPosts = featuredPosts || []

  useEffect(() => {
    if (safeFeaturedPosts.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === safeFeaturedPosts.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [safeFeaturedPosts.length])

  if (safeFeaturedPosts.length === 0) {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to BlogSite
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover insightful articles, tutorials, and industry insights
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Articles
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const currentPost = safeFeaturedPosts[currentIndex]

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      {currentPost.coverImage && (
        <div className="absolute inset-0">
          <Image
            src={currentPost.coverImage}
            alt={currentPost.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            key={currentPost.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Category */}
            {currentPost.category && (
              <Link
                href={`/categories/${currentPost.category.slug}`}
                className={`inline-block text-sm font-semibold uppercase tracking-wide ${
                  currentPost.category.color || 'text-blue-400'
                }`}
              >
                {currentPost.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <Link href={`/blog/${currentPost.slug}`} className="hover:text-blue-400 transition-colors">
                {currentPost.title}
              </Link>
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-200 leading-relaxed">
              {currentPost.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>{currentPost.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <EyeIcon className="h-4 w-4" />
                <span>{currentPost.readTime} views</span>
              </div>
              <time>{formatDate(currentPost.publishedAt)}</time>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {currentPost.author.image ? (
                  <Image
                    src={currentPost.author.image}
                    alt={currentPost.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {currentPost.author.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{currentPost.author.name}</p>
                <p className="text-sm text-gray-300">Author</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href={`/blog/${currentPost.slug}`}
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Article
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Featured Posts List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Featured Articles</h3>
            {safeFeaturedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 bg-opacity-20 border-l-4 border-blue-400'
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex space-x-4">
                  {post.coverImage && (
                    <div className="flex-shrink-0">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg line-clamp-2 mb-2">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <span>{post.readTime} min read</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {safeFeaturedPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
