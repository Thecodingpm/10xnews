import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

const defaultConfig = {
  siteName: '10xNews',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  twitterHandle: '@10xnews',
  defaultImage: '/og-image.jpg',
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage,
    ogType = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noindex = false,
    nofollow = false,
  } = config

  const fullTitle = title.includes('10xNews') ? title : `${title} | 10xNews`
  const canonicalUrl = canonical ? `${defaultConfig.siteUrl}${canonical}` : defaultConfig.siteUrl
  const imageUrl = ogImage ? `${defaultConfig.siteUrl}${ogImage}` : `${defaultConfig.siteUrl}${defaultConfig.defaultImage}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : [{ name: '10xNews Team' }],
    creator: '10xNews',
    publisher: '10xNews',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(defaultConfig.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(ogType === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : ['10xNews Team'],
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: defaultConfig.twitterHandle,
      images: [imageUrl],
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata
}

export function generateStructuredData(type: 'article' | 'website' | 'organization', data: any) {
  const baseUrl = defaultConfig.siteUrl

  switch (type) {
    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image ? `${baseUrl}${data.image}` : undefined,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        author: {
          '@type': 'Person',
          name: data.author || '10xNews Team',
        },
        publisher: {
          '@type': 'Organization',
          name: defaultConfig.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}${data.canonical}`,
        },
        ...(data.section && { articleSection: data.section }),
        ...(data.tags && { keywords: data.tags.join(', ') }),
      }

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: defaultConfig.siteName,
        url: baseUrl,
        description: 'Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, and industry analysis that matters.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }

    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: defaultConfig.siteName,
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, and industry analysis that matters.',
        sameAs: [
          'https://twitter.com/10xnews',
          'https://facebook.com/10xnews',
          'https://linkedin.com/company/10xnews',
        ],
      }

    default:
      return null
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${defaultConfig.siteUrl}${item.url}`,
    })),
  }
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// SEO-friendly URL generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Meta description optimization
export function optimizeDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description
  
  // Try to cut at sentence boundary
  const sentences = description.split('. ')
  let result = ''
  
  for (const sentence of sentences) {
    if ((result + sentence + '. ').length <= maxLength) {
      result += sentence + '. '
    } else {
      break
    }
  }
  
  // If no sentences fit, cut at word boundary
  if (!result) {
    const words = description.split(' ')
    result = words.slice(0, -1).join(' ') + '...'
  }
  
  return result.trim()
}

// Title optimization
export function optimizeTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title
  
  // Try to cut at word boundary
  const words = title.split(' ')
  let result = ''
  
  for (const word of words) {
    if ((result + ' ' + word).trim().length <= maxLength) {
      result += ' ' + word
    } else {
      break
    }
  }
  
  return result.trim() + '...'
}
