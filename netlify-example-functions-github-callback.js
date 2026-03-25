// netlify/functions/github-callback.js
// GitHub OAuth Callback Handler for Netlify
// Set environment variables in Netlify dashboard:
// - GITHUB_CLIENT_ID: Your GitHub OAuth app Client ID
// - GITHUB_CLIENT_SECRET: Your GitHub OAuth app Client Secret

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code, redirect_uri } = JSON.parse(event.body);

    // Validate input
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Authorization code is required' })
      };
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Validate environment variables
    if (!clientId || !clientSecret) {
      console.error('Missing GitHub OAuth credentials in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server misconfigured' })
      };
    }

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
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: tokenData.error_description || 'Token exchange failed'
        })
      };
    }

    if (!tokenData.access_token) {
      console.error('No access token received');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No access token received' })
      };
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
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Email not available. Please make sure your GitHub email is public or you have authorized email access.'
        })
      };
    }

    console.log('Successfully authenticated GitHub user:', userData.login);

    // Return user data (DO NOT include access token)
    return {
      statusCode: 200,
      body: JSON.stringify({
        login: userData.login,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
        id: userData.id,
        bio: userData.bio,
        company: userData.company,
        blog: userData.blog,
        public_repos: userData.public_repos
      })
    };

  } catch (error) {
    console.error('GitHub OAuth error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error: ' + error.message
      })
    };
  }
};
