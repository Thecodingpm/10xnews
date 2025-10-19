import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testing Firestore rules and permissions...')
    
    const { initializeApp } = await import('firebase/app')
    const { getFirestore, collection, getDocs, query, limit } = await import('firebase/firestore')
    
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "xnews-630ce.firebaseapp.com",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "xnews-630ce",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "xnews-630ce.firebasestorage.app",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "983807637967",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:983807637967:web:d7361437a6532bb5de7aba"
    }
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    const tests = []
    
    // Test 1: Read posts collection
    try {
      const postsQuery = query(collection(db, 'posts'), limit(1))
      const postsSnapshot = await getDocs(postsQuery)
      tests.push({
        test: 'Read posts collection',
        status: '✅ Success',
        count: postsSnapshot.docs.length,
        error: null
      })
    } catch (error) {
      tests.push({
        test: 'Read posts collection',
        status: '❌ Failed',
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    // Test 2: Read categories collection
    try {
      const categoriesQuery = query(collection(db, 'categories'), limit(1))
      const categoriesSnapshot = await getDocs(categoriesQuery)
      tests.push({
        test: 'Read categories collection',
        status: '✅ Success',
        count: categoriesSnapshot.docs.length,
        error: null
      })
    } catch (error) {
      tests.push({
        test: 'Read categories collection',
        status: '❌ Failed',
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    // Test 3: Read users collection
    try {
      const usersQuery = query(collection(db, 'users'), limit(1))
      const usersSnapshot = await getDocs(usersQuery)
      tests.push({
        test: 'Read users collection',
        status: '✅ Success',
        count: usersSnapshot.docs.length,
        error: null
      })
    } catch (error) {
      tests.push({
        test: 'Read users collection',
        status: '❌ Failed',
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    return NextResponse.json({
      success: true,
      tests,
      timestamp: new Date().toISOString(),
      recommendations: tests.some(t => t.status === '❌ Failed') ? [
        'Check Firestore security rules',
        'Ensure collections exist',
        'Verify Firebase project permissions'
      ] : [
        'All tests passed - Firebase is working correctly'
      ]
    })
    
  } catch (error) {
    console.error('Firestore rules test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
