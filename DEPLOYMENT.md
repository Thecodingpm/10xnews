# Vercel Deployment Guide

## Required Environment Variables

Set these in your Vercel dashboard under Settings > Environment Variables:

### 1. NextAuth Configuration
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

### 2. Firebase Configuration (Public)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Admin (Server-side)
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### 4. Admin Credentials
```
ADMIN_EMAIL=admin@10xnews.com
ADMIN_PASSWORD=your-secure-password
```

### 5. Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_SITE_NAME=10xNews
NEXT_PUBLIC_SITE_DESCRIPTION=Latest tech news and insights
```

## How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click on the web app icon (</>) to get the config
6. Copy the values to your Vercel environment variables

## How to Get Firebase Admin Credentials

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (include the quotes)

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## After Setting Environment Variables

1. Redeploy your Vercel app
2. Create Firebase indexes (see links in console output)
3. Run the seed script to add sample data:
   ```bash
   npm run seed-firebase
   ```

## Admin Access

- URL: `https://your-app-name.vercel.app/admin/login`
- Email: `admin@10xnews.com` (or your custom ADMIN_EMAIL)
- Password: Your ADMIN_PASSWORD

## Troubleshooting

If you still get server errors:
1. Check Vercel function logs in the dashboard
2. Ensure all environment variables are set correctly
3. Make sure Firebase project is properly configured
4. Verify the NEXTAUTH_URL matches your Vercel domain exactly