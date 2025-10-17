import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
// import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: prisma && process.env.DATABASE_URL ? PrismaAdapter(prisma as any) : undefined,
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          // For production, use environment variables for admin credentials
          const adminEmail = process.env.ADMIN_EMAIL || 'admin@10xnews.com'
          const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

          console.log('Attempting login for:', credentials.email)

          if (credentials.email === adminEmail && credentials.password === adminPassword) {
            console.log('Admin login successful')
            return {
              id: 'admin-user-id',
              email: adminEmail,
              name: '10xNews Staff',
              role: 'ADMIN',
            }
          }

          console.log('Invalid credentials')
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // If the URL is a relative URL, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // If the URL is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url
      }
      // Otherwise, redirect to the base URL
      return baseUrl
    }
  },
  pages: {
    signIn: '/admin/login',
  }
}
