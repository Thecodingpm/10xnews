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
  startAfter,
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
  coverImage?: string
  published: boolean
  featured: boolean
  sponsored: boolean
  authorId: string
  author: {
    name: string
    image?: string
  }
  categoryId?: string
  category?: {
    name: string
    slug: string
    color?: string
  }
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  keywords: string[]
  views: number
  readTime: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
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
  image?: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

// Posts Collection
const postsCollection = collection(db, 'posts')
const categoriesCollection = collection(db, 'categories')
const usersCollection = collection(db, 'users')

// Posts Functions
export async function getPosts(whereClause?: any, orderByClause?: any, limitCount?: number) {
  try {
    // For now, let's use a simple query without complex where clauses
    let q = query(postsCollection, orderBy('publishedAt', 'desc'))
    
    if (limitCount) {
      q = query(q, limit(limitCount))
    }
    
    const snapshot = await getDocs(q)
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
        createdAt: postData.createdAt?.toDate() || new Date(),
        updatedAt: postData.updatedAt?.toDate() || new Date(),
        publishedAt: postData.publishedAt?.toDate(),
      } as Post
      
      // Get author data
      if (post.authorId) {
        try {
          const authorDoc = await getDoc(doc(usersCollection, post.authorId))
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
          const categoryDoc = await getDoc(doc(categoriesCollection, post.categoryId))
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
      
      posts.push(post)
    }
    
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Use a simple query for slug only
    const q = query(postsCollection, where('slug', '==', slug))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    const docSnapshot = snapshot.docs[0]
    const postData = docSnapshot.data()
    
    // Check if published in memory
    if (!postData.published) return null
    
    const post: Post = {
      id: docSnapshot.id,
      ...postData,
      createdAt: postData.createdAt?.toDate() || new Date(),
      updatedAt: postData.updatedAt?.toDate() || new Date(),
      publishedAt: postData.publishedAt?.toDate(),
    } as Post
    
    // Get author data
    if (post.authorId) {
      try {
        const authorDoc = await getDoc(doc(usersCollection, post.authorId))
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
        const categoryDoc = await getDoc(doc(categoriesCollection, post.categoryId))
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
    const q = query(categoriesCollection, orderBy('name', 'asc'))
    const snapshot = await getDocs(q)
    
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
