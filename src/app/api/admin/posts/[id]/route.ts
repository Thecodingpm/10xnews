import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPostById, updatePost, deletePost } from '@/lib/firebase-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await getPostById(resolvedParams.id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
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

    const updateData = {
      title,
      slug,
      content,
      excerpt,
      coverImage: coverImage || null,
      published: published || false,
      featured: featured || false,
      sponsored: sponsored || false,
      categoryId: categoryId || null,
      tags: tags || [],
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      keywords: keywords || [],
      readTime: Math.ceil((content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 200) || 1,
      publishedAt: published ? new Date() : null,
    }

    const post = await updatePost(resolvedParams.id, updateData)

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deletePost(resolvedParams.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
