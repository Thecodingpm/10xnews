import cron from 'node-cron'
import { newsAPI, convertNewsArticleToPost } from './newsapi'
import { prisma } from './prisma'

// Schedule news fetching every 6 hours
const NEWS_FETCH_SCHEDULE = '0 */6 * * *' // Every 6 hours

// Schedule news fetching every 2 hours during business hours (9 AM - 9 PM)
const BUSINESS_HOURS_SCHEDULE = '0 9-21/2 * * *' // Every 2 hours from 9 AM to 9 PM

// Schedule cleanup of old articles every 24 hours
const CLEANUP_SCHEDULE = '0 2 * * *' // Every day at 2 AM

export class NewsScheduler {
  private isRunning = false

  async start() {
    if (this.isRunning) {
      console.log('News scheduler is already running')
      return
    }

    this.isRunning = true
    console.log('Starting news scheduler...')

    // Schedule regular news fetching
    cron.schedule(NEWS_FETCH_SCHEDULE, async () => {
      console.log('Running scheduled news fetch...')
      await this.fetchAndSaveNews()
    })

    // Schedule business hours news fetching (more frequent)
    cron.schedule(BUSINESS_HOURS_SCHEDULE, async () => {
      console.log('Running business hours news fetch...')
      await this.fetchAndSaveNews('business')
    })

    // Schedule cleanup of old articles
    cron.schedule(CLEANUP_SCHEDULE, async () => {
      console.log('Running article cleanup...')
      await this.cleanupOldArticles()
    })

    console.log('News scheduler started successfully')
  }

  async stop() {
    this.isRunning = false
    // Note: cron.destroy() is not available in this version
    // The scheduler will stop when the process restarts
    console.log('News scheduler stopped')
  }

