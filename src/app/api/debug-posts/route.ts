import { NextResponse } from 'next/server'
import { getPosts } from '@/lib/firebase-data'

export async function GET() {
  try {
    console.log('Debug API: Fetching all posts...')
    const posts = await getPosts()
    
    console.log('Debug API: Found', posts.length, 'posts')
    
    const debugInfo = posts.map(post => ({
      id: post.id,
      title: post.title,
      published: post.published,
      featured: post.featured,
      views: post.views,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      slug: post.slug,
      author: post.author,
      category: post.category
    }))
    
    return NextResponse.json({ 
      totalPosts: posts.length,
      posts: debugInfo,
      publishedPosts: posts.filter(p => p.published).length,
      unpublishedPosts: posts.filter(p => !p.published).length
    })
  } catch (error) {
    console.error('Debug API Error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      totalPosts: 0,
      posts: []
    }, { status: 500 })
  }
}
