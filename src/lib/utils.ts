import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatReadingTime(content: string) {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return readingTime
}

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateExcerpt(content: string, maxLength: number = 160) {
  const plainText = content.replace(/<[^>]*>/g, '')
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function generateMetaDescription(content: string, maxLength: number = 160) {
  const plainText = content.replace(/<[^>]*>/g, '')
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}
