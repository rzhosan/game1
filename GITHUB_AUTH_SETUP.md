# GitHub Authentication Setup Guide

This guide explains how to set up GitHub OAuth authentication for your game portal.

## Step 1: Create a GitHub OAuth Application

1. Go to GitHub Settings → Developer settings → OAuth Apps
   - https://github.com/settings/developers

2. Click "New OAuth App"

3. Fill in the form with:
   - **Application name**: Mark's Arcades
   - **Homepage URL**: https://yourusername.github.io/game1
   - **Authorization callback URL**: https://yourusername.github.io/game1
   - (Replace `yourusername` with your actual GitHub username)

4. After creating the app, you'll receive:
   - **Client ID**: Copy this value
   - **Client Secret**: Keep this PRIVATE (never share or commit to repo)

## Step 2: Update Your Configuration

In `index.html`, find this line (around line 1325):
```javascript
const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
```

Replace `YOUR_GITHUB_CLIENT_ID` with your actual GitHub OAuth app Client ID.

## Step 3: Set Up Backend Service

Since this is a static GitHub Pages site, you need a backend service to securely exchange the authorization code for an access token. The Client Secret must never be exposed in frontend code.

Choose one of these options:

### Option A: Vercel (Recommended - Free and Easy)

1. Create a free Vercel account: https://vercel.com

2. Create a new project and add this file as `api/github-callback.js`:

```javascript
// api/github-callback.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, redirect_uri } = req.body;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirect_uri
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Get user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userResponse.json();

    // Get user email (if not public)
    if (!userData.email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const emails = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary);
      userData.email = primaryEmail?.email;
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

3. Set environment variables in Vercel dashboard:
   - `GITHUB_CLIENT_ID`: Your GitHub OAuth Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth Client Secret

4. Deploy and get your Vercel function URL (e.g., `https://your-project.vercel.app/api/github-callback`)

### Option B: Netlify (Free Alternative)

1. Create a free Netlify account: https://netlify.com

2. Create a new function file as `netlify/functions/github-callback.js`:

```javascript
// netlify/functions/github-callback.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { code, redirect_uri } = JSON.parse(event.body);
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirect_uri
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: tokenData.error_description })
      };
    }

    // Get user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userResponse.json();

    // Get user email
    if (!userData.email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      const emails = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary);
      userData.email = primaryEmail?.email;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(userData)
    };
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
```

3. Set environment variables in Netlify Site Settings

### Option C: Custom Node.js Backend

Create a simple Node.js server using Express:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/github-callback', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    
    // Exchange code for access token
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: redirect_uri
    }, {
      headers: {
        accept: 'application/json'
      }
    });

    if (response.data.error) {
      return res.status(400).json({ error: response.data.error_description });
    }

    // Get user profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`
      }
    });

    let userData = userResponse.data;

    // Get email if not public
    if (!userData.email) {
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        }
      });
      const primaryEmail = emailResponse.data.find(e => e.primary);
      userData.email = primaryEmail?.email;
    }

    res.json(userData);
  } catch (error) {
    console.error('GitHub OAuth error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 4: Update Your Frontend Configuration

After setting up your backend, update `index.html`:

Find this line (around line 1329):
```javascript
const GITHUB_REDIRECT_URI = window.location.origin + window.location.pathname;
```

And this line (around line 1333):
```javascript
const backendURL = 'YOUR_BACKEND_ENDPOINT';
```

Replace `YOUR_BACKEND_ENDPOINT` with your actual backend URL:
- **Vercel**: `https://your-project.vercel.app/api/github-callback`
- **Netlify**: `https://your-site.netlify.app/.netlify/functions/github-callback`
- **Custom**: `https://your-backend.com/api/github-callback`

## Step 5: Test GitHub Login

1. Refresh your game page
2. Click the "Sign in with GitHub" button
3. You should be redirected to GitHub to authorize the app
4. After authorization, you should be logged in!

## Troubleshooting

### "GitHub OAuth not configured" error
- Make sure you set `GITHUB_CLIENT_ID` in index.html

### "Backend endpoint not configured" error
- Make sure you set `backendURL` in the index.html file

### Authorization fails (403/404)
- Check your authorization callback URL in GitHub OAuth app settings matches your site URL
- Verify your GitHub Client Secret is correct

### Backend returns 403 Forbidden
- Verify your `GITHUB_CLIENT_SECRET` is set correctly in your backend environment variables

## Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub OAuth Flow](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Vercel Documentation](https://vercel.com/docs/serverless-functions/introduction)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

## Security Notes

⚠️ **IMPORTANT**:
- Never commit your `GITHUB_CLIENT_SECRET` to any repository
- Always use environment variables to store secrets
- The backend must be the only place that handles the Client Secret
- Use HTTPS for all OAuth communications
- Implement state validation to prevent CSRF attacks (already done in frontend)

## How the Flow Works

1. User clicks "Sign in with GitHub" button
2. Frontend redirects to GitHub's OAuth authorization URL
3. User sees GitHub's permission screen and clicks "Authorize"
4. GitHub redirects back to your site with an authorization `code`
5. Frontend sends the `code` to your backend
6. Backend securely exchanges `code` for `access_token` using Client Secret
7. Backend fetches user profile data using the `access_token`
8. Backend returns user data to frontend
9. Frontend stores user data and shows the game portal
