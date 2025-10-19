import { NextResponse } from 'next/server'
import { getPosts, getCategories } from '@/lib/firebase-data'

export async function GET() {
  try {
    console.log('Testing Firebase connection...')
    
    // Test getting posts
    const posts = await getPosts()
    console.log('Posts fetched:', Array.isArray(posts) ? posts.length : 'Not an array')
    
    // Test getting categories
    const categories = await getCategories()
    console.log('Categories fetched:', Array.isArray(categories) ? categories.length : 'Not an array')
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      data: {
        postsCount: Array.isArray(posts) ? posts.length : 0,
        categoriesCount: Array.isArray(categories) ? categories.length : 0,
        posts: Array.isArray(posts) ? posts.slice(0, 3).map(p => ({ id: p.id, title: p.title, published: p.published })) : [],
        categories: Array.isArray(categories) ? categories.slice(0, 3).map(c => ({ id: c.id, name: c.name, slug: c.slug })) : []
      }
    })
  } catch (error) {
    console.error('Firebase test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Firebase connection failed'
    }, { status: 500 })
  }
}
