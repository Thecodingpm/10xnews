// Script to set up admin user in Firebase Authentication
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBuBMojG_r-aQZ5Hj7sWu-Jc0g1Qa5SNoE",
  authDomain: "xnews-630ce.firebaseapp.com",
  projectId: "xnews-630ce",
  storageBucket: "xnews-630ce.firebasestorage.app",
  messagingSenderId: "983807637967",
  appId: "1:983807637967:web:d7361437a6532bb5de7aba",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function setupAdminUser() {
  try {
    console.log('Setting up admin user...')
    
    const adminEmail = 'ahmadmuaaz292@gmail.com'
    const adminPassword = 'admin123' // Change this to a secure password
    
    // Try to create the admin user
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
      console.log('Admin user created successfully:', userCredential.user.email)
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin user already exists, trying to sign in...')
        try {
          await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
          console.log('Admin user sign in successful')
        } catch (signInError: any) {
          console.error('Sign in failed:', signInError.message)
          console.log('Please check if the password is correct or reset it in Firebase Console')
        }
      } else {
        console.error('Error creating admin user:', error.message)
      }
    }
    
    console.log('Admin setup completed!')
    console.log('Email:', adminEmail)
    console.log('Password:', adminPassword)
    console.log('You can now use these credentials to login to the admin panel.')
    
  } catch (error) {
    console.error('Error setting up admin user:', error)
  }
}

// Run the setup function
setupAdminUser()
