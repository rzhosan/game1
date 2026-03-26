# Mark's Arcades - Next.js Migration Guide

## Overview

Your game portal has been migrated from a static HTML/JavaScript application to a modern **Next.js** application with **server-side authentication** using **NextAuth.js**.

## Key Changes

### 1. **Server-Side Authentication** ✨
- **Before**: Client-side authentication with tokens stored in `localStorage`
- **After**: Session-based authentication managed entirely on the server
- **Benefits**: 
  - More secure (tokens never exposed to the client)
  - Automatic session management
  - Built-in CSRF protection
  - Easy logout handling

### 2. **Tech Stack**
```
Old Stack:
- Plain HTML/CSS/JavaScript
- Client-side authentication
- localStorage for session management
- Static deployment (GitHub Pages)

New Stack:
- Next.js 14 (React framework)
- NextAuth.js (authentication)
- Server-side session management
- TypeScript (optional but recommended)
- Can deploy to Vercel, Netlify, or any Node.js host
```

### 3. **Project Structure**

```
next-next-js/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].ts          (NextAuth handler - all /api/auth/* routes)
│   │   ├── auth/
│   │   │   └── logout.ts                 (Optional custom logout)
│   │   └── user.ts                       (Get current user info)
│   ├── games/
│   │   └── [game].tsx                    (Dynamic game pages)
│   ├── auth/
│   │   └── error.tsx                     (Auth error page)
│   ├── _app.tsx                          (App wrapper with SessionProvider)
│   ├── _document.tsx                     (HTML document structure)
│   ├── index.tsx                         (Home page - games list)
│   └── login.tsx                         (Login page)
├── lib/
│   └── auth.ts                           (NextAuth configuration)
├── styles/
│   ├── globals.css                       (Global styles)
│   ├── Login.module.css                  (Login page styles)
│   ├── Home.module.css                   (Home page styles)
│   └── Game.module.css                   (Game page styles)
├── types/
│   └── next-auth.d.ts                    (TypeScript types)
├── public/
│   ├── background.png                    (Your background image - copy from root)
│   ├── favicon.ico                       (Your favicon)
│   └── apple-touch-icon.png              (Your apple icon)
├── .env.local.example                    (Environment variables template)
├── next.config.js                        (Next.js configuration)
├── tsconfig.json                         (TypeScript configuration)
├── package.json                          (Dependencies)
└── middleware.ts                         (Protected routes middleware)
```

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd next-next-js
npm install
```

Or with yarn:
```bash
cd next-next-js
yarn install
```

### Step 2: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your values:

```env
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here

