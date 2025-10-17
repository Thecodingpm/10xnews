import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore'

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "xnews-630ce.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "xnews-630ce",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "xnews-630ce.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "983807637967",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:983807637967:web:d7361437a6532bb5de7aba"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seedFirebaseData() {
  console.log('🌱 Starting Firebase simple data seeding...')

  try {
    // Create admin user
    const adminUser = {
      name: '10xNews Staff',
      email: 'admin@10xnews.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const adminUserRef = await addDoc(collection(db, 'users'), adminUser)
    console.log('✅ Admin user created:', adminUserRef.id)

    // Create categories
    const categories = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology news and insights',
        color: 'bg-blue-500',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming tutorials and guides',
        color: 'bg-green-500',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development tips and tricks',
        color: 'bg-purple-500',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const categoryRefs = []
    for (const category of categories) {
      const categoryRef = await addDoc(collection(db, 'categories'), category)
      categoryRefs.push({ id: categoryRef.id, ...category })
      console.log('✅ Category created:', category.name)
    }

    // Create sample posts
    const posts = [
      {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-with-nextjs-15',
        content: '<h2>Introduction to Next.js 15</h2><p>Next.js 15 brings exciting new features and improvements to the React framework. In this comprehensive guide, we\'ll explore the latest updates and how to get started with your first Next.js application.</p><h3>Key Features</h3><ul><li>App Router improvements</li><li>Enhanced performance</li><li>Better TypeScript support</li><li>Improved developer experience</li></ul>',
        excerpt: 'Learn how to get started with Next.js 15, the latest version of the popular React framework with new features and improvements.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
        published: true,
        featured: true,
        sponsored: false,
        authorId: adminUserRef.id,
        categoryId: categoryRefs[0].id,
        tags: ['nextjs', 'react', 'javascript', 'web-development'],
        seoTitle: 'Getting Started with Next.js 15 - Complete Guide',
        seoDescription: 'Learn how to get started with Next.js 15, the latest version of the popular React framework with new features and improvements.',
        keywords: ['nextjs', 'react', 'javascript', 'web development', 'tutorial'],
        readTime: 8,
        views: 1250,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      },
      {
        title: 'Mastering TypeScript for React Development',
        slug: 'mastering-typescript-for-react-development',
        content: '<h2>Why TypeScript for React?</h2><p>TypeScript brings static type checking to JavaScript, making your React applications more robust and maintainable. In this guide, we\'ll explore advanced TypeScript patterns for React development.</p><h3>Type Safety Benefits</h3><ul><li>Compile-time error detection</li><li>Better IDE support</li><li>Improved code documentation</li><li>Easier refactoring</li></ul>',
        excerpt: 'Learn advanced TypeScript patterns for React development to build more robust and maintainable applications.',
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop',
        published: true,
        featured: false,
        sponsored: false,
        authorId: adminUserRef.id,
        categoryId: categoryRefs[1].id,
        tags: ['typescript', 'react', 'programming', 'javascript'],
        seoTitle: 'Mastering TypeScript for React Development - Advanced Guide',
        seoDescription: 'Learn advanced TypeScript patterns for React development to build more robust and maintainable applications.',
        keywords: ['typescript', 'react', 'programming', 'javascript', 'web development'],
        readTime: 12,
        views: 890,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      },
      {
        title: 'Building Responsive UIs with Tailwind CSS',
        slug: 'building-responsive-uis-with-tailwind-css',
        content: '<h2>Introduction to Tailwind CSS</h2><p>Tailwind CSS is a utility-first CSS framework that makes it easy to build responsive and modern user interfaces. In this tutorial, we\'ll cover the fundamentals and advanced techniques.</p><h3>Utility-First Approach</h3><p>Tailwind CSS uses a utility-first approach, which means you style your components by applying utility classes directly in your HTML.</p>',
        excerpt: 'Learn how to build responsive and modern user interfaces using Tailwind CSS utility-first approach.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop',
        published: true,
        featured: false,
        sponsored: false,
        authorId: adminUserRef.id,
        categoryId: categoryRefs[2].id,
        tags: ['tailwind', 'css', 'responsive', 'design'],
        seoTitle: 'Building Responsive UIs with Tailwind CSS - Complete Tutorial',
        seoDescription: 'Learn how to build responsive and modern user interfaces using Tailwind CSS utility-first approach.',
        keywords: ['tailwind css', 'responsive design', 'css', 'frontend', 'ui'],
        readTime: 6,
        views: 650,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      }
    ]

    for (const post of posts) {
      const postRef = await addDoc(collection(db, 'posts'), post)
      console.log('✅ Post created:', post.title)
    }

    console.log('🎉 Firebase simple data seeded successfully!')
    console.log('\n📝 Admin credentials:')
    console.log('Email: admin@10xnews.com')
    console.log('Password: admin123')
    console.log('\n🔗 Access your admin dashboard at: http://localhost:3000/admin/login')
    console.log('\n📰 Your website should now show articles at: http://localhost:3000')
  } catch (error) {
    console.error('❌ Error seeding Firebase:', error)
    process.exit(1)
  }
}

seedFirebaseData()
