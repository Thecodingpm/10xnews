import axios from 'axios'
import * as cheerio from 'cheerio'

const NEWS_API_KEY = process.env.NEWS_API_KEY || '5c2246a913b448149f5ffc8a3cd87400'
const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

export interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

export class NewsAPIService {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string = NEWS_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = NEWS_API_BASE_URL
  }

  // Get top headlines
  async getTopHeadlines(params: {
    country?: string
    category?: string
    sources?: string
    q?: string
    pageSize?: number
    page?: number
  } = {}): Promise<NewsApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: {
          apiKey: this.apiKey,
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching top headlines:', error)
      throw error
    }
  }

  // Get everything (all articles)
  async getEverything(params: {
    q?: string
    sources?: string
    domains?: string
    from?: string
    to?: string
    language?: string
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt'
    pageSize?: number
    page?: number
  } = {}): Promise<NewsApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          apiKey: this.apiKey,
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching everything:', error)
      throw error
    }
  }

  // Get sources
  async getSources(params: {
    category?: string
    language?: string
    country?: string
  } = {}): Promise<{articles: Array<{title: string, description: string, url: string, urlToImage: string, publishedAt: string, source: {name: string}}>}> {
    try {
      const response = await axios.get(`${this.baseUrl}/sources`, {
        params: {
          apiKey: this.apiKey,
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching sources:', error)
      throw error
    }
  }

  // Get tech news specifically
  async getTechNews(pageSize: number = 20): Promise<NewsApiResponse> {
    return this.getEverything({
      q: 'technology OR tech OR software OR AI OR artificial intelligence OR startup OR innovation',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize
    })
  }

  // Get business news
  async getBusinessNews(pageSize: number = 20): Promise<NewsApiResponse> {
    return this.getTopHeadlines({
      category: 'business',
      country: 'us',
      pageSize
    })
  }

  // Get health news
  async getHealthNews(pageSize: number = 20): Promise<NewsApiResponse> {
    return this.getTopHeadlines({
      category: 'health',
      country: 'us',
      pageSize
    })
  }

  // Get science news
  async getScienceNews(pageSize: number = 20): Promise<NewsApiResponse> {
    return this.getEverything({
      q: 'science OR research OR study OR medical OR health technology',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize
    })
  }

  // Fetch full article content from URL
  async fetchFullArticleContent(url: string): Promise<string> {
    try {
      console.log(`Fetching full content from: ${url}`)
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      })

      const $ = cheerio.load(response.data)
      
      // Remove unwanted elements first
      $('script, style, nav, .advertisement, .ad, .sidebar, .comments, .social-share, .related-articles, .newsletter, .subscribe, .footer, header, .header').remove()
      
      // Try to find article content using comprehensive selectors
      let content = ''
      
      // Comprehensive article content selectors for different news sites
      const contentSelectors = [
        // Generic article selectors
        'article',
        'main article',
        '.article-content',
        '.post-content',
        '.entry-content',
        '.article-body',
        '.content',
        '.story-body',
        '.article-text',
        '.post-text',
        '.entry-text',
        '.article-main',
        '.post-main',
        '.entry-main',
        
        // News site specific selectors
        '[data-module="ArticleBody"]',
        '.ArticleBody',
        '.caas-body',
        '.article__body',
        '.post__body',
        '.entry__body',
        '.story__body',
        '.content__body',
        '.article__content',
        '.post__content',
        '.entry__content',
        '.story__content',
        '.content__content',
        
        // Main content areas
        'main',
        '.main-content',
        '.main-article',
        '.main-story',
        '.main-post',
        '.main-entry',
        
        // Specific to financial/news sites
        '.caas-body',
        '.caas-content',
        '.article-content-body',
        '.story-content-body',
        '.post-content-body',
        '.entry-content-body'
      ]

      for (const selector of contentSelectors) {
        const element = $(selector)
        if (element.length > 0) {
          content = element.text().trim()
          if (content.length > 800) { // Only use if substantial content
            console.log(`Found content with selector: ${selector} (${content.length} chars)`)
            break
          }
        }
      }

      // If no specific content found, try to get all paragraphs from the body
      if (!content || content.length < 800) {
        const paragraphs = $('body p').map((i, el) => {
          const text = $(el).text().trim()
          return text.length > 50 ? text : '' // Only include substantial paragraphs
        }).get().filter(p => p.length > 0)
        
        content = paragraphs.join('\n\n').trim()
        console.log(`Used paragraph extraction: ${content.length} chars`)
      }

      // If still no good content, try to get text from divs
      if (!content || content.length < 800) {
        const divs = $('body div').map((i, el) => {
          const text = $(el).text().trim()
          return text.length > 100 ? text : ''
        }).get().filter(d => d.length > 0)
        
        // Take the longest div content
        if (divs.length > 0) {
          content = divs.sort((a, b) => b.length - a.length)[0]
          console.log(`Used div extraction: ${content.length} chars`)
        }
      }

      // Clean up the content
      if (content) {
        content = content
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
          .replace(/^\s+|\s+$/g, '') // Trim start and end
          .trim()
      }

      console.log(`Final content length: ${content.length} characters`)
      
      if (content && content.length > 500) {
        return content
      } else {
        return 'Full article content could not be retrieved. Please visit the original source for the complete article.'
      }
      
    } catch (error) {
      console.error(`Error fetching full content from ${url}:`, error)
      return 'Full article content could not be retrieved. Please visit the original source for the complete article.'
    }
  }
}

