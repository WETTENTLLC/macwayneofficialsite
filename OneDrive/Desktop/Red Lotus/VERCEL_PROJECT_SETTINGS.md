# Vercel Project Settings

## Public Access Configuration

This project should be set to be publicly accessible without requiring Vercel authentication.

To set this in the Vercel dashboard:

1. Log in to Vercel dashboard
2. Go to the Red Lotus project
3. Navigate to Settings > General
4. Under "Privacy", ensure "Public (Shareable)" is selected
5. Save changes

## Custom Domain

Redlotusmusic.com should be configured as custom domain with proper SSL certificate.

## Environment Variables

The following environment variables must be set:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## Authentication

Only the /admin and /login paths should require authentication. The main site should be publicly accessible.
