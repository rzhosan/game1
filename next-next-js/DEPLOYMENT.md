# Deployment Guide - Next.js with Server-Side Authentication

## Overview

Your Next.js application with server-side authentication can be deployed to several platforms. Choose the one that best fits your needs.

## Deployment Options

### 1. **Vercel** (Recommended - Made by Next.js creators)

#### Advantages
- 🚀 Easiest deployment
- ⚡ Optimized for Next.js
- 💰 Free tier available
- 🔄 Automatic deployments from GitHub
- 🌍 Global CDN
- 📊 Built-in analytics

#### Setup

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repo
   - Select the `next-next-js` folder as root

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local.example`:
     ```
     NEXTAUTH_SECRET=your_secret
     NEXTAUTH_URL=https://yourdomain.vercel.app
     NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
     GITHUB_CLIENT_ID=xxx
     GITHUB_CLIENT_SECRET=xxx
     GOOGLE_CLIENT_ID=xxx
     GOOGLE_CLIENT_SECRET=xxx
     ADMIN_EMAILS=your@email.com
     ```

4. **Update OAuth Callbacks**
   - GitHub: `https://yourdomain.vercel.app/api/auth/callback/github`
   - Google: `https://yourdomain.vercel.app/api/auth/callback/google`

5. **Deploy**
   - Click "Deploy"
   - Done! 🎉

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

### 2. **Netlify**

#### Advantages
- 📦 Free hosting
- 🔗 Easy GitHub integration
- ⚙️ Serverless functions
- 💾 Form handling

#### Setup

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New site from Git"
   - Select repository
   - Select branch

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory (optional): `next-next-js`

4. **Deploy**
   - Site builds and deploys automatically

5. **Add Environment Variables**
   - Site settings → Build & Deploy → Environment
   - Add all variables from `.env.local.example`

6. **Update OAuth Callbacks**
   - GitHub: `https://your-site.netlify.app/api/auth/callback/github`
   - Google: `https://your-site.netlify.app/api/auth/callback/google`

---

### 3. **Railway**

#### Advantages
- 🚀 Node.js friendly
- 💰 Pay-as-you-go pricing
- 🔌 Easy database integration
- 📈 Good for scaling

#### Setup

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Set `ROOT_DIR` to `next-next-js` (if not in root)
   - Add environment variables
   - Click "Deploy"

4. **Domain**
   - Generate domain: `https://[project]-[env].railway.app`
   - Update `NEXTAUTH_URL` accordingly

---

### 4. **Render**

#### Advantages
- 🎯 Simple deployment
- 🌍 Global CDN
- 🔒 HTTPS included
- 🆓 Free tier

#### Setup

1. **Create Render Account**
   - Go to https://render.com

2. **Create Web Service**
   - New → Web Service
   - Connect GitHub
   - Select repository

3. **Configure**
   - Name: `marks-arcades`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: `next-next-js`

4. **Environment Variables**
   - Add all required variables
   - Set `NEXTAUTH_URL` to your Render domain

---

### 5. **Docker + Any Host**

#### Build Docker Image

Create `next-next-js/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED=1
CMD ["npm", "start"]
```

Create `next-next-js/.dockerignore`:
```
node_modules
.git
.next
```

#### Build & Run

```bash
# Build image
docker build -t marks-arcades .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your_secret \
  -e GITHUB_CLIENT_ID=xxx \
  -e GITHUB_CLIENT_SECRET=xxx \
  marks-arcades
```

#### Deploy to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean
- Any Docker-compatible host

---

### 6. **Traditional VPS (Ubuntu/Debian)**

#### Prerequisites
- Ubuntu 20.04+ or Debian server
- Node.js 18+
- Nginx or Apache (optional, for reverse proxy)
- PM2 (for process management)

#### Setup

```bash
# SSH into server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/YOUR_USERNAME/game1.git
cd game1/next-next-js

# Install dependencies
npm ci --production

# Build
npm run build

# Create .env file (copy from .env.local)
nano .env.local
# Add your environment variables
```

#### Start with PM2

```bash
# Start app
pm2 start npm --name "marks-arcades" -- start

# Save PM2 config
pm2 save

# Setup auto-start on reboot
pm2 startup
```

#### Nginx Reverse Proxy

Create `/etc/nginx/sites-available/marks-arcades`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable & restart:
```bash
sudo ln -s /etc/nginx/sites-available/marks-arcades /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL Certificate (Free with Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Environment Variables for Production

```env
# CRITICAL - Change for production!
NEXTAUTH_SECRET=your_production_secret_generate_new_one

# Your production domain
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# OAuth credentials (same as development, providers don't care)
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Admin emails
ADMIN_EMAILS=you@example.com

# Optional - Analytics
NODE_ENV=production
```

⚠️ **NEVER commit `.env.local` to GitHub!** It's in `.gitignore` for a reason.

---

## Pre-Deployment Checklist

- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] OAuth credentials configured and tested
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] All environment variables defined
- [ ] Background image in `public/`
- [ ] Domain purchased and DNS configured (if custom domain)
- [ ] HTTPS enabled (required for OAuth)
- [ ] Test login flow
- [ ] Test logout
- [ ] Test admin features (if applicable)
- [ ] Database configured (if using sessions DB)

---

## Monitoring & Maintenance

### Logs
- **Vercel**: Deployment logs in dashboard
- **Netlify**: Logs under Site Settings
- **Railway**: Monitor tab shows real-time logs
- **VPS**: `pm2 logs marks-arcades`

### Updates
```bash
# Keep Next.js updated
npm update next

# Keep NextAuth.js updated
npm update next-auth

# Update all packages
npm update
npm audit
```

### Backups
- Backup `.env` file (in secure password manager)
- Backup database (if applicable)
- Backup GitHub repository

---

## Cost Estimates (Monthly)

| Platform | Free Tier | Paid Starting | Best For |
|----------|-----------|---------------|----------|
| **Vercel** | ✅ Yes | $20/mo | Easy deployment |
| **Netlify** | ✅ Yes | $19/mo | Hobby projects |
| **Railway** | ✅ $5 | Pay-as-you-go | Scaling apps |
| **Render** | ✅ Yes | $7/mo | Simple projects |
| **VPS** | ❌ No | $5-50+/mo | Full control |

---

## Post-Deployment

1. **Monitor Performance**
   - Check page load times
   - Monitor API response times
   - Check error rates

2. **User Feedback**
   - Collect user feedback
   - Monitor login issues
   - Track admin features usage

3. **Security**
   - Rotate OAuth secrets periodically
   - Monitor for unauthorized access
   - Keep packages updated

4. **Scale as Needed**
   - Add database for persistent data
   - Add caching (Redis)
   - Add CDN for assets
   - Add analytics

---

For specific platform questions, refer to their documentation:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Railway: https://docs.railway.app
- Render: https://render.com/docs
