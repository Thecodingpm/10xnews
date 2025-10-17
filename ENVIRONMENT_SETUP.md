# 🔧 Environment Variables Setup for 10xNews (Firebase + NextAuth)

## Required Environment Variables

Create a `.env.local` file in your project root with these variables:

### **1. Firebase Configuration**
```bash
# Firebase project configuration (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### **2. NextAuth Configuration**
```bash
# Secret key for JWT tokens (generate a strong random string)
NEXTAUTH_SECRET="your-super-secret-key-here-change-this-in-production"

# Your website URL
NEXTAUTH_URL="http://localhost:3000"
```
- **Local**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

### **3. News API Configuration**
```bash
# Your NewsAPI key (already provided)
NEWS_API_KEY="5c2246a913b448149f5ffc8a3cd87400"
```

### **4. Admin Credentials**
```bash
# Admin login credentials (CHANGE THESE!)
ADMIN_EMAIL="admin@10xnews.com"
ADMIN_PASSWORD="your-secure-admin-password-here"
```

## 🚀 Deployment Platform Setup

### **Vercel (Recommended)**
1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - `DATABASE_URL` = Your MongoDB Atlas URL
   - `NEXTAUTH_SECRET` = Generate at https://generate-secret.vercel.app/32
   - `NEXTAUTH_URL` = https://yourdomain.vercel.app
   - `NEWS_API_KEY` = 5c2246a913b448149f5ffc8a3cd87400
   - `ADMIN_EMAIL` = admin@10xnews.com
   - `ADMIN_PASSWORD` = Your secure password

### **Netlify**
1. Go to Site Settings → Environment Variables
2. Add the same variables as above

### **Railway**
1. Go to your project → Variables
2. Add the same variables as above

## 🔐 Security Notes

1. **Change default credentials** before deploying
2. **Use strong passwords** for admin access
3. **Keep environment variables secret**
4. **Use HTTPS** in production
5. **Regularly update** your admin password

## 📝 Quick Setup Commands

```bash
# 1. Create .env.local file
touch .env.local

# 2. Add your variables (copy from above)
# 3. Test locally
npm run dev

# 4. Build for production
npm run build
```

## 🎯 Admin Access After Deployment

- **URL**: `https://yourdomain.com/admin/login`
- **Email**: Your `ADMIN_EMAIL` value
- **Password**: Your `ADMIN_PASSWORD` value

## 🔧 Generate Strong Secrets

- **NEXTAUTH_SECRET**: https://generate-secret.vercel.app/32
- **ADMIN_PASSWORD**: Use a password manager or generate a strong one
