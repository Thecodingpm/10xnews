'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeDebug() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm">
      <h3 className="font-bold mb-2">Theme Debug</h3>
      <div className="space-y-1">
        <div>Theme: {theme}</div>
        <div>Resolved: {resolvedTheme}</div>
        <div>System: {systemTheme}</div>
        <div>Mounted: {mounted ? 'Yes' : 'No'}</div>
      </div>
      <div className="mt-2 space-x-2">
        <button
          onClick={() => setTheme('light')}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
        >
          System
        </button>
      </div>
    </div>
  )
}
