'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session?.user?.role === 'ADMIN') {
        router.push(callbackUrl)
      }
    }
    checkSession()
  }, [router, callbackUrl])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: 'any@email.com', // Dummy email since auth is bypassed
        password: 'anypassword', // Dummy password since auth is bypassed
        redirect: false,
      })

      if (result?.error) {
        setError('Access failed')
      } else {
        const session = await getSession()
        if (session?.user?.role === 'ADMIN') {
          // Clean redirect to prevent loops
          const cleanCallbackUrl = callbackUrl.startsWith('/admin/login') 
            ? '/admin/dashboard' 
            : callbackUrl
          router.push(cleanCallbackUrl)
        } else {
          setError('Access denied. Admin privileges required.')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              No authentication required - click below to access admin dashboard
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Accessing...' : 'Access Admin Dashboard'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
