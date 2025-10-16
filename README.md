<<<<<<< HEAD
# Modern Blogging Website

A complete, SEO-optimized blogging platform built with Next.js, Tailwind CSS, and MongoDB. Features include admin dashboard, monetization support, and comprehensive SEO optimization.

## 🚀 Features

### Core Blog System
- **Homepage** with featured posts and latest articles
- **Dynamic blog posts** with clean SEO URLs
- **Categories and tags** system
- **Search functionality** for blog posts
- **Related posts** recommendations
- **Comment system** (ready for integration)
- **Light/Dark mode** toggle

### Admin Dashboard
- **Secure authentication** using NextAuth
- **Rich text editor** for creating posts
- **Image upload** via Cloudinary
- **Post management** (create, edit, delete)
- **Category and tag management**
- **Analytics** and view tracking

### SEO & Performance
- **Dynamic meta tags** and Open Graph
- **Schema.org structured data**
- **Sitemap and RSS feed** generation
- **Mobile-first responsive** design
- **Core Web Vitals** optimization
- **Social media previews**

### Monetization
- **AdSense integration** ready
- **Reusable AdSlot components**
- **Sponsored post** support
- **Multiple ad placements** (header, sidebar, in-content, footer)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Upload**: Cloudinary
- **Rich Text Editor**: TipTap
- **Animations**: Framer Motion
- **Icons**: Heroicons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/blog-website?retryWrites=true&w=majority"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_SITE_NAME="Your Blog Name"
   NEXT_PUBLIC_SITE_DESCRIPTION="Your blog description"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create an admin user**
   ```bash
   npx prisma studio
   ```
   
   In Prisma Studio, create a user with:
   - `email`: your admin email
   - `password`: hashed password (use bcrypt)
   - `role`: `ADMIN`

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎨 Customization

### AdSense Integration

1. **Get your AdSense code** from Google AdSense
2. **Update the AdSlot components** in `src/components/AdSlot.tsx`
3. **Replace the placeholder ad slot IDs** with your actual AdSense slot IDs
4. **Add your AdSense client ID** to environment variables

### Styling

- **Colors**: Update the color scheme in `tailwind.config.js`
- **Fonts**: Modify font settings in `src/app/layout.tsx`
- **Components**: Customize components in `src/components/`

### SEO Settings

- **Site metadata**: Update in `src/app/layout.tsx`
- **Sitemap**: Automatically generated in `src/app/sitemap.ts`
- **RSS feed**: Available at `/feed.xml`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── AdSlot.tsx        # AdSense integration
│   ├── blog/             # Blog-specific components
│   └── layout/           # Layout components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database connection
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy**

### Other Platforms

The app is compatible with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Analytics

### Google Analytics

1. **Get your GA4 measurement ID**
2. **Add to environment variables**:
   ```env
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   ```

### Built-in Analytics

The platform includes built-in analytics for:
- Post views
- Popular posts
- Author performance

## 🔧 Admin Features

### Creating Posts

1. **Navigate to** `/admin/dashboard`
2. **Click "Create New Post"**
3. **Fill in post details**:
   - Title and slug
   - Content (rich text editor)
   - Excerpt and cover image
   - Category and tags
   - SEO settings
4. **Publish or save as draft**

### Managing Content

- **Edit existing posts**
- **Delete posts**
- **Manage categories and tags**
- **View analytics**

## 🎯 SEO Best Practices

This platform follows SEO best practices:

- **Semantic HTML** structure
- **Meta tags** for all pages
- **Structured data** (Schema.org)
- **Sitemap** generation
- **RSS feed** for content syndication
- **Mobile-first** responsive design
- **Fast loading** with Next.js optimization
- **Clean URLs** for better indexing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Happy Blogging! 🎉**
=======
# 10xnews
>>>>>>> 99788b6ce69b163efaa926566dd67b352e7da056
