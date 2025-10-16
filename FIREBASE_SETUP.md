# 🔥 Firebase Setup Guide

This guide will help you set up Firebase Firestore for your blogging website instead of MongoDB.

## 🚀 **Step 1: Create Firebase Project**

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `your-blog-website`
4. **Enable Google Analytics** (optional)
5. **Click "Create project"**

## 🔧 **Step 2: Enable Firestore Database**

1. **In your Firebase project, go to "Firestore Database"**
2. **Click "Create database"**
3. **Choose "Start in test mode"** (for development)
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

## 🔑 **Step 3: Get Firebase Configuration**

1. **Go to Project Settings** (gear icon)
2. **Scroll down to "Your apps"**
3. **Click "Web app" icon** (`</>`)
4. **Register app name**: `blog-website`
5. **Copy the config object**

## 📝 **Step 4: Set Up Environment Variables**

1. **Create `.env.local` file**:
   ```bash
   cp env.example .env.local
   ```

2. **Add your Firebase config**:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key-here"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

   # Firebase Admin (for server-side operations)
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_CLIENT_EMAIL="your-service-account-email"
   FIREBASE_PRIVATE_KEY="your-private-key"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Site Configuration
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_SITE_NAME="Your Blog Name"
   NEXT_PUBLIC_SITE_DESCRIPTION="Your blog description"
   ```

## 🔐 **Step 5: Set Up Firebase Admin (Optional)**

For server-side operations, you'll need a service account:

1. **Go to Project Settings > Service Accounts**
2. **Click "Generate new private key"**
3. **Download the JSON file**
4. **Extract the values**:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## 🌱 **Step 6: Seed Your Database**

Run the seed script to create sample data:

```bash
npm run seed
```

This will create:
- ✅ Admin user
- ✅ Sample categories
- ✅ Sample blog posts

## 🎯 **Step 7: Test Your Setup**

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit your website**: `http://localhost:3000`

3. **Check admin dashboard**: `http://localhost:3000/admin/login`
   - Email: `admin@example.com`
   - Password: Set up in Firebase Auth

## 📊 **Firebase Collections Structure**

Your Firestore will have these collections:

### **Posts Collection**
```javascript
{
  id: "post-id",
  title: "Post Title",
  slug: "post-slug",
  content: "<h1>HTML content</h1>",
  excerpt: "Brief description",
  coverImage: "https://image-url.com",
  published: true,
  featured: false,
  sponsored: false,
  authorId: "user-id",
  categoryId: "category-id",
  tags: ["tag1", "tag2"],
  seoTitle: "SEO Title",
  seoDescription: "SEO Description",
  keywords: ["keyword1", "keyword2"],
  views: 0,
  readTime: 5,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  publishedAt: "2024-01-01T00:00:00Z"
}
```

### **Categories Collection**
```javascript
{
  id: "category-id",
  name: "Category Name",
  slug: "category-slug",
  description: "Category description",
  color: "bg-blue-500",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

### **Users Collection**
```javascript
{
  id: "user-id",
  name: "User Name",
  email: "user@example.com",
  image: "https://avatar-url.com",
  role: "ADMIN" | "USER",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## 🔒 **Security Rules (Important!)**

Add these security rules in Firestore:

1. **Go to Firestore Database > Rules**
2. **Replace with**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts - readable by everyone, writable by admins
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    // Categories - readable by everyone, writable by admins
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    // Users - readable by authenticated users, writable by admins
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
  }
}
```

## 🚀 **Deployment**

When deploying to Vercel:

1. **Add all environment variables** in Vercel dashboard
2. **Update `NEXTAUTH_URL`** to your production URL
3. **Update `NEXT_PUBLIC_SITE_URL`** to your production URL

## ✅ **Advantages of Firebase over MongoDB**

- ✅ **Easier setup** - No server configuration needed
- ✅ **Real-time updates** - Built-in real-time listeners
- ✅ **Free tier** - Generous free usage limits
- ✅ **Authentication** - Built-in user management
- ✅ **Hosting** - Can host your app on Firebase
- ✅ **Security** - Built-in security rules
- ✅ **Scalability** - Auto-scales with your traffic

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Firebase not initialized"**
   - Check your environment variables
   - Make sure `.env.local` is in the root directory

2. **"Permission denied"**
   - Check your Firestore security rules
   - Make sure user has proper role

3. **"Collection not found"**
   - Run the seed script: `npm run seed`
   - Check if collections exist in Firebase Console

### **Need Help?**
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the console for error messages
- Make sure all environment variables are set correctly

---

**🎉 You're all set! Your blog is now powered by Firebase Firestore!**
