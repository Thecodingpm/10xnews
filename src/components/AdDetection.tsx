'use client'

import { useState, useEffect } from 'react'

interface AdDetectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export default function AdDetection({ children, fallback, className = '' }: AdDetectionProps) {
  const [showAds, setShowAds] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Function to detect if ads are blocked
    const detectAdBlock = () => {
      // Create a test ad element
      const testAd = document.createElement('div')
      testAd.innerHTML = '&nbsp;'
      testAd.className = 'adsbox'
      testAd.style.cssText = 'position:absolute;left:-10000px;top:-1000px;width:1px;height:1px;'
      
      // Add common ad blocker selectors
      testAd.setAttribute('data-ad', 'test')
      testAd.setAttribute('data-ad-client', 'test')
      testAd.setAttribute('data-ad-slot', 'test')
      
      document.body.appendChild(testAd)
      
      // Check if the element is still there after a short delay
      setTimeout(() => {
        const isBlocked = !testAd.offsetParent || testAd.offsetHeight === 0 || testAd.offsetWidth === 0
        document.body.removeChild(testAd)
        
        // Also check for Brave browser specifically
        const isBrave = (navigator as unknown as {brave?: {isBrave?: boolean}}).brave?.isBrave
        const hasAdBlocker = isBlocked || isBrave
        
        setShowAds(!hasAdBlocker)
        setIsLoading(false)
      }, 100)
    }

    // Additional checks for ad blockers
    const checkAdBlocker = () => {
      // Check for common ad blocker extensions
      const adBlockerNames = [
        'uBlock Origin',
        'AdBlock',
        'AdBlock Plus',
        'Ghostery',
        'Privacy Badger',
        'AdGuard'
      ]
      
      let hasAdBlocker = false
      
      // Check for ad blocker scripts
      for (const name of adBlockerNames) {
        if (document.querySelector(`[data-adblocker="${name}"]`) || 
            window.getComputedStyle(document.body).getPropertyValue('--adblocker') === name) {
          hasAdBlocker = true
          break
        }
      }
      
      // Check for blocked requests
      const testScript = document.createElement('script')
      testScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      testScript.onerror = () => {
        hasAdBlocker = true
        setShowAds(false)
        setIsLoading(false)
      }
      testScript.onload = () => {
        setShowAds(true)
        setIsLoading(false)
      }
      
      document.head.appendChild(testScript)
      
      // Fallback timeout
      setTimeout(() => {
        if (isLoading) {
          setShowAds(!hasAdBlocker)
          setIsLoading(false)
        }
      }, 2000)
    }

    // Run detection
    detectAdBlock()
    checkAdBlocker()
  }, [isLoading])

  // Show loading state
  if (isLoading) {
    return null
  }

  // Show ads only if they're allowed
  if (showAds) {
    return <div className={className}>{children}</div>
  }

  // Show fallback or nothing
  return fallback ? <div className={className}>{fallback}</div> : null
}

// Individual ad space component
export function AdSpace({ 
  size = 'medium', 
  className = '',
  children 
}: { 
  size?: 'small' | 'medium' | 'large'
  className?: string
  children?: React.ReactNode
}) {
  const sizeClasses = {
    small: 'h-20',
    medium: 'h-32',
    large: 'h-48'
  }

  return (
    <AdDetection
      className={className}
      fallback={
        <div className="text-center py-4">
          <div className="text-gray-400 text-sm">Ad space hidden (ad blocker detected)</div>
        </div>
      }
    >
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center ${sizeClasses[size]}`}>
        {children || (
          <>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Advertisement</div>
            <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center h-full">
              <span className="text-gray-400">Ad Space</span>
            </div>
          </>
        )}
      </div>
    </AdDetection>
  )
}
