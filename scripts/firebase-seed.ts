import { createUser, createCategory, createPost } from '../src/lib/firebase-data'

async function seedFirebase() {
  console.log('🌱 Starting Firebase seed...')

  try {
    // Create admin user
    const adminUser = await createUser({
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    })
    console.log('✅ Admin user created:', adminUser.email)

    // Create categories
    const categories = await Promise.all([
      createCategory({
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology news and insights',
        color: 'bg-blue-500',
      }),
      createCategory({
        name: 'Programming',
        slug: 'programming',
        description: 'Programming tutorials and guides',
        color: 'bg-green-500',
      }),
      createCategory({
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development tips and tricks',
        color: 'bg-purple-500',
      }),
    ])

    console.log('✅ Categories created:', categories.length)

    // Create sample posts
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
        authorId: adminUser.id,
        categoryId: categories[0].id,
        tags: ['nextjs', 'react', 'javascript', 'web-development'],
        seoTitle: 'Getting Started with Next.js 15 - Complete Guide',
        seoDescription: 'Learn how to get started with Next.js 15, the latest version of the popular React framework with new features and improvements.',
        keywords: ['nextjs', 'react', 'javascript', 'web development', 'tutorial'],
        readTime: 8,
        views: 1250,
        publishedAt: new Date(),
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
        authorId: adminUser.id,
        categoryId: categories[1].id,
        tags: ['typescript', 'react', 'programming', 'javascript'],
        seoTitle: 'Mastering TypeScript for React Development - Advanced Guide',
        seoDescription: 'Learn advanced TypeScript patterns for React development to build more robust and maintainable applications.',
        keywords: ['typescript', 'react', 'programming', 'javascript', 'web development'],
        readTime: 12,
        views: 890,
        publishedAt: new Date(),
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
        authorId: adminUser.id,
        categoryId: categories[2].id,
        tags: ['tailwind', 'css', 'responsive', 'design'],
        seoTitle: 'Building Responsive UIs with Tailwind CSS - Complete Tutorial',
        seoDescription: 'Learn how to build responsive and modern user interfaces using Tailwind CSS utility-first approach.',
        keywords: ['tailwind css', 'responsive design', 'css', 'frontend', 'ui'],
        readTime: 6,
        views: 650,
        publishedAt: new Date(),
      },
    ]

    for (const postData of posts) {
      const post = await createPost(postData)
      console.log('✅ Post created:', post.title)
    }

    console.log('🎉 Firebase seeded successfully!')
    console.log('\n📝 Admin credentials:')
    console.log('Email: admin@example.com')
    console.log('Password: admin123 (you can set this in Firebase Auth)')
    console.log('\n🔗 Access your admin dashboard at: http://localhost:3000/admin/login')
  } catch (error) {
    console.error('❌ Error seeding Firebase:', error)
    process.exit(1)
  }
}

seedFirebase()
