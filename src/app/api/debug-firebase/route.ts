import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Starting Firebase debug...')
    
    // Check environment variables
    const envVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
    }
    
    console.log('Environment variables:', envVars)
    
    // Try to initialize Firebase
    let firebaseInit = '❌ Failed'
    let firestoreTest = '❌ Failed'
    let errorDetails = ''
    
    try {
      const { initializeApp } = await import('firebase/app')
      const { getFirestore } = await import('firebase/firestore')
      
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "xnews-630ce.firebaseapp.com",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "xnews-630ce",
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "xnews-630ce.firebasestorage.app",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "983807637967",
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:983807637967:web:d7361437a6532bb5de7aba"
      }
      
      console.log('Firebase config:', firebaseConfig)
      
      const app = initializeApp(firebaseConfig)
      firebaseInit = '✅ Success'
      
      // Test Firestore
      const db = getFirestore(app)
      const { collection, getDocs } = await import('firebase/firestore')
      
      const postsSnapshot = await getDocs(collection(db, 'posts'))
      firestoreTest = `✅ Success (${postsSnapshot.docs.length} posts)`
      
    } catch (error) {
      errorDetails = error instanceof Error ? error.message : 'Unknown error'
      console.error('Firebase error:', error)
    }
    
    // Test our Firebase data functions
    let dataFunctionsTest = '❌ Failed'
    try {
      const { getPosts, getCategories } = await import('@/lib/firebase-data')
      const [posts, categories] = await Promise.all([
        getPosts(),
        getCategories()
      ])
      
      dataFunctionsTest = `✅ Success (${Array.isArray(posts) ? posts.length : 0} posts, ${Array.isArray(categories) ? categories.length : 0} categories)`
    } catch (error) {
      errorDetails += ` | Data functions error: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.error('Data functions error:', error)
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        environment: envVars,
        firebaseInit,
        firestoreTest,
        dataFunctionsTest,
        errorDetails,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
