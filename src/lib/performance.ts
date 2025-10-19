// Performance utilities for better caching and data fetching

export const CACHE_KEYS = {
  POSTS: 'posts',
  FEATURED_POSTS: 'featured_posts',
  CATEGORIES: 'categories',
} as const

// Cache configuration
export const CACHE_CONFIG = {
  POSTS_TTL: 300, // 5 minutes
  CATEGORIES_TTL: 3600, // 1 hour
  STATIC_TTL: 86400, // 24 hours
} as const

// Debounce utility for search and filtering
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for scroll events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Image optimization helper
export function getOptimizedImageUrl(
  src: string,
  width: number,
  height?: number,
  quality: number = 75
): string {
  // If it's already an optimized URL, return as is
  if (src.includes('w_') || src.includes('h_') || src.includes('q_')) {
    return src
  }
  
  // For Cloudinary URLs
  if (src.includes('cloudinary.com')) {
    const baseUrl = src.split('/upload/')[0]
    const imagePath = src.split('/upload/')[1]
    const transformations = `w_${width}${height ? `,h_${height}` : ''},q_${quality},f_auto`
    return `${baseUrl}/upload/${transformations}/${imagePath}`
  }
  
  // For other URLs, return as is
  return src
}

// Lazy loading intersection observer
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return
  
  // Preload critical fonts
  const fontPreloads = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  ]
  
  fontPreloads.forEach((href) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    document.head.appendChild(link)
  })
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === 'undefined') {
    fn()
    return
  }
  
  const start = performance.now()
  fn()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start} milliseconds`)
  }
}
