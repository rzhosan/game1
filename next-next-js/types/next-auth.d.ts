import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string
      email?: string
      name?: string
      image?: string
      isAdmin?: boolean
    }
  }

  interface User {
    id?: string
    email?: string
    name?: string
    image?: string
    isAdmin?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    email?: string
    isAdmin?: boolean
  }
}
