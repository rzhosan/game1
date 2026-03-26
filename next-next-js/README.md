# Next.js Project Structure & Architecture

## Directory Layout

```
next-next-js/
│
├── pages/                          # Page routes (each file = route)
│   ├── api/                        # API routes (serverless functions)
│   │   ├── auth/
│   │   │   └── [...nextauth].ts   # NextAuth.js handler - ALL OAuth routes
│   │   ├── user.ts                # GET current user info (protected)
│   │   └── auth/
│   │       └── logout.ts          # Custom logout handler (optional)
│   │
│   ├── auth/
│   │   └── error.tsx              # Auth error page
│   │
│   ├── games/
│   │   └── [game].tsx             # Dynamic route - /games/:game
│   │
│   ├── _app.tsx                   # App wrapper - runs on every page
│   ├── _document.tsx              # HTML document structure
│   ├── index.tsx                  # Home page / Game list (/)
│   └── login.tsx                  # Login page (/login)
│
├── lib/                           # Utility functions & configs
│   └── auth.ts                    # NextAuth configuration & utilities
│
├── types/                         # TypeScript type definitions
│   └── next-auth.d.ts             # NextAuth types
│
├── styles/                        # CSS Modules & Global styles
│   ├── globals.css                # Global styles for all pages
│   ├── Login.module.css           # Login page styles
│   ├── Home.module.css            # Home page styles
│   └── Game.module.css            # Game page styles
│
├── public/                        # Static assets (images, icons, etc)
│   ├── background.png             # Retro background
│   ├── favicon.ico                # Website icon
│   └── apple-touch-icon.png       # Mobile icon
│
├── middleware.ts                  # Route protection middleware
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
├── .env.local                     # Environment variables (git-ignored)
├── .env.local.example             # Example env variables
│
├── QUICK_START.md                 # 5-minute setup guide
├── MIGRATION_GUIDE.md             # Detailed migration guide
└── README.md                      # This file
```

## Key Files Explained

### Pages (Routing)

**`pages/index.tsx`** - Home page
- Displays all games in grid
- Server-side check: Must be logged in
- Uses `getServerSideProps` with `getServerSession()`

**`pages/login.tsx`** - Login page
- Shows OAuth providers (GitHub, Google)
- Email login option
- Server-side check: If already logged in, redirect to home

**`pages/games/[game].tsx`** - Dynamic game page
- `[game]` means dynamic routes: `/games/bug-arena`, `/games/rosti`, etc
- Protected page: Must be logged in
- Gets game config from `getServerSideProps`

**`pages/api/auth/[...nextauth].ts`** - NextAuth.js handler
- Handles ALL authentication routes:
  - `/api/auth/signin` 
  - `/api/auth/callback/github`
  - `/api/auth/callback/google`
  - `/api/auth/signout`
  - `/api/auth/session`
- This is where the OAuth magic happens!

**`pages/api/user.ts`** - User info API endpoint
- Returns current user data from session
- Protected: Only for authenticated users

### Core Files

**`lib/auth.ts`** - Authentication Configuration
- NextAuth.js setup
- OAuth provider configs
- Session callbacks
- JWT configuration
- `isUserAdmin()` helper function

**`middleware.ts`** - Route Protection
- Protects pages from unauthenticated access
- Uses `withAuth` from NextAuth
- Redirects to `/login` if not authenticated

**`pages/_app.tsx`** - App Wrapper
- Wraps all pages with `SessionProvider`
- Enables `useSession()` hook in components
- Sets up global context

**`pages/_document.tsx`** - HTML Document
- HTML structure for all pages
- Meta tags, fonts, scripts

### Styles

**`styles/globals.css`** - Global styles
- Applied to entire app
- Retro arcade theme (green glow, pixelated)
- Animations and effects

**`styles/[Page].module.css`** - Page-specific styles
- CSS Modules (scoped styles)
- Only applies to that page
- Prevents naming conflicts

## How Server-Side Authentication Works

