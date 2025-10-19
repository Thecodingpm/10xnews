// Script to check Firebase setup and Firestore configuration
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
  authDomain: "xnews-630ce.firebaseapp.com",
  projectId: "xnews-630ce",
  storageBucket: "xnews-630ce.firebasestorage.app",
  messagingSenderId: "983807637967",
  appId: "1:983807637967:web:d7361437a6532bb5de7aba",
}

async function checkFirebaseSetup() {
  try {
    console.log('🔥 Checking Firebase setup...')
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    console.log('✅ Firebase initialized successfully')
    console.log('📊 Project ID:', firebaseConfig.projectId)
    
    // Test Firestore connection
    console.log('🔍 Testing Firestore connection...')
    
    // Check if posts collection exists
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'))
      console.log(`✅ Posts collection found: ${postsSnapshot.docs.length} documents`)
      
      if (postsSnapshot.docs.length > 0) {
        console.log('📝 Sample posts:')
        postsSnapshot.docs.slice(0, 3).forEach(doc => {
          const data = doc.data()
          console.log(`  - ${data.title} (${data.published ? 'Published' : 'Draft'})`)
        })
      }
    } catch (error) {
      console.log('❌ Posts collection error:', error)
    }
    
    // Check if categories collection exists
    try {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'))
      console.log(`✅ Categories collection found: ${categoriesSnapshot.docs.length} documents`)
      
      if (categoriesSnapshot.docs.length > 0) {
        console.log('📂 Sample categories:')
        categoriesSnapshot.docs.slice(0, 3).forEach(doc => {
          const data = doc.data()
          console.log(`  - ${data.name} (${data.slug})`)
        })
      }
    } catch (error) {
      console.log('❌ Categories collection error:', error)
    }
    
    // Check if users collection exists
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      console.log(`✅ Users collection found: ${usersSnapshot.docs.length} documents`)
    } catch (error) {
      console.log('❌ Users collection error:', error)
    }
    
    console.log('🎉 Firebase setup check completed!')
    
  } catch (error) {
    console.error('❌ Firebase setup check failed:', error)
    console.log('\n🔧 Troubleshooting steps:')
    console.log('1. Make sure Firestore is enabled in Firebase Console')
    console.log('2. Check if the database is in "test mode"')
    console.log('3. Verify the project ID is correct')
    console.log('4. Check if you have the right permissions')
  }
}

// Run the check
checkFirebaseSetup()
