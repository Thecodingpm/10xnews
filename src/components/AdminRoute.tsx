'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAdminUser, loading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdminUser) {
        router.push('/admin/login')
      }
    }
  }, [user, isAdminUser, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || !isAdminUser) {
    return null
  }

  return <>{children}</>
}

