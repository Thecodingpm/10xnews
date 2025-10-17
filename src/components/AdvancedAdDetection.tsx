'use client'

import { useState, useEffect } from 'react'

interface AdvancedAdDetectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export default function AdvancedAdDetection({ children, fallback, className = '' }: AdvancedAdDetectionProps) {
  const [showAds, setShowAds] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [, setDetectedBlocker] = useState<string | null>(null)

  useEffect(() => {
    const detectAdBlockers = async () => {
      let hasAdBlocker = false
      let blockerName = ''

      // 1. Detect Brave browser
      if ((navigator as unknown as {brave?: {isBrave?: boolean}}).brave?.isBrave) {
        hasAdBlocker = true
        blockerName = 'Brave Browser'
      }

      // 2. Detect common ad blocker extensions
      const adBlockerTests = [
        {
          name: 'uBlock Origin',
          test: () => {
            return window.getComputedStyle(document.body).getPropertyValue('--adblocker') === 'uBlock Origin' ||
                   document.querySelector('[data-adblocker="uBlock Origin"]') !== null
          }
        },
        {
          name: 'AdBlock Plus',
          test: () => {
            return window.getComputedStyle(document.body).getPropertyValue('--adblocker') === 'AdBlock Plus' ||
                   document.querySelector('[data-adblocker="AdBlock Plus"]') !== null
          }
        },
        {
          name: 'AdBlock',
          test: () => {
            return window.getComputedStyle(document.body).getPropertyValue('--adblocker') === 'AdBlock' ||
                   document.querySelector('[data-adblocker="AdBlock"]') !== null
          }
        },
        {
          name: 'Ghostery',
          test: () => {
            return window.getComputedStyle(document.body).getPropertyValue('--adblocker') === 'Ghostery' ||
                   document.querySelector('[data-adblocker="Ghostery"]') !== null
          }
        },
        {
          name: 'Privacy Badger',
          test: () => {
            return window.getComputedStyle(document.body).getPropertyValue('--adblocker') === 'Privacy Badger' ||
                   document.querySelector('[data-adblocker="Privacy Badger"]') !== null
          }
        },
        {
          name: 'AdGuard',
          test: () => {
            return window.getComputedStyle(document.body).getPropertyValue('--adblocker') === 'AdGuard' ||
                   document.querySelector('[data-adblocker="AdGuard"]') !== null
          }
        }
      ]

      // Test for ad blocker extensions
      for (const blocker of adBlockerTests) {
        if (blocker.test()) {
          hasAdBlocker = true
          blockerName = blocker.name
          break
        }
      }

      // 3. Test if ads are actually blocked by creating a test ad
      if (!hasAdBlocker) {
        const testAd = document.createElement('div')
        testAd.innerHTML = '&nbsp;'
        testAd.className = 'adsbox'
        testAd.style.cssText = 'position:absolute;left:-10000px;top:-1000px;width:1px;height:1px;'
        testAd.setAttribute('data-ad', 'test')
        testAd.setAttribute('data-ad-client', 'test')
        testAd.setAttribute('data-ad-slot', 'test')
        
        document.body.appendChild(testAd)
        
        setTimeout(() => {
          const isBlocked = !testAd.offsetParent || testAd.offsetHeight === 0 || testAd.offsetWidth === 0
          document.body.removeChild(testAd)
          
          if (isBlocked) {
            hasAdBlocker = true
            blockerName = 'Unknown Ad Blocker'
          }
        }, 100)
      }

      // 4. Test Google AdSense availability
      if (!hasAdBlocker) {
        try {
          // Try to load a test ad script
          const testScript = document.createElement('script')
          testScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
          testScript.async = true
          
          testScript.onerror = () => {
            hasAdBlocker = true
            blockerName = 'Network Ad Blocker'
            setShowAds(false)
            setDetectedBlocker(blockerName)
            setIsLoading(false)
          }
          
          testScript.onload = () => {
            setShowAds(true)
            setDetectedBlocker(null)
            setIsLoading(false)
          }
          
          document.head.appendChild(testScript)
          
          // Fallback timeout
          setTimeout(() => {
            if (isLoading) {
              setShowAds(!hasAdBlocker)
              setDetectedBlocker(hasAdBlocker ? blockerName : null)
              setIsLoading(false)
            }
          }, 3000)
        } catch (error) {
          hasAdBlocker = true
          blockerName = 'Script Error'
        }
      }

      // Set final state
      if (hasAdBlocker) {
        setShowAds(false)
        setDetectedBlocker(blockerName)
      } else {
        setShowAds(true)
        setDetectedBlocker(null)
      }
      
      setIsLoading(false)
    }

    detectAdBlockers()
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

// Enhanced ad space component with better detection
export function SmartAdSpace({ 
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
    <AdvancedAdDetection
      className={className}
      fallback={
        <div className="text-center py-2">
          <div className="text-gray-400 text-xs">
            Ad space hidden (ad blocker detected)
          </div>
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
    </AdvancedAdDetection>
  )
}

// Debug component to show what's detected
export function AdDetectionDebug() {
  const [detectionInfo, setDetectionInfo] = useState<{
    brave: boolean
    adBlockers: string[]
    adsAllowed: boolean
  }>({
    brave: false,
    adBlockers: [],
    adsAllowed: false
  })

  useEffect(() => {
    const detect = () => {
      const brave = (navigator as unknown as {brave?: {isBrave?: boolean}}).brave?.isBrave
      const adBlockers: string[] = []
      
      // Check for common ad blockers
      const blockers = ['uBlock Origin', 'AdBlock Plus', 'AdBlock', 'Ghostery', 'Privacy Badger', 'AdGuard']
      blockers.forEach(blocker => {
        if (window.getComputedStyle(document.body).getPropertyValue('--adblocker') === blocker) {
          adBlockers.push(blocker)
        }
      })
      
      setDetectionInfo({
        brave,
        adBlockers,
        adsAllowed: !brave && adBlockers.length === 0
      })
    }
    
    detect()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-2">Ad Detection Debug:</div>
      <div>Brave: {detectionInfo.brave ? 'Yes' : 'No'}</div>
      <div>Ad Blockers: {detectionInfo.adBlockers.length > 0 ? detectionInfo.adBlockers.join(', ') : 'None'}</div>
      <div>Ads Allowed: {detectionInfo.adsAllowed ? 'Yes' : 'No'}</div>
    </div>
  )
}
