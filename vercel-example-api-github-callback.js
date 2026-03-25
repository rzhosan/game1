// api/github-callback.js
// GitHub OAuth Callback Handler for Vercel
// Deploy this file to Vercel and set environment variables:
// - GITHUB_CLIENT_ID: Your GitHub OAuth app Client ID
// - GITHUB_CLIENT_SECRET: Your GitHub OAuth app Client Secret

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code, redirect_uri } = req.body;

  // Validate input
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  // Validate environment variables
  if (!clientId || !clientSecret) {
    console.error('Missing GitHub OAuth credentials in environment variables');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    console.log('Exchanging GitHub code for access token...');

    // Step 1: Exchange authorization code for access token
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

    // Check for token exchange errors
    if (tokenData.error) {
      console.error('Token exchange failed:', tokenData.error_description);
      return res.status(400).json({ 
        error: tokenData.error_description || 'Token exchange failed' 
      });
    }

    if (!tokenData.access_token) {
      console.error('No access token received');
      return res.status(400).json({ error: 'No access token received' });
    }

    console.log('Access token received, fetching user profile...');

    // Step 2: Get user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mark-Arcades-OAuth'
      }
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    // Step 3: Get user email (if not public)
    if (!userData.email) {
      console.log('Email not public, fetching from /user/emails endpoint...');
      
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Mark-Arcades-OAuth'
        }
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find(e => e.primary);
        if (primaryEmail) {
          userData.email = primaryEmail.email;
        }
      }
    }

    // Step 4: Validate we have an email
    if (!userData.email) {
      console.error('No email found for GitHub user');
      return res.status(400).json({ 
        error: 'Email not available. Please make sure your GitHub email is public or you have authorized email access.' 
      });
    }

    console.log('Successfully authenticated GitHub user:', userData.login);

    // Return user data (DO NOT include access token)
    return res.status(200).json({
      login: userData.login,
      email: userData.email,
      name: userData.name,
      avatar_url: userData.avatar_url,
      id: userData.id,
      bio: userData.bio,
      company: userData.company,
      blog: userData.blog,
      public_repos: userData.public_repos
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error: ' + error.message 
    });
  }
}
