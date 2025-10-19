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
          console.log('FID:', (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime)
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', (entry as PerformanceEntry & { value: number }).value)
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch {
      console.log('Performance Observer not supported')
    }

    // Monitor page load time
    const handleLoad = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart)
          console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart)
        }
      } catch {
        console.log('Performance API not available')
      }
    }

    window.addEventListener('load', handleLoad)

    return () => {
      try {
        observer.disconnect()
        window.removeEventListener('load', handleLoad)
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [])

  // Don't render anything during SSR
  if (!mounted) return null

  return null
}
