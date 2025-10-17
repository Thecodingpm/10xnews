import { NextRequest, NextResponse } from 'next/server'
import { newsAPI, convertNewsArticleToPost } from '@/lib/newsapi'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { category, limit = 10 } = await request.json()

    console.log(`Fetching news for category: ${category}, limit: ${limit}`)

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

    console.log(`Fetched ${newsResponse.articles.length} articles`)

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

    const savedPosts = []
    const errors = []

    // Process each article
    for (const article of newsResponse.articles) {
      try {
          // Check if article already exists
          const existingPost = await prisma.post.findFirst({
            where: {
              title: article.title
            }
          })

        if (existingPost) {
          console.log(`Article already exists: ${article.title}`)
          continue
        }

        // Convert NewsAPI article to our post format
                const postData = await convertNewsArticleToPost(article, categoryRecord.id, true)

        // Create the post (remove sourceUrl and sourceName for now)
        const { sourceUrl, sourceName, ...postDataWithoutSource } = postData
        const post = await prisma.post.create({
          data: {
            ...postDataWithoutSource,
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

        console.log(`Saved article: ${post.title}`)
      } catch (error) {
        console.error(`Error saving article "${article.title}":`, error)
        errors.push({
          title: article.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully fetched and saved ${savedPosts.length} articles`,
      savedPosts,
      errors,
      totalFetched: newsResponse.articles.length
    })

  } catch (error) {
    console.error('Error in fetch news API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch news without saving
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'tech'
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log(`Fetching news preview for category: ${category}, limit: ${limit}`)

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

    return NextResponse.json({
      success: true,
      articles: newsResponse.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name,
        author: article.author
      })),
      totalResults: newsResponse.totalResults
    })

  } catch (error) {
    console.error('Error in fetch news preview API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
