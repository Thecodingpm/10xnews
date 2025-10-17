import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { newsAPI } from '@/lib/newsapi'

export async function POST(request: NextRequest) {
  try {
    console.log('Updating article content...')
    
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    
    // Get all articles that have sourceUrl but short content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const articles: any[] = await prisma.post.findMany({
      where: {
        sourceUrl: { not: null },
        OR: [
          { content: { contains: 'Full article content could not be retrieved' } },
          { content: { contains: 'No content available' } }
        ]
      },
      take: 5 // Update 5 articles at a time
    })

    console.log(`Found ${articles.length} articles to update`)

    const updatedArticles = []

    for (const article of articles) {
      try {
        if (!article.sourceUrl) continue

        console.log(`Updating content for: ${article.title}`)
        
        // Fetch full content
        const fullContent = await newsAPI.fetchFullArticleContent(article.sourceUrl)
        
        if (fullContent && fullContent.length > 500 && !fullContent.includes('could not be retrieved')) {
          // Update the article with full content
          await prisma.post.update({
            where: { id: article.id },
            data: {
              content: fullContent,
              readTime: Math.ceil(fullContent.split(' ').length / 200)
            }
          })

          updatedArticles.push({
            id: article.id,
            title: article.title,
            contentLength: fullContent.length
          })

          console.log(`✅ Updated: ${article.title} (${fullContent.length} chars)`)
        } else {
          console.log(`❌ Could not fetch content for: ${article.title}`)
        }
      } catch (error) {
        console.error(`Error updating article ${article.title}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedArticles.length} articles`,
      updatedArticles
    })

  } catch (error) {
    console.error('Error updating article content:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
