import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function addSampleData() {
  console.log('🌱 Adding sample data to Firebase...')

  try {
    // Add categories first
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
      console.log('✅ Category added:', category.name)
    }

    // Add admin user
    const adminUser = {
      name: '10xNews Staff',
      email: 'admin@10xnews.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const adminUserRef = await addDoc(collection(db, 'users'), adminUser)
    console.log('✅ Admin user added:', adminUserRef.id)

    // Add sample posts
    const posts = [
      {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-with-nextjs-15',
        content: `
          <h2>Introduction to Next.js 15</h2>
          <p>Next.js 15 brings exciting new features and improvements to the React framework. In this comprehensive guide, we'll explore the latest updates and how to get started with your first Next.js application.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li>App Router improvements</li>
            <li>Enhanced performance</li>
            <li>Better TypeScript support</li>
            <li>Improved developer experience</li>
          </ul>
          
          <h3>Getting Started</h3>
          <p>To create a new Next.js project, run the following command:</p>
          <pre><code>npx create-next-app@latest my-app</code></pre>
          
          <p>This will create a new Next.js application with all the necessary dependencies and configuration files.</p>
        `,
        excerpt: 'Learn how to get started with Next.js 15, the latest version of the popular React framework with new features and improvements.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
        published: true,
        featured: true,
        sponsored: false,
        authorId: adminUserRef.id,
        author: {
          name: '10xNews Staff',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        categoryId: categoryRefs[0].id,
        category: {
          name: 'Technology',
          slug: 'technology',
          color: 'bg-blue-500'
        },
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
        content: `
          <h2>Why TypeScript for React?</h2>
          <p>TypeScript brings static type checking to JavaScript, making your React applications more robust and maintainable. In this guide, we'll explore advanced TypeScript patterns for React development.</p>
          
          <h3>Type Safety Benefits</h3>
          <ul>
            <li>Compile-time error detection</li>
            <li>Better IDE support</li>
            <li>Improved code documentation</li>
            <li>Easier refactoring</li>
          </ul>
          
          <h3>Advanced Patterns</h3>
          <p>Learn about generics, utility types, and advanced TypeScript patterns that will make your React code more type-safe and maintainable.</p>
        `,
        excerpt: 'Learn advanced TypeScript patterns for React development to build more robust and maintainable applications.',
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop',
        published: true,
        featured: false,
        sponsored: false,
        authorId: adminUserRef.id,
        author: {
          name: '10xNews Staff',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        categoryId: categoryRefs[1].id,
        category: {
          name: 'Programming',
          slug: 'programming',
          color: 'bg-green-500'
        },
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
        content: `
          <h2>Introduction to Tailwind CSS</h2>
          <p>Tailwind CSS is a utility-first CSS framework that makes it easy to build responsive and modern user interfaces. In this tutorial, we'll cover the fundamentals and advanced techniques.</p>
          
          <h3>Utility-First Approach</h3>
          <p>Tailwind CSS uses a utility-first approach, which means you style your components by applying utility classes directly in your HTML.</p>
          
          <h3>Responsive Design</h3>
          <p>Learn how to create responsive designs using Tailwind's responsive prefixes and breakpoints.</p>
        `,
        excerpt: 'Learn how to build responsive and modern user interfaces using Tailwind CSS utility-first approach.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop',
        published: true,
        featured: false,
        sponsored: false,
        authorId: adminUserRef.id,
        author: {
          name: '10xNews Staff',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        categoryId: categoryRefs[2].id,
        category: {
          name: 'Web Development',
          slug: 'web-development',
          color: 'bg-purple-500'
        },
        tags: ['tailwind', 'css', 'responsive', 'design'],
        seoTitle: 'Building Responsive UIs with Tailwind CSS - Complete Tutorial',
        seoDescription: 'Learn how to build responsive and modern user interfaces using Tailwind CSS utility-first approach.',
        keywords: ['tailwind css', 'responsive design', 'css', 'frontend', 'ui'],
        readTime: 6,
        views: 650,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      },
      {
        title: 'The Future of Web Development: AI-Powered Tools',
        slug: 'future-of-web-development-ai-powered-tools',
        content: `
          <h2>AI Revolution in Web Development</h2>
          <p>Artificial Intelligence is transforming how we build web applications. From code generation to automated testing, AI tools are becoming essential for modern developers.</p>
          
          <h3>Popular AI Tools</h3>
          <ul>
            <li>GitHub Copilot for code completion</li>
            <li>ChatGPT for code review and debugging</li>
            <li>V0.dev for component generation</li>
            <li>Tabnine for intelligent code suggestions</li>
          </ul>
          
          <h3>Benefits for Developers</h3>
          <p>AI tools help developers write code faster, catch bugs earlier, and learn new technologies more efficiently.</p>
        `,
        excerpt: 'Discover how AI-powered tools are revolutionizing web development and making developers more productive.',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
        published: true,
        featured: true,
        sponsored: false,
        authorId: adminUserRef.id,
        author: {
          name: '10xNews Staff',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        categoryId: categoryRefs[0].id,
        category: {
          name: 'Technology',
          slug: 'technology',
          color: 'bg-blue-500'
        },
        tags: ['ai', 'web-development', 'tools', 'productivity'],
        seoTitle: 'The Future of Web Development: AI-Powered Tools',
        seoDescription: 'Discover how AI-powered tools are revolutionizing web development and making developers more productive.',
        keywords: ['ai', 'web development', 'tools', 'productivity', 'programming'],
        readTime: 10,
        views: 2100,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      },
      {
        title: 'Modern JavaScript: ES2024 Features You Need to Know',
        slug: 'modern-javascript-es2024-features',
        content: `
          <h2>What's New in ES2024</h2>
          <p>JavaScript continues to evolve with exciting new features in ES2024. Let's explore the latest additions that will make your code more powerful and expressive.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li>Array.prototype.groupBy() for data grouping</li>
            <li>Promise.withResolvers() for better async control</li>
            <li>Object.groupBy() for object grouping</li>
            <li>Enhanced error handling with cause chains</li>
          </ul>
          
          <h3>Browser Support</h3>
          <p>Most modern browsers already support these features, making them ready for production use.</p>
        `,
        excerpt: 'Explore the latest JavaScript features in ES2024 that will enhance your development workflow.',
        coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&h=630&fit=crop',
        published: true,
        featured: false,
        sponsored: false,
        authorId: adminUserRef.id,
        author: {
          name: '10xNews Staff',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        categoryId: categoryRefs[1].id,
        category: {
          name: 'Programming',
          slug: 'programming',
          color: 'bg-green-500'
        },
        tags: ['javascript', 'es2024', 'programming', 'web development'],
        seoTitle: 'Modern JavaScript: ES2024 Features You Need to Know',
        seoDescription: 'Explore the latest JavaScript features in ES2024 that will enhance your development workflow.',
        keywords: ['javascript', 'es2024', 'programming', 'web development', 'features'],
        readTime: 7,
        views: 1450,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      }
    ]

    for (const post of posts) {
      const postRef = await addDoc(collection(db, 'posts'), post)
      console.log('✅ Post added:', post.title)
    }

    console.log('🎉 Sample data added successfully!')
    console.log('\n📝 Admin credentials:')
    console.log('Email: admin@10xnews.com')
    console.log('Password: 10xNews2024!')
    console.log('\n🔗 Access your admin dashboard at: http://localhost:3000/admin/login')
    console.log('\n📰 Your website should now show articles at: http://localhost:3000')
  } catch (error) {
    console.error('❌ Error adding sample data:', error)
    process.exit(1)
  }
}

addSampleData()
