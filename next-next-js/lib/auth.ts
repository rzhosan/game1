import { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'

const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
const blockedEmails = (process.env.BLOCKED_EMAILS || 'karolina.wontrucka@gmail.com').split(',').map(e => e.trim())

export const authOptions: NextAuthOptions = {
  providers: [
    // Only add OAuth providers if credentials are configured
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
          }),
        ]
      : []),
    // Guest provider
    CredentialsProvider({
      id: 'guest',
      name: 'Guest',
      credentials: {},
      async authorize() {
        return {
          id: 'guest',
          email: 'guest@arcade.local',
          name: 'Guest',
          isAdmin: false,
        }
      },
    }),
    // Credentials provider for email login (keep for backward compatibility)
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        // Check if email is in admin list or authorized list
        if (adminEmails.includes(credentials.email)) {
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            isAdmin: true,
          }
        }

        // You can add more authorization logic here
        // For example, check a database of authorized users
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      // Block specific emails from signing in
      if (blockedEmails.includes(user.email || '')) {
        return false
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.isAdmin = adminEmails.includes(user.email || '')
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).isAdmin = token.isAdmin
        // Ensure image is never undefined (use null instead)
        if (!session.user.image) {
          session.user.image = null
        }
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

export const isUserAdmin = (email?: string | null): boolean => {
  return email ? adminEmails.includes(email) : false
}
