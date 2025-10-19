'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
}

export default function NewPostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    published: false,
    featured: false,
    sponsored: false,
    categoryId: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    keywords: '',
    images: [] as string[], // Array for multiple images
  })

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First test with simple endpoint
      console.log('Testing with simple endpoint...')
      const testResponse = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' }),
      })
      
      if (testResponse.ok) {
        const testData = await testResponse.json()
        console.log('Test API response:', testData)
      } else {
        console.error('Test API failed:', testResponse.status)
      }

      console.log('Now trying admin posts API...')
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          keywords: formData.keywords.split(',').map(keyword => keyword.trim()).filter(Boolean),
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        // Try to get response as text first to see what we're actually getting
        const responseText = await response.text()
        console.error('Raw response text:', responseText)
        
        try {
          const errorData = JSON.parse(responseText)
          console.error('Parsed error data:', errorData)
          setError(errorData.error || errorData.details || `Failed to create post (Status: ${response.status})`)
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError)
          console.error('Response was not JSON, it was:', responseText.substring(0, 200))
          setError(`Server returned non-JSON response (Status: ${response.status}): ${responseText.substring(0, 100)}...`)
        }
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTitleChange = (title: string) => {
    // Generate a unique slug by adding timestamp if needed
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
    const timestamp = Date.now().toString().slice(-6) // Last 6 digits of timestamp
    const uniqueSlug = `${baseSlug}-${timestamp}`
    
    setFormData(prev => ({
      ...prev,
      title,
      slug: uniqueSlug,
      seoTitle: title,
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }))
  }

  if (!session || !session.user || (session.user as SessionUser).role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/admin/dashboard"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Post
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Write and publish a new blog post
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
            <div className="text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category (Optional)
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a category</option>
                        {categories.map((category: {id: string, name: string}) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  required
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Write your post content here (HTML supported)"
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image (Optional)
                </label>
                <div className="space-y-4">
                  {/* URL Input */}
                  <div>
                    <label htmlFor="coverImageUrl" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="coverImageUrl"
                      value={formData.coverImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  {/* File Upload */}
                  <div>
                    <label htmlFor="coverImageFile" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Or Upload Image
                    </label>
                    <input
                      type="file"
                      id="coverImageFile"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Convert file to data URL for preview
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            setFormData(prev => ({ ...prev, coverImage: event.target?.result as string }))
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {formData.coverImage && (
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Preview
                      </label>
                      <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <Image
                          src={formData.coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                          onError={() => {
                            // Handle error if needed
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Images (Optional)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Add multiple images that will be embedded throughout your content
                </p>
                
                <div className="space-y-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => updateImage(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder={`Image ${index + 1} URL`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addImage}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
                  >
                    + Add Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SEO Settings
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="SEO meta description"
                />
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publishing Options
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Publish immediately
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Featured post
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sponsored"
                  checked={formData.sponsored}
                  onChange={(e) => setFormData(prev => ({ ...prev, sponsored: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sponsored" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Sponsored post
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/dashboard"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