// Create a singleton instance
export const newsAPI = new NewsAPIService()

// Helper function to convert NewsAPI article to our post format
export async function convertNewsArticleToPost(article: NewsArticle, categoryId?: string, fetchFullContent: boolean = true) {
  // Generate slug from title
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  // Try to get full content if requested and URL is available
  let fullContent = article.content || article.description || 'No content available'
  
  if (fetchFullContent && article.url && !article.content) {
    try {
      console.log(`Attempting to fetch full content for: ${article.title}`)
      const newsAPI = new NewsAPIService()
      fullContent = await newsAPI.fetchFullArticleContent(article.url)
    } catch (error) {
      console.error(`Failed to fetch full content for ${article.title}:`, error)
      fullContent = article.description || 'No content available'
    }
  }

  // Calculate read time (average 200 words per minute)
  const wordCount = fullContent.split(' ').length
  const readTime = Math.ceil(wordCount / 200)

  return {
    title: article.title,
    slug: slug,
    content: fullContent,
    excerpt: article.description || 'No description available',
    coverImage: article.urlToImage || '',
    published: true,
    featured: false,
    sponsored: false,
    authorId: '', // Will be set to admin user
    categoryId: categoryId || null,
    tags: extractTagsFromContent(fullContent),
    seoTitle: article.title,
    seoDescription: article.description || 'No description available',
    keywords: extractKeywordsFromContent(fullContent),
    readTime: readTime,
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    views: 0,
    sourceUrl: article.url,
    sourceName: article.source.name
  }
}

// Extract tags from content
function extractTagsFromContent(content: string): string[] {
  if (!content) return []
  
  const techKeywords = [
    'AI', 'artificial intelligence', 'machine learning', 'blockchain', 'cryptocurrency',
    'startup', 'innovation', 'technology', 'software', 'hardware', 'mobile',
    'web development', 'programming', 'coding', 'data science', 'cloud computing',
    'cybersecurity', 'fintech', 'edtech', 'healthtech', 'biotech', 'robotics',
    'automation', 'IoT', 'internet of things', '5G', 'quantum computing',
    'virtual reality', 'VR', 'augmented reality', 'AR', 'metaverse'
  ]

  const tags: string[] = []
  const contentLower = content.toLowerCase()

  techKeywords.forEach(keyword => {
    if (contentLower.includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
  })

  return tags.slice(0, 5) // Limit to 5 tags
}

// Extract keywords from content
function extractKeywordsFromContent(content: string): string[] {
  if (!content) return []
  
  // Simple keyword extraction - in production, you might want to use a more sophisticated approach
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'come', 'here', 'just', 'into', 'over', 'think', 'back', 'then', 'them', 'these', 'she', 'work', 'first', 'may', 'say', 'use', 'her', 'many', 'way', 'would', 'like', 'make', 'him', 'into', 'time', 'has', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'].includes(word))

  // Count word frequency
  const wordCount: { [key: string]: number } = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })

  // Return top 10 most frequent words
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}