```
User Visits /
    ↓
Next.js checks middleware.ts
    ↓
User authenticated? 
    → YES: Show page
    → NO: Redirect to /login
    ↓
Page calls getServerSideProps
    ↓
getServerSideProps calls getServerSession()
    ↓
Session retrieved from secure HTTP-only cookie
    ↓
Page receives session data, renders safely
    ↓
Session data NEVER exposed to client-side JavaScript
    ↓
User sees page with their info
```

## Environmental Variables (`.env.local`)

```env
# REQUIRED - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=random_secret_key_here

# REQUIRED - Your app URL
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OPTIONAL - GitHub OAuth
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret

# OPTIONAL - Google OAuth  
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# OPTIONAL - Admin emails (comma-separated)
ADMIN_EMAILS=user1@example.com,user2@example.com
```

## Development vs Production

### Development (npm run dev)
- Hot reload on file changes
- Detailed error messages
- `NEXTAUTH_URL=http://localhost:3000`
- No HTTPS required

### Production (npm run build && npm start)
- Optimized bundle
- `NEXTAUTH_URL=https://yourdomain.com`
- HTTPS required for security
- Environment variables from hosting platform

## Adding Features

### New Protected Page
1. Create `pages/newpage.tsx`
2. Add `getServerSideProps` with session check:
```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session) return { redirect: { destination: '/login' } }
  return { props: { session } }
}
```
3. Use `useSession()` to access user data in components

### New API Route
1. Create `pages/api/myroute.ts`
2. Check session with `getServerSession()`
3. Return JSON response

```typescript
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  
  // Your logic here
  res.status(200).json(...)
}
```

### Add OAuth Provider
1. Install provider package: `npm install next-auth/providers/[provider]`
2. Add to `lib/auth.ts`:
```typescript
import ProviderProvider from 'next-auth/providers/provider'

providers: [
  ProviderProvider({
    clientId: process.env.PROVIDER_CLIENT_ID,
    clientSecret: process.env.PROVIDER_CLIENT_SECRET,
  }),
]
```
3. Add environment variables

## Security Features

✅ **Server-side sessions** - Tokens never sent to browser

✅ **HTTP-only cookies** - JavaScript cannot access session cookie

✅ **CSRF protection** - Built-in with NextAuth

✅ **OAuth 2.0** - Industry standard for authentication

✅ **JWT signing** - Tokens cryptographically signed

✅ **Session expiration** - Configurable timeout

✅ **Middleware validation** - Protected routes automatic

## Common Tasks

### Get current user in component
```typescript
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session } = useSession()
  return <p>Hello {session?.user?.name}!</p>
}
```

### Check if user is admin
```typescript
import { isUserAdmin } from '@/lib/auth'

if (isUserAdmin(session?.user?.email)) {
  // Show admin features
}
```

### Sign out user
```typescript
import { signOut } from 'next-auth/react'

<button onClick={() => signOut({ callbackUrl: '/login' })}>
  Logout
</button>
```

### Get session in API route
```typescript
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  // Your logic here
}
```

## Deployment Checklist

- [ ] `.env.local` contents working (test locally)
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update OAuth redirect URLs on providers
- [ ] Set all environment variables on hosting platform
- [ ] HTTPS enabled on production domain
- [ ] Test login flow on production
- [ ] Test logout and session timeout
- [ ] Check admin features work

## Troubleshooting

**Pages not loading?**
- Check middleware.ts is in root
- Verify NEXTAUTH_SECRET is set
- Check getServerSession() calls in getServerSideProps

**OAuth not working?**
- Verify Client ID and Secret are set
- Check callback URLs match exactly
- Clear browser cookies and try again
- Check environment variables are loaded

**Session not persisting?**
- HTTPS required in production
- NEXTAUTH_SECRET must be set
- Check browser accepts cookies
- Verify middleware.ts exists

---

For more details, see `QUICK_START.md` and `MIGRATION_GUIDE.md`
