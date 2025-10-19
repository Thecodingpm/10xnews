# Vercel Environment Variables Setup

## Required Environment Variables for Vercel Deployment

### Firebase Client Configuration (NEXT_PUBLIC_* variables)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xnews-630ce.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xnews-630ce
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xnews-630ce.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=983807637967
NEXT_PUBLIC_FIREBASE_APP_ID=1:983807637967:web:d7361437a6532bb5de7aba
```

### Firebase Admin Configuration (Server-side)
```
FIREBASE_PROJECT_ID=xnews-630ce
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@xnews-630ce.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### NextAuth Configuration
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

## How to Add in Vercel Dashboard

1. Go to your Vercel Dashboard
2. Select your project (10xnews)
3. Go to Settings → Environment Variables
4. Add each variable with the values above
5. Set them for Production, Preview, and Development
6. Redeploy your project

## Note
Replace `YOUR_PRIVATE_KEY_HERE` with your actual Firebase private key from your local `.env.local` file.
