# 🔥 Firebase + NextAuth Setup for 10xNews

## 🔧 Environment Variables for Firebase

Your `.env.local` file should contain:

```bash
# ===========================================
# FIREBASE CONFIGURATION
# ===========================================
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="xnews-630ce.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="xnews-630ce"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="xnews-630ce.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="983807637967"
NEXT_PUBLIC_FIREBASE_APP_ID="1:983807637967:web:d7361437a6532bb5de7aba"

# ===========================================
# NEXT-AUTH CONFIGURATION
# ===========================================
NEXTAUTH_SECRET="your-super-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# ===========================================
# NEWS API CONFIGURATION
# ===========================================
NEWS_API_KEY="5c2246a913b448149f5ffc8a3cd87400"

# ===========================================
# ADMIN CREDENTIALS
# ===========================================
ADMIN_EMAIL="admin@10xnews.com"
ADMIN_PASSWORD="your-secure-admin-password-here"
```

## 🔥 How to Get Firebase Configuration

### **Step 1: Access Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `xnews-630ce`

### **Step 2: Get Web App Configuration**
1. Click **⚙️ Settings** → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click on your web app (or create one)
4. Copy the config values

### **Step 3: Set Up Firestore Database**
1. Go to **"Firestore Database"** in Firebase Console
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (closest to your users)

### **Step 4: Enable Authentication**
1. Go to **"Authentication"** in Firebase Console
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider

### **Step 5: Set Up Firestore Security Rules**
Go to **"Firestore Database"** → **"Rules"** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all posts
    match /posts/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
    
    // Allow read access to all categories
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
    
    // Allow read access to all users
    match /users/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'ADMIN';
    }
  }
}
```

## 🚀 Deployment with Firebase

### **For Vercel:**
Add these environment variables in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your-project.firebasestorage.app |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |
| `NEXTAUTH_SECRET` | Generate at https://generate-secret.vercel.app/32 |
| `NEXTAUTH_URL` | https://yourdomain.vercel.app |
| `NEWS_API_KEY` | 5c2246a913b448149f5ffc8a3cd87400 |
| `ADMIN_EMAIL` | admin@10xnews.com |
| `ADMIN_PASSWORD` | Your secure password |

## 🔐 Security Notes

1. **Change admin credentials** before deploying
2. **Generate strong NEXTAUTH_SECRET**
3. **Update Firestore rules** for production
4. **Use Firebase Auth** for user management
5. **Enable Firebase Security Rules**

## 📝 Quick Test

1. **Start local server**: `npm run dev`
2. **Check Firebase connection**: Visit http://localhost:3000
3. **Test admin login**: http://localhost:3000/admin/login
4. **Check Firestore**: Firebase Console → Firestore Database

## 🎯 Admin Access After Deployment

- **URL**: `https://yourdomain.com/admin/login`
- **Email**: Your `ADMIN_EMAIL` value
- **Password**: Your `ADMIN_PASSWORD` value