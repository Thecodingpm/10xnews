import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

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
    console.log('Session user:', session?.user)

    // For development, allow access if session exists (since we bypassed auth)
    if (!session) {
      console.log('No session found')
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Check if user has admin role or if it's our bypassed session
    if (session.user.role !== 'ADMIN' && session.user.email !== 'ahmadmuaaz292@gmail.com') {
      console.log('Unauthorized access attempt - role:', session.user.role, 'email:', session.user.email)
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

    // Find or create admin user since we bypassed auth
    console.log('Looking for admin user...')
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    console.log('Admin user found:', adminUser ? 'Yes' : 'No')

    if (!adminUser) {
      console.log('Creating admin user...')
      // Create admin user if not found
      adminUser = await prisma.user.create({
        data: {
            email: 'admin@10xnews.com',
            name: '10xNews Staff',
          role: 'ADMIN',
        }
      })
      console.log('Admin user created:', adminUser.id)
    }

    console.log('Creating post with authorId:', adminUser.id)
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published: published || false,
        featured: featured || false,
        sponsored: sponsored || false,
        authorId: adminUser.id,
        categoryId: categoryId || null,
        tags: tags || [],
        seoTitle,
        seoDescription,
        keywords: keywords || [],
        readTime: Math.ceil(content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200),
        publishedAt: published ? new Date() : null,
      },
    })

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
