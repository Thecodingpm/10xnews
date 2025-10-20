import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  // startAfter,
  increment
} from 'firebase/firestore'
import { db } from './firebase'

// Types
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string | null
  images: string[] // Array of additional images
  published: boolean
  featured: boolean
  sponsored: boolean
  authorId: string
  author: {
    name: string
    image?: string | null
  }
  categoryId?: string
  category: {
    name: string
    slug: string
    color: string | null
  } | null
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  keywords: string[]
  views: number
  readTime: number
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name?: string
  email: string
  image?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

// Posts Collection
const postsCollection = db ? collection(db, 'posts') : null
const categoriesCollection = db ? collection(db, 'categories') : null
const usersCollection = db ? collection(db, 'users') : null

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Posts Functions
export async function getPosts(whereClause?: unknown, orderByClause?: unknown, limitCount?: number) {
  const cacheKey = `posts_${JSON.stringify({ whereClause, orderByClause, limitCount })}`
  const cached = getCachedData(cacheKey)
  if (cached && Array.isArray(cached)) return cached

  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      console.log('Firebase not initialized, returning empty array')
      return []
    }

    // For debugging, let's fetch all posts first
    let q = query(
      postsCollection, 
      orderBy('createdAt', 'desc')
    )
    
    if (limitCount) {
      q = query(q, limit(limitCount))
    }
    
    const snapshot = await getDocs(q)
    console.log('Firebase getPosts: Found', snapshot.docs.length, 'total posts')
    
    // If no posts found, return empty array instead of error
    if (snapshot.empty) {
      console.log('No posts found in Firebase, returning empty array')
      return []
    }
    
    const posts: Post[] = []
    
    for (const docSnapshot of snapshot.docs) {
      const postData = docSnapshot.data()
      
      // Filter in memory for now to avoid index requirements
      if (whereClause) {
        let shouldInclude = true
        Object.entries(whereClause).forEach(([field, value]) => {
          if (field === 'published' && postData.published !== value) {
            shouldInclude = false
          }
          if (field === 'featured' && postData.featured !== value) {
            shouldInclude = false
          }
        })
        if (!shouldInclude) return
      }
      
      const post: Post = {
        id: docSnapshot.id,
        ...postData,
        coverImage: postData.coverImage || null,
        createdAt: postData.createdAt?.toDate() || new Date(),
        updatedAt: postData.updatedAt?.toDate() || new Date(),
        publishedAt: postData.publishedAt?.toDate() || null,
      } as Post
      
      console.log('Post:', post.title, 'published:', post.published, 'publishedAt:', post.publishedAt)
      
      // Get author data
      if (post.authorId && usersCollection) {
        try {
          const authorDoc = await getDoc(doc(usersCollection!, post.authorId))
          if (authorDoc.exists()) {
            const authorData = authorDoc.data()
            post.author = {
              name: authorData.name || 'Unknown',
              image: authorData.image,
            }
          }
        } catch (error) {
          console.error('Error fetching author:', error)
          post.author = { name: 'Unknown', image: null }
        }
      }
      
      // Get category data
      if (post.categoryId && categoriesCollection) {
        try {
          const categoryDoc = await getDoc(doc(categoriesCollection!, post.categoryId))
          if (categoryDoc.exists()) {
            const categoryData = categoryDoc.data()
            post.category = {
              name: categoryData.name,
              slug: categoryData.slug,
              color: categoryData.color || null,
            }
          } else {
            post.category = null
          }
        } catch (error) {
          console.error('Error fetching category:', error)
          post.category = null
        }
      } else {
        post.category = null
      }
      
      posts.push(post)
    }
    
    setCachedData(cacheKey, posts)
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getFeaturedPosts(limitCount: number = 3): Promise<Post[]> {
  const cacheKey = `featured_posts_${limitCount}`
  const cached = getCachedData(cacheKey)
  if (cached && Array.isArray(cached)) return cached

  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      console.log('Firebase not initialized, returning empty array')
      return []
    }

    const q = query(
      postsCollection, 
      where('published', '==', true),
      where('featured', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(q)
    const posts: Post[] = []
    
    for (const docSnapshot of snapshot.docs) {
      const postData = docSnapshot.data()
      posts.push({
        id: docSnapshot.id,
        ...postData,
        coverImage: postData.coverImage || null,
        createdAt: postData.createdAt?.toDate() || new Date(),
        updatedAt: postData.updatedAt?.toDate() || new Date(),
        publishedAt: postData.publishedAt?.toDate() || null,
      } as Post)
    }
    
    setCachedData(cacheKey, posts)
    return posts
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      console.log('Firebase not initialized, returning null')
      return null
    }

    const postDoc = await getDoc(doc(postsCollection!, id))
    
    if (!postDoc.exists()) return null
    
    const postData = postDoc.data()
    
    const post: Post = {
      id: postDoc.id,
      ...postData,
      coverImage: postData.coverImage || null,
      createdAt: postData.createdAt?.toDate() || new Date(),
      updatedAt: postData.updatedAt?.toDate() || new Date(),
      publishedAt: postData.publishedAt?.toDate() || null,
    } as Post
    
    // Get author data
    if (post.authorId) {
      try {
        const authorDoc = await getDoc(doc(usersCollection!, post.authorId))
        if (authorDoc.exists()) {
          const authorData = authorDoc.data()
          post.author = {
            name: authorData.name || 'Unknown',
            image: authorData.image,
          }
        }
      } catch (error) {
        console.error('Error fetching author:', error)
        post.author = { name: 'Unknown', image: null }
      }
    }
    
    // Get category data
    if (post.categoryId) {
      try {
        const categoryDoc = await getDoc(doc(categoriesCollection!, post.categoryId))
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data()
          post.category = {
            name: categoryData.name,
            slug: categoryData.slug,
            color: categoryData.color,
          }
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }
    
    return post
  } catch (error) {
    console.error('Error fetching post by ID:', error)
    return null
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      console.log('Firebase not initialized, returning null')
      return null
    }

    // Use a simple query for slug only
    const q = query(postsCollection, where('slug', '==', slug))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      console.log(`No post found with slug: ${slug}`)
      return null
    }
    
    // Find the first published post with this slug
    let publishedPost = null
    for (const docSnapshot of snapshot.docs) {
      const postData = docSnapshot.data()
      if (postData.published) {
        publishedPost = docSnapshot
        break
      }
    }
    
    if (!publishedPost) {
      console.log(`No published post found with slug: ${slug}`)
      return null
    }
    
    const postData = publishedPost.data()
    
    const post: Post = {
      id: publishedPost.id,
      ...postData,
      createdAt: postData.createdAt?.toDate() || new Date(),
      updatedAt: postData.updatedAt?.toDate() || new Date(),
      publishedAt: postData.publishedAt?.toDate(),
    } as Post
    
    // Get author data
    if (post.authorId) {
      try {
        const authorDoc = await getDoc(doc(usersCollection!, post.authorId))
        if (authorDoc.exists()) {
          const authorData = authorDoc.data()
          post.author = {
            name: authorData.name || 'Unknown',
            image: authorData.image,
          }
        }
      } catch (error) {
        console.error('Error fetching author:', error)
        post.author = { name: 'Unknown', image: null }
      }
    }
    
    // Get category data
    if (post.categoryId) {
      try {
        const categoryDoc = await getDoc(doc(categoriesCollection!, post.categoryId))
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data()
          post.category = {
            name: categoryData.name,
            slug: categoryData.slug,
            color: categoryData.color,
          }
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }
    
    return post
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      throw new Error('Firebase not initialized')
    }

    const now = new Date()
    const docRef = await addDoc(postsCollection, {
      ...postData,
      createdAt: now,
      updatedAt: now,
    })
    return { id: docRef.id, ...postData }
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export async function updatePost(id: string, postData: Partial<Post>) {
  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      throw new Error('Firebase not initialized')
    }

    const postRef = doc(postsCollection, id)
    await updateDoc(postRef, {
      ...postData,
      updatedAt: new Date(),
    })
    return true
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export async function deletePost(id: string) {
  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      throw new Error('Firebase not initialized')
    }

    const postRef = doc(postsCollection, id)
    await deleteDoc(postRef)
    return true
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

