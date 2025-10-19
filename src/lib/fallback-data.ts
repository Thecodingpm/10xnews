// Fallback data for when Firebase is not available
export interface FallbackPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string | null
  published: boolean
  featured: boolean
  sponsored: boolean
  authorId: string
  author: {
    name: string
    image: string | null
  }
  categoryId: string | null
  category: {
    name: string
    slug: string
    color: string | null
  } | null
  tags: string[]
  seoTitle: string | null
  seoDescription: string | null
  keywords: string[]
  views: number
  readTime: number
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

// Sample fallback posts for demonstration
export const fallbackPosts: FallbackPost[] = [
  {
    id: 'fallback-1',
    title: 'Welcome to 10xNews - Your Source for Latest Updates',
    slug: 'welcome-to-10xnews',
    content: `
      <h1>Welcome to 10xNews</h1>
      <p>Thank you for visiting 10xNews! We're your trusted source for the latest news and updates across various categories including technology, business, health, education, and more.</p>
      
      <h2>What We Offer</h2>
      <ul>
        <li>Latest technology news and updates</li>
        <li>Business and economic insights</li>
        <li>Health and wellness information</li>
        <li>Educational content and resources</li>
        <li>Pakistan-specific news and updates</li>
      </ul>
      
      <p>Our team of experienced journalists and content creators work around the clock to bring you accurate, timely, and relevant news that matters to you.</p>
      
      <h2>Stay Connected</h2>
      <p>Make sure to bookmark our site and check back regularly for the latest updates. You can also follow us on social media for real-time news alerts.</p>
      
      <p>If you have any questions or feedback, please don't hesitate to contact us through our contact page.</p>
    `,
    excerpt: 'Welcome to 10xNews - your trusted source for the latest news and updates across technology, business, health, education, and more.',
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
    published: true,
    featured: true,
    sponsored: false,
    authorId: 'admin',
    author: {
      name: '10xNews Staff',
      image: null
    },
    categoryId: 'general',
    category: {
      name: 'General',
      slug: 'general',
      color: '#3B82F6'
    },
    tags: ['welcome', 'news', 'updates'],
    seoTitle: 'Welcome to 10xNews - Latest News and Updates',
    seoDescription: 'Welcome to 10xNews - your trusted source for the latest news and updates across technology, business, health, education, and more.',
    keywords: ['news', 'updates', 'technology', 'business', 'health'],
    views: 0,
    readTime: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date()
  },
  {
    id: 'fallback-2',
    title: 'Understanding the Latest Technology Trends',
    slug: 'understanding-latest-technology-trends',
    content: `
      <h1>Understanding the Latest Technology Trends</h1>
      <p>Technology is evolving at an unprecedented pace, and staying updated with the latest trends is crucial for both individuals and businesses.</p>
      
      <h2>Key Technology Trends for 2024</h2>
      
      <h3>Artificial Intelligence and Machine Learning</h3>
      <p>AI and ML continue to revolutionize various industries, from healthcare to finance. The integration of AI in everyday applications is becoming more seamless and intuitive.</p>
      
      <h3>Cloud Computing</h3>
      <p>Cloud computing has become the backbone of modern digital infrastructure, enabling businesses to scale efficiently and reduce operational costs.</p>
      
      <h3>Cybersecurity</h3>
      <p>With the increasing digitization of our lives, cybersecurity has become more important than ever. Organizations are investing heavily in protecting their digital assets.</p>
      
      <h3>Internet of Things (IoT)</h3>
      <p>IoT devices are becoming more prevalent in our homes and workplaces, creating new opportunities for automation and data collection.</p>
      
      <h2>Impact on Society</h2>
      <p>These technological advances are reshaping how we work, communicate, and live. It's important to understand these changes and adapt accordingly.</p>
      
      <p>Stay tuned to 10xNews for more insights into the world of technology and its impact on our daily lives.</p>
    `,
    excerpt: 'Explore the latest technology trends shaping our world in 2024, from AI and machine learning to cloud computing and cybersecurity.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
    published: true,
    featured: false,
    sponsored: false,
    authorId: 'admin',
    author: {
      name: 'Tech Editor',
      image: null
    },
    categoryId: 'tech-telecom',
    category: {
      name: 'Tech & Telecom',
      slug: 'tech-telecom',
      color: '#3B82F6'
    },
    tags: ['technology', 'trends', 'AI', 'cloud computing'],
    seoTitle: 'Latest Technology Trends 2024 - AI, Cloud, Cybersecurity',
    seoDescription: 'Explore the latest technology trends shaping our world in 2024, from AI and machine learning to cloud computing and cybersecurity.',
    keywords: ['technology', 'trends', 'AI', 'cloud computing', 'cybersecurity'],
    views: 0,
    readTime: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date()
  }
]

export function getFallbackPostBySlug(slug: string): FallbackPost | null {
  return fallbackPosts.find(post => post.slug === slug && post.published) || null
}

export function getAllFallbackPosts(): FallbackPost[] {
  return fallbackPosts.filter(post => post.published)
}

export function getFallbackFeaturedPosts(limit: number = 3): FallbackPost[] {
  return fallbackPosts.filter(post => post.published && post.featured).slice(0, limit)
}
