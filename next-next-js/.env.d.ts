declare namespace NodeJS {
  interface ProcessEnv {
    // NextAuth
    NEXTAUTH_SECRET: string
    NEXTAUTH_URL: string

    // GitHub OAuth
    GITHUB_CLIENT_ID?: string
    GITHUB_CLIENT_SECRET?: string

    // Google OAuth
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string

    // Azure AD
    AZURE_AD_CLIENT_ID?: string
    AZURE_AD_CLIENT_SECRET?: string
    AZURE_AD_TENANT_ID?: string

    // Admin and Blocked Emails
    ADMIN_EMAILS?: string
    BLOCKED_EMAILS?: string
  }
}