export async function incrementPostViews(id: string) {
  try {
    // Check if Firebase is properly initialized
    if (!db || !postsCollection) {
      console.log('Firebase not initialized, skipping view increment')
      return
    }

    const postRef = doc(postsCollection, id)
    await updateDoc(postRef, {
      views: increment(1)
    })
    return true
  } catch (error) {
    console.error('Error incrementing post views:', error)
    throw error
  }
}

// Categories Functions
export async function getCategories() {
  try {
    // Check if Firebase is properly initialized
    if (!db || !categoriesCollection) {
      console.log('Firebase not initialized, returning empty array')
      return []
    }

    const q = query(categoriesCollection, orderBy('name', 'asc'))
    const snapshot = await getDocs(q)
    
    // If no categories found, return empty array instead of error
    if (snapshot.empty) {
      console.log('No categories found in Firebase, returning empty array')
      return []
    }
    
    const categories: Category[] = []
    for (const docSnapshot of snapshot.docs) {
      const categoryData = docSnapshot.data()
      categories.push({
        id: docSnapshot.id,
        ...categoryData,
        createdAt: categoryData.createdAt?.toDate() || new Date(),
        updatedAt: categoryData.updatedAt?.toDate() || new Date(),
      } as Category)
    }
    
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Check if Firebase is properly initialized
    if (!db || !categoriesCollection) {
      throw new Error('Firebase not initialized')
    }

    const now = new Date()
    const docRef = await addDoc(categoriesCollection, {
      ...categoryData,
      createdAt: now,
      updatedAt: now,
    })
    return { id: docRef.id, ...categoryData }
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

// Users Functions
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const q = query(usersCollection, where('email', '==', email))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    const docSnapshot = snapshot.docs[0]
    const userData = docSnapshot.data()
    
    return {
      id: docSnapshot.id,
      ...userData,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date(),
    } as User
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    // Check if Firebase is properly initialized
    if (!db || !usersCollection) {
      throw new Error('Firebase not initialized')
    }

    const now = new Date()
    const docRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: now,
      updatedAt: now,
    })
    return { id: docRef.id, ...userData }
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
