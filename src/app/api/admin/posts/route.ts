import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createPost, getPosts } from '@/lib/firebase-data'

interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !(session as { user?: SessionUser }).user || (session as { user: SessionUser }).user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await getPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/posts - Starting request')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'Found' : 'Not found')
    console.log('Session user:', (session as { user?: SessionUser })?.user)

    // For development, allow access if session exists (since we bypassed auth)
    if (!session) {
      console.log('No session found')
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Check if user has admin role or if it's our bypassed session
    const user = (session as { user: SessionUser }).user
    if (user.role !== 'ADMIN' && user.email !== 'ahmadmuaaz292@gmail.com') {
      console.log('Unauthorized access attempt - role:', user.role, 'email:', user.email)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body received:', { 
      title: body.title, 
      slug: body.slug, 
      hasContent: !!body.content,
      published: body.published 
    })

    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      featured,
      sponsored,
      categoryId,
      tags,
      seoTitle,
      seoDescription,
      keywords,
    } = body

    // Create post data for Firebase
    const postData = {
      title,
      slug,
      content,
      excerpt,
      coverImage: coverImage || null,
      published: published || false,
      featured: featured || false,
      sponsored: sponsored || false,
      authorId: 'admin-user-id', // We'll use a fixed admin user ID for now
      author: {
        name: '10xNews Staff',
        image: null
      },
      categoryId: categoryId || null,
      category: null, // Will be populated by Firebase function
      tags: tags || [],
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      keywords: keywords || [],
      views: 0,
      readTime: Math.ceil((content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 200) || 1,
      publishedAt: published ? new Date() : null,
    }

    console.log('Creating post in Firebase...')
    const post = await createPost(postData)
    console.log('Post created successfully:', post.id)
    
    return NextResponse.json({ post })
  } catch (error: unknown) {
    console.error('Error creating post:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json({ 
      error: `Internal Server Error: ${errorMessage}`,
      details: errorMessage 
    }, { status: 500 })
  }
}
