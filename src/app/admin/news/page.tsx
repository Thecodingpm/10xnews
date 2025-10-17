'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CloudArrowDownIcon, PlayIcon, StopIcon, ClockIcon } from '@heroicons/react/24/outline'

interface NewsPreview {
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  source: string
  author: string | null
}

export default function NewsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<NewsPreview[]>([])
  const [selectedCategory, setSelectedCategory] = useState('tech')
  const [limit, setLimit] = useState(10)
  const [message, setMessage] = useState('')
  const [isSchedulerRunning, setIsSchedulerRunning] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/admin/login')
      return
    }
  }, [session, status, router])

  const fetchNewsPreview = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch(`/api/news/fetch?category=${selectedCategory}&limit=${limit}`)
      const data = await response.json()
      
      if (data.success) {
        setPreview(data.articles)
        setMessage(`Found ${data.totalResults} articles from NewsAPI`)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNews = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/news/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          limit: limit
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage(`Successfully saved ${data.savedPosts.length} articles!`)
        setPreview([]) // Clear preview
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const startScheduler = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/news/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' })
      })
      
      const data = await response.json()
      if (data.success) {
        setIsSchedulerRunning(true)
        setMessage('News scheduler started successfully!')
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const stopScheduler = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/news/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stop' })
      })
      
      const data = await response.json()
      if (data.success) {
        setIsSchedulerRunning(false)
        setMessage('News scheduler stopped successfully!')
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  News Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatically fetch and manage news from NewsAPI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Fetch News from NewsAPI
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="tech">Technology</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
                <option value="science">Science</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Articles
              </label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={fetchNewsPreview}
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CloudArrowDownIcon className="h-4 w-4 mr-2" />
                Preview
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md mb-4 ${
              message.includes('Error') 
                ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200' 
                : 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200'
            }`}>
              {message}
            </div>
          )}

          {preview.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preview ({preview.length} articles)
                </h3>
                <button
                  onClick={saveNews}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Save All Articles
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scheduler Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Automatic News Fetching
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Scheduler Status: {isSchedulerRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={startScheduler}
                disabled={isLoading || isSchedulerRunning}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Start Scheduler
              </button>
              
              <button
                onClick={stopScheduler}
                disabled={isLoading || !isSchedulerRunning}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <StopIcon className="h-4 w-4 mr-2" />
                Stop Scheduler
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>• Scheduler runs every 6 hours to fetch latest news</p>
            <p>• Business hours: Every 2 hours from 9 AM to 9 PM</p>
            <p>• Automatically avoids duplicate articles</p>
          </div>
        </div>

        {/* Preview Articles */}
        {preview.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preview Articles
              </h3>
              
              <div className="space-y-4">
                {preview.map((article, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex space-x-4">
                      {article.urlToImage && (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {article.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Source: {article.source}</span>
                          <span>•</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          {article.author && (
                            <>
                              <span>•</span>
                              <span>Author: {article.author}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
