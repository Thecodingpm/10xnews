'use client'

import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  const handleAdminLogin = () => {
    router.push('/admin/login')
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About 10xNews
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your premier source for breaking tech news, startup insights, and industry analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              At 10xNews, we believe that staying ahead in the fast-paced world of technology requires 
              access to the most current, accurate, and insightful news. Our mission is to deliver 
              breaking tech news, startup insights, and industry analysis that empowers professionals, 
              entrepreneurs, and tech enthusiasts to make informed decisions.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We cover everything from emerging technologies and startup ecosystems to business trends 
              and market analysis, ensuring our readers are always in the know about what matters most 
              in the tech world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                What We Cover
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Tech & Telecom innovations</li>
                <li>• Business and startup news</li>
                <li>• Education technology</li>
                <li>• Health tech and medical innovations</li>
                <li>• Pakistan tech ecosystem</li>
                <li>• AI & Machine Learning</li>
                <li>• Cryptocurrency and blockchain</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Values
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Accuracy and reliability</li>
                <li>• Timely and relevant content</li>
                <li>• In-depth analysis</li>
                <li>• User-focused experience</li>
                <li>• Innovation in journalism</li>
                <li>• Community engagement</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose 10xNews?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Breaking News</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get the latest updates as they happen
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Focused Coverage</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Deep dive into specific tech sectors
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🌍</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Global Perspective</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  International tech news and insights
                </p>
              </div>
            </div>
          </div>

          {/* Admin Login Button - Hidden at bottom */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <button
                onClick={handleAdminLogin}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
