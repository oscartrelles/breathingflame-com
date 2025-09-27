import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const contentWebhook = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  try {
    // Verify the request is from FireCMS (optional security)
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.FIRECMS_WEBHOOK_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      console.log('Unauthorized webhook request');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Log the webhook trigger
    console.log('Content webhook triggered:', {
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString()
    });

    // Here you would typically trigger a rebuild of your static site
    // Options include:
    // 1. Vercel webhook
    // 2. Netlify webhook
    // 3. GitHub Actions
    // 4. Custom build service

    // Example: Trigger Vercel rebuild
    const vercelWebhookUrl = process.env.VERCEL_WEBHOOK_URL;
    if (vercelWebhookUrl) {
      try {
        const response = await fetch(vercelWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trigger: 'content-updated',
            timestamp: new Date().toISOString(),
            collection: req.body?.collection || 'unknown'
          })
        });

        if (response.ok) {
          console.log('Vercel rebuild triggered successfully');
        } else {
          console.error('Failed to trigger Vercel rebuild:', response.status);
        }
      } catch (error) {
        console.error('Error triggering Vercel rebuild:', error);
      }
    }

    // Example: Trigger GitHub Actions
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO; // format: owner/repo
    const githubWorkflowId = process.env.GITHUB_WORKFLOW_ID;

    if (githubToken && githubRepo && githubWorkflowId) {
      try {
        const response = await fetch(`https://api.github.com/repos/${githubRepo}/actions/workflows/${githubWorkflowId}/dispatches`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: 'main', // or your default branch
            inputs: {
              trigger: 'content-updated',
              collection: req.body?.collection || 'unknown'
            }
          })
        });

        if (response.ok) {
          console.log('GitHub Actions workflow triggered successfully');
        } else {
          console.error('Failed to trigger GitHub Actions:', response.status);
        }
      } catch (error) {
        console.error('Error triggering GitHub Actions:', error);
      }
    }

    // For now, just log that content was updated
    console.log('Content update processed successfully');

    res.status(200).json({
      success: true,
      message: 'Content update processed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing content webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