# Your app URL
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GitHub OAuth (https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Google OAuth (https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Admin emails (comma-separated)
ADMIN_EMAILS=you@example.com,admin@example.com
```

### Step 3: Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Or on Windows (PowerShell):
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF32.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 127)}))) | Cut-c 1-43
```

Or use an online tool: https://generate-secret.vercel.app/32

### Step 4: OAuth Setup

#### GitHub OAuth

1. Go to: https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: Mark's Arcades
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy `Client ID` and generate `Client Secret`
4. Add to `.env.local`

#### Google OAuth

1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 Credential** (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy `Client ID` and `Client Secret`
7. Add to `.env.local`

### Step 5: Copy Static Assets

Copy these files from the root directory to `next-next-js/public/`:
```bash
cp background.png next-next-js/public/
cp favicon.ico next-next-js/public/
cp apple-touch-icon.png next-next-js/public/ (if exists)
```

### Step 6: Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Migration from Old Project

### What's Different for Users

| Feature | Before | After |
|---------|--------|-------|
| Login | Click login button, email in localStorage | Click login button, session on server |
| Authorization | Client-side token validation | Server-side session validation |
| 2FA | Optional, client-side | Server-side compatible |
| User Data | localStorage | Server session (secure) |
| Logout | Clear localStorage | Clear server session (automatic) |
| CSRF Protection | None | Automatic |
| Session Duration | Manual (localStorage) | Configurable (30 days default) |

### What Changed in Code

1. **No more `localStorage`**:
   ```javascript
   // OLD ❌
   localStorage.setItem('currentUser', JSON.stringify(user))
   const user = JSON.parse(localStorage.getItem('currentUser'))
   
   // NEW ✅
   const { data: session } = useSession()
   if (session?.user) { /* user is authenticated */ }
   ```

2. **No more client-side session checks**:
   ```javascript
   // OLD ❌
   if (!localStorage.getItem('currentUser')) {
     // redirect to login
   }
   
   // NEW ✅
   // Handled automatically by middleware.ts
   // Protected pages use getServerSideProps with getServerSession()
   ```

3. **Authentication is server-side**:
   ```typescript
   // NEW - In pages/index.tsx
   export const getServerSideProps: GetServerSideProps = async (context) => {
     const session = await getServerSession(context.req, context.res, authOptions)
     
     if (!session) {
       return {
         redirect: { destination: '/login', permanent: false }
       }
     }
     
     return { props: { session } }
   }
   ```

## Deployment

### Vercel (Recommended - Easiest)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables in settings
5. Deploy! 🚀

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Build & Deploy settings
5. Deploy! 🚀

### Custom Server (Node.js)

```bash
# Build
npm run build

# Start
npm start

# Or use PM2 for process management
npm i -g pm2
pm2 start npm -- start
```

## API Routes

### Authentication Routes (NextAuth)

- `POST /api/auth/signin` - Sign in with provider
- `POST /api/auth/signin/[provider]` - Sign in with specific provider
- `GET /api/auth/callback/[provider]` - OAuth callback
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Custom API Routes

- `GET /api/user` - Get current user info (protected)
- `POST /api/auth/logout` - Custom logout handler (optional)

## Adding Games

To add your HTML games to the Next.js version:

### Option 1: Iframe Embedding
```tsx
// In pages/games/[game].tsx
<iframe
  src="/games/your-game.html"
  style={{ width: '100%', height: '100%', border: 'none' }}
/>
```

### Option 2: React Components
Convert your game to a React component and import it.

### Option 3: Keep HTML, Wrap in Next.js
Use static `/public` folder for HTML files and iframe them.

## Migrating From Old Project

### Session Management Migration

OLD (localStorage):
```javascript
const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const blockedPlayers = JSON.parse(localStorage.getItem('blocked_players'))
const authorizedEmails = JSON.parse(localStorage.getItem('authorized_emails'))
```

NEW (Server-side):
```typescript
// Use getServerSession in API routes or pages
const session = await getServerSession(req, res, authOptions)

// For admin features, check in lib/auth.ts
import { isUserAdmin } from '@/lib/auth'
if (isUserAdmin(session?.user?.email)) {
  // Admin-only code
}
```

### Data Persistence

For persistent user data (beyond session):
- Use a database (PostgreSQL, MongoDB, etc.)
- Store in verified user profiles
- Use Prisma ORM or similar

## Security Benefits

✅ **Session tokens never exposed** - Stored securely in HTTP-only cookies

✅ **CSRF Protection** - Built-in with NextAuth.js

✅ **Server-side validation** - All auth checks happen on server

✅ **No localStorage vulnerabilities** - Less attack surface

✅ **Automatic session expiration** - Configurable per your needs

✅ **JWT signing** - Cryptographically secure tokens

## Troubleshooting

### Issue: "NEXTAUTH_SECRET not set"
**Solution**: Generate and add to `.env.local`:
```bash
openssl rand -base64 32
```

### Issue: "OAuth callback URL mismatch"
**Solution**: Make sure your OAuth app uses the same callback URL:
- Development: `http://localhost:3000/api/auth/callback/provider`
- Production: `https://yourdomain.com/api/auth/callback/provider`

### Issue: "Session not persisting"
**Solution**: 
1. Check `.env.local` has `NEXTAUTH_SECRET`
2. Check `NEXTAUTH_URL` matches your domain
3. For cookies, ensure HTTPS in production

### Issue: "User keeps logging in"
**Solution**: Session expiration might be too short. Adjust in `lib/auth.ts`:
```typescript
session: {
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

## Next Steps

1. **Add game content** - Migrate HTML games to pages
2. **Database integration** - Add Prisma for persistent data
3. **User profiles** - Store user progress and achievements
4. **Analytics** - Add page tracking
5. **Admin panel** - Create admin dashboard for management

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js Sessions](https://next-auth.js.org/concepts/session-strategies)
- [Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)

## Questions?

Check the `.env.local.example` file for all available options and the official NextAuth.js documentation for advanced configuration.