  private async fetchAndSaveNews(category: string = 'tech') {
    try {
      console.log(`Fetching news for category: ${category}`)

      // Get news based on category
      let newsResponse
      switch (category) {
        case 'tech':
          newsResponse = await newsAPI.getTechNews(5) // Fetch 5 articles
          break
        case 'business':
          newsResponse = await newsAPI.getBusinessNews(5)
          break
        case 'health':
          newsResponse = await newsAPI.getHealthNews(5)
          break
        case 'science':
          newsResponse = await newsAPI.getScienceNews(5)
          break
        default:
          newsResponse = await newsAPI.getTechNews(5)
      }

      if (newsResponse.status !== 'ok') {
        throw new Error('Failed to fetch news from NewsAPI')
      }

      console.log(`Fetched ${newsResponse.articles.length} articles for ${category}`)

      if (!prisma) {
        console.log('Database not available, skipping news fetch')
        return
      }

      // Get or create admin user
      let adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })

      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: {
            email: 'admin@10xnews.com',
            name: '10xNews Staff',
            role: 'ADMIN',
          }
        })
      }

      // Get category
      let categoryRecord = await prisma.category.findFirst({
        where: { slug: category }
      })

      if (!categoryRecord) {
        // Create category if it doesn't exist
        const categoryNames: { [key: string]: string } = {
          tech: 'Technology',
          business: 'Business',
          health: 'Health',
          science: 'Science'
        }

        categoryRecord = await prisma.category.create({
          data: {
            name: categoryNames[category] || 'Technology',
            slug: category,
            description: `Latest news in ${categoryNames[category] || 'Technology'}`,
            color: 'bg-blue-500',
          }
        })
      }

      let savedCount = 0

      // Process each article
      for (const article of newsResponse.articles) {
        try {
          // Check if article already exists
          const existingPost = await prisma.post.findFirst({
            where: {
              OR: [
                { title: article.title },
                { sourceUrl: article.url }
              ]
            }
          })

          if (existingPost) {
            console.log(`Article already exists: ${article.title}`)
            continue
          }

          // Convert NewsAPI article to our post format
          const postData = await convertNewsArticleToPost(article, categoryRecord.id, true)

          // Create the post
          await prisma.post.create({
            data: {
              ...postData,
              authorId: adminUser.id,
              categoryId: categoryRecord.id,
            }
          })

          savedCount++
          console.log(`Saved article: ${postData.title}`)
        } catch (error) {
          console.error(`Error saving article "${article.title}":`, error)
        }
      }

      console.log(`Successfully saved ${savedCount} new articles for ${category}`)
    } catch (error) {
      console.error('Error in scheduled news fetch:', error)
    }
  }

  // Cleanup old articles (keep only last 50 articles from API sources)
  private async cleanupOldArticles() {
    try {
      console.log('Starting article cleanup...')
      
      if (!prisma) {
        console.log('Database not available, skipping cleanup')
        return
      }
      
      // Get all API-sourced articles (those with sourceUrl)
      const apiArticles = await prisma.post.findMany({
        where: {
          sourceUrl: { not: null }
        },
        orderBy: {
          publishedAt: 'desc'
        }
      })

      console.log(`Found ${apiArticles.length} API-sourced articles`)

      // Keep only the 50 most recent API articles
      if (apiArticles.length > 50) {
        const articlesToDelete = apiArticles.slice(50)
        const deleteIds = articlesToDelete.map(article => article.id)

        const deleteResult = await prisma.post.deleteMany({
          where: {
            id: { in: deleteIds }
          }
        })

        console.log(`Cleaned up ${deleteResult.count} old articles`)
      } else {
        console.log('No cleanup needed - under 50 API articles')
      }
    } catch (error) {
      console.error('Error during article cleanup:', error)
    }
  }

  // Manual fetch method
  async fetchNewsNow(category: string = 'tech', limit: number = 10) {
    try {
      console.log(`Manual fetch: ${category}, limit: ${limit}`)

      if (!prisma) {
        console.log('Database not available, skipping manual fetch')
        return
      }

      // Get news based on category
      let newsResponse
      switch (category) {
        case 'tech':
          newsResponse = await newsAPI.getTechNews(limit)
          break
        case 'business':
          newsResponse = await newsAPI.getBusinessNews(limit)
          break
        case 'health':
          newsResponse = await newsAPI.getHealthNews(limit)
          break
        case 'science':
          newsResponse = await newsAPI.getScienceNews(limit)
          break
        default:
          newsResponse = await newsAPI.getTechNews(limit)
      }

      if (newsResponse.status !== 'ok') {
        throw new Error('Failed to fetch news from NewsAPI')
      }

      // Get or create admin user
      let adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })

      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: {
            email: 'admin@10xnews.com',
            name: '10xNews Staff',
            role: 'ADMIN',
          }
        })
      }

      // Get category
      let categoryRecord = await prisma.category.findFirst({
        where: { slug: category }
      })

      if (!categoryRecord) {
        const categoryNames: { [key: string]: string } = {
          tech: 'Technology',
          business: 'Business',
          health: 'Health',
          science: 'Science'
        }

        categoryRecord = await prisma.category.create({
          data: {
            name: categoryNames[category] || 'Technology',
            slug: category,
            description: `Latest news in ${categoryNames[category] || 'Technology'}`,
            color: 'bg-blue-500',
          }
        })
      }

      const savedPosts = []
      let savedCount = 0

      // Process each article
      for (const article of newsResponse.articles) {
        try {
          // Check if article already exists
          const existingPost = await prisma.post.findFirst({
            where: {
              OR: [
                { title: article.title },
                { sourceUrl: article.url }
              ]
            }
          })

          if (existingPost) {
            console.log(`Article already exists: ${article.title}`)
            continue
          }

          // Convert NewsAPI article to our post format
          const postData = await convertNewsArticleToPost(article, categoryRecord.id, true)

          // Create the post
          const post = await prisma.post.create({
            data: {
              ...postData,
              authorId: adminUser.id,
              categoryId: categoryRecord.id,
            }
          })

          savedPosts.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            source: article.source.name
          })

          savedCount++
          console.log(`Saved article: ${postData.title}`)
        } catch (error) {
          console.error(`Error saving article "${article.title}":`, error)
        }
      }

      return {
        success: true,
        savedCount,
        savedPosts,
        totalFetched: newsResponse.articles.length
      }
    } catch (error) {
      console.error('Error in manual news fetch:', error)
      throw error
    }
  }
}

// Create singleton instance
export const newsScheduler = new NewsScheduler()
