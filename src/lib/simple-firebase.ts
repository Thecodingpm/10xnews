// Simple Firebase data access without complex queries
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
  authDomain: "xnews-630ce.firebaseapp.com",
  projectId: "xnews-630ce",
  storageBucket: "xnews-630ce.firebasestorage.app",
  messagingSenderId: "983807637967",
  appId: "1:983807637967:web:d7361437a6532bb5de7aba",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)

// Simple data types
export interface SimplePost {
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

// Simple functions
export async function getAllPosts(): Promise<SimplePost[]> {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'))
    const posts: SimplePost[] = []
    
    for (const docSnapshot of postsSnapshot.docs) {
      const postData = docSnapshot.data()
      
      const post: SimplePost = {
        id: docSnapshot.id,
        title: postData.title || '',
        slug: postData.slug || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        coverImage: postData.coverImage,
        published: postData.published || false,
        featured: postData.featured || false,
        sponsored: postData.sponsored || false,
        authorId: postData.authorId || '',
        author: { name: 'Unknown', image: null },
        categoryId: postData.categoryId,
        category: undefined,
        tags: postData.tags || [],
        seoTitle: postData.seoTitle,
        seoDescription: postData.seoDescription,
        keywords: postData.keywords || [],
        views: postData.views || 0,
        readTime: postData.readTime || 5,
        createdAt: postData.createdAt?.toDate() || new Date(),
        updatedAt: postData.updatedAt?.toDate() || new Date(),
        publishedAt: postData.publishedAt?.toDate(),
      }
      
      // Get author data
      if (post.authorId) {
        try {
          const authorDoc = await getDoc(doc(db, 'users', post.authorId))
          if (authorDoc.exists()) {
            const authorData = authorDoc.data()
            post.author = {
              name: authorData.name || 'Unknown',
              image: authorData.image,
            }
          }
        } catch (error) {
          console.error('Error fetching author:', error)
        }
      }
      
      // Get category data
      if (post.categoryId) {
        try {
          const categoryDoc = await getDoc(doc(db, 'categories', post.categoryId))
          if (categoryDoc.exists()) {
            const categoryData = categoryDoc.data()
            post.category = {
              name: categoryData.name || 'Uncategorized',
              slug: categoryData.slug || 'uncategorized',
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

export async function getFeaturedPosts(): Promise<SimplePost[]> {
  try {
    const allPosts = await getAllPosts()
    return allPosts
      .filter(post => post.published && post.featured)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getLatestPosts(): Promise<SimplePost[]> {
  try {
    const allPosts = await getAllPosts()
    return allPosts
      .filter(post => post.published)
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
      .slice(0, 6)
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<SimplePost | null> {
  try {
    const allPosts = await getAllPosts()
    return allPosts.find(post => post.slug === slug && post.published) || null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}
