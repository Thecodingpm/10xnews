'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  adStyle?: React.CSSProperties
  className?: string
  testMode?: boolean
}

export default function AdSlot({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' },
  className = '',
  testMode = false
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (testMode) return

    try {
      // @ts-expect-error - Google AdSense global
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-expect-error - Google AdSense global
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  if (testMode) {
    return (
      <div 
        className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 ${className}`}
        style={adStyle}
      >
        <p>Ad Slot: {adSlot}</p>
        <p className="text-sm">Format: {adFormat}</p>
      </div>
    )
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Predefined ad slot components for common placements
export function HeaderAd() {
  return (
    <AdSlot
      adSlot="1234567890"
      adFormat="horizontal"
      className="w-full max-w-4xl mx-auto mb-8"
    />
  )
}

export function SidebarAd() {
  return (
    <AdSlot
      adSlot="1234567891"
      adFormat="vertical"
      className="w-full sticky top-8"
    />
  )
}

export function InContentAd() {
  return (
    <AdSlot
      adSlot="1234567892"
      adFormat="rectangle"
      className="w-full max-w-2xl mx-auto my-8"
    />
  )
}

export function FooterAd() {
  return (
    <AdSlot
      adSlot="1234567893"
      adFormat="horizontal"
      className="w-full max-w-4xl mx-auto mt-8"
    />
  )
}
