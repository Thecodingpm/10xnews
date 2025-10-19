// Script to seed sample data into Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
  authDomain: "xnews-630ce.firebaseapp.com",
  projectId: "xnews-630ce",
  storageBucket: "xnews-630ce.firebasestorage.app",
  messagingSenderId: "983807637967",
  appId: "1:983807637967:web:d7361437a6532bb5de7aba",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seedSampleData() {
  try {
    console.log('Starting to seed sample data...')

    // Create sample categories
    const categories = [
      {
        name: 'Pakistan',
        slug: 'pakistan',
        description: 'Latest news from Pakistan',
        color: '#10B981',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech news and updates',
        color: '#3B82F6',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Business and economy news',
        color: '#8B5CF6',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    console.log('Creating categories...')
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), category)
      console.log(`Created category: ${category.name}`)
    }

    // Create sample posts
    const posts = [
      {
        title: 'Welcome to 10xNews',
        slug: 'welcome-to-10xnews',
        content: 'Welcome to 10xNews! This is your go-to source for the latest news and updates.',
        excerpt: 'Welcome to 10xNews! This is your go-to source for the latest news and updates.',
        coverImage: null,
        images: [],
        published: true,
        featured: true,
        sponsored: false,
        authorId: 'admin-user-id',
        author: {
          name: '10xNews Staff',
          image: null
        },
        categoryId: 'pakistan-category-id',
        category: {
          name: 'Pakistan',
          slug: 'pakistan',
          color: '#10B981'
        },
        tags: ['welcome', 'news'],
        seoTitle: 'Welcome to 10xNews - Latest News Updates',
        seoDescription: 'Welcome to 10xNews! Your trusted source for the latest news and updates.',
        keywords: ['news', 'updates', '10xnews'],
        views: 0,
        readTime: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      },
      {
        title: 'Pakistan Economic Growth',
        slug: 'pakistan-economic-growth',
        content: 'Pakistan shows promising economic growth indicators in the latest reports.',
        excerpt: 'Pakistan shows promising economic growth indicators in the latest reports.',
        coverImage: null,
        images: [],
        published: true,
        featured: false,
        sponsored: false,
        authorId: 'admin-user-id',
        author: {
          name: '10xNews Staff',
          image: null
        },
        categoryId: 'pakistan-category-id',
        category: {
          name: 'Pakistan',
          slug: 'pakistan',
          color: '#10B981'
        },
        tags: ['economy', 'pakistan', 'growth'],
        seoTitle: 'Pakistan Economic Growth - Latest Updates',
        seoDescription: 'Latest updates on Pakistan economic growth and development.',
        keywords: ['pakistan', 'economy', 'growth'],
        views: 0,
        readTime: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      }
    ]

    console.log('Creating posts...')
    for (const post of posts) {
      await addDoc(collection(db, 'posts'), post)
      console.log(`Created post: ${post.title}`)
    }

    // Create admin user
    const adminUser = {
      name: '10xNews Staff',
      email: 'ahmadmuaaz292@gmail.com',
      image: null,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Creating admin user...')
    await addDoc(collection(db, 'users'), adminUser)
    console.log('Created admin user')

    console.log('Sample data seeded successfully!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

// Run the seeding function
seedSampleData()
