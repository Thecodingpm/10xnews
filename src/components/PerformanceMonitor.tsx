'use client'

import { useEffect, useState } from 'react'

export default function PerformanceMonitor() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (process.env.NODE_ENV !== 'development') return

    // Check if we're in the browser
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime)
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', (entry as any).value)
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (error) {
      console.log('Performance Observer not supported:', error)
    }

    // Monitor page load time
    const handleLoad = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart)
          console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart)
        }
      } catch (error) {
        console.log('Performance API not available:', error)
      }
    }

    window.addEventListener('load', handleLoad)

    return () => {
      try {
        observer.disconnect()
        window.removeEventListener('load', handleLoad)
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }, [])

  // Don't render anything during SSR
  if (!mounted) return null

  return null
}
