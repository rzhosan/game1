# GitHub Authentication Quick Start Checklist

Follow these steps to set up GitHub authentication for your game portal.

## 🔧 Configuration (5 minutes)

### Step 1: Create GitHub OAuth App
- [ ] Go to https://github.com/settings/developers
- [ ] Click "OAuth Apps" then "New OAuth App"
- [ ] Fill in:
  - Application name: `Mark's Arcades`
  - Homepage URL: `https://zhasa.github.io/game1` (replace 'zhasa' with your GitHub username)
  - Authorization callback URL: `https://zhasa.github.io/game1`
- [ ] Receive and copy your **Client ID**
- [ ] Generate and save your **Client Secret** (keep it private!)

### Step 2: Deploy Backend (Choose One)

#### Option 1: Vercel (Easiest) ⭐
1. [ ] Create free account at https://vercel.com
2. [ ] Click "New Project"
3. [ ] Import your GitHub repo (game1)
4. [ ] Skip creating from template
5. [ ] In "Environment Variables", add:
   - `GITHUB_CLIENT_ID` = Your Client ID from Step 1
   - `GITHUB_CLIENT_SECRET` = Your Client Secret from Step 1
6. [ ] Deploy
7. [ ] Copy your project URL (e.g., `https://game1.vercel.app`)
8. [ ] Note your backend endpoint: `https://game1.vercel.app/api/github-callback`

#### Option 2: Netlify
1. [ ] Fork or connect your repo to https://netlify.com
2. [ ] Add environment variables in Site Settings → Build & Deploy
3. [ ] Create `netlify/functions/github-callback.js` (see backend example)
4. [ ] Deploy
5. [ ] Note your backend endpoint: `https://yoursite.netlify.app/.netlify/functions/github-callback`

#### Option 3: Custom Backend
- [ ] See `GITHUB_AUTH_SETUP.md` for Express.js server example
- [ ] Deploy to your server
- [ ] Note your backend endpoint

### Step 3: Update Frontend Code

1. [ ] Open `index.html`
2. [ ] Find this line (around line 1327):
   ```javascript
   const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
   ```
   Replace with: `const GITHUB_CLIENT_ID = '1a2b3c4d5e6f...';` (your Client ID)

3. [ ] Find this line (around line 1356):
   ```javascript
   const backendURL = 'YOUR_BACKEND_ENDPOINT';
   ```
   Replace with your backend URL from Step 2, e.g.:
   - Vercel: `const backendURL = 'https://game1.vercel.app/api/github-callback';`
   - Netlify: `const backendURL = 'https://yoursite.netlify.app/.netlify/functions/github-callback';`

4. [ ] Save and commit changes to GitHub

### Step 4: Test
1. [ ] Push changes to GitHub (they'll auto-deploy to GitHub Pages)
2. [ ] Open your game page: https://zhasa.github.io/game1
3. [ ] Click "Sign in with GitHub" button
4. [ ] You should see GitHub's authorization screen
5. [ ] After clicking "Authorize", you should be logged in!

---

## 📋 Files Modified/Created

- ✅ `index.html` - Added GitHub login button and OAuth handler
- ✅ `GITHUB_AUTH_SETUP.md` - Complete setup guide
- ✅ `vercel-example-api-github-callback.js` - Example backend for Vercel
- ✅ `QUICK_START.md` - This file!

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "GitHub OAuth not configured" | Make sure you updated `GITHUB_CLIENT_ID` in index.html |
| "Backend endpoint not configured" | Make sure you updated `backendURL` in index.html |
| Redirect URL mismatch error | Check that your GitHub OAuth app callback URL matches your site URL |
| 403/404 from backend | Check that your backend endpoint URL is correct and the backend is running |
| No email received | Make sure your GitHub email is public or add email to authorization scope |

---

## 🔒 Security Reminder

⚠️ **NEVER commit these to GitHub:**
- `GITHUB_CLIENT_SECRET` - Keep only in backend environment variables
- Any actual access tokens or credentials

✅ **DO commit:**
- `GITHUB_CLIENT_ID` - This is public
- The backend code (without secrets)

---

## 📚 Reference

- GitHub OAuth Docs: https://docs.github.com/en/developers/apps/building-oauth-apps
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

---

## Next Steps (Optional)

- Customize GitHub profile data displayed
- Add GitHub user avatar to player profile
- Track which games each GitHub user plays
- Add Discord/Google/GitHub login to other games

---

**Need help?** Check the full setup guide in `GITHUB_AUTH_SETUP.md`
