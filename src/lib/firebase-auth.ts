import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "xnews-630ce.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "xnews-630ce",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "xnews-630ce.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "983807637967",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:983807637967:web:d7361437a6532bb5de7aba"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Admin email list - Add your admin emails here
const ADMIN_EMAILS = [
  'ahmadmuaaz292@gmail.com',
  // Add more admin emails here
]

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false
  return ADMIN_EMAILS.includes(user.email)
}

// Sign in function
export const signInAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Check if user is admin
    if (!isAdmin(user)) {
      await signOut(auth)
      throw new Error('Access denied. Admin privileges required.')
    }
    
    return { success: true, user }
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    }
  }
}

// Sign out function
export const signOutAdmin = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Logout failed' 
    }
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Auth state change listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
