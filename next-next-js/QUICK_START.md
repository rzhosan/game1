# Quick Start - Next.js Server-Side Authentication

## 5 Minute Setup

### 1. Install Dependencies
```bash
cd next-next-js
npm install
```

### 2. Create `.env.local` File

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

### 3. Generate Secret

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 })) | Cut -c 1 -43
```

Paste the generated secret into `.env.local`:
```env
NEXTAUTH_SECRET=your_generated_secret_here
```

### 4. Add OAuth Credentials

#### GitHub OAuth (Optional but Recommended)

1. Go to: https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - Name: `Mark's Arcades`
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret into `.env.local`

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

#### Google OAuth (Optional)

1. Go to: https://console.cloud.google.com/
2. Create project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credential (Web)
5. Add redirect: `http://localhost:3000/api/auth/callback/google`
6. Copy credentials into `.env.local`

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### 5. Copy Background Image

```bash
cp ../background.png public/
cp ../favicon.ico public/
```

### 6. Start Development Server

```bash
npm run dev
```

Open: http://localhost:3000

You should see the login page! 🎮

## Your `.env.local` Should Look Like:

```env
# Generated secret
NEXTAUTH_SECRET=your_secret_here

# App URL
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth Credentials (at least one required)
GITHUB_CLIENT_ID=github_client_id
GITHUB_CLIENT_SECRET=github_client_secret
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret

# Admin Emails
ADMIN_EMAILS=yourmail@example.com,admin@example.com
```

## How It Works

1. **Login Page** (`/login`)
   - User clicks provider button (GitHub, Google, or email)
   - Gets redirected to OAuth provider or processes credentials

2. **Server-Side Session** 
   - NextAuth creates secure session on server
   - User gets HTTP-only cookie (cannot be accessed by JavaScript)
   - Much more secure than localStorage!

3. **Protected Routes** 
   - Middleware checks session automatically
   - Unauthenticated users redirected to `/login`
   - Pages use `getServerSideProps` with `getServerSession()`

4. **User Access**
   - Use `useSession()` hook in components
   - Use `getServerSession()` in pages/API routes
   - Session data includes user: `{ name, email, image, isAdmin }`

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Deployment

### Vercel (1 Click Deploy)
```bash
npm install -g vercel
vercel
```

### Other Platforms
1. Build: `npm run build`
2. Set environment variables (same as `.env.local`)
3. Start command: `npm start`

---

**That's it! 🎉 Your app now has secure server-side authentication!**

See `MIGRATION_GUIDE.md` for more details.
