# Deployment Guide for Red Lotus Music Website

This document outlines how to deploy the Red Lotus music website to production using Vercel.

## Vercel Deployment

The official production URL for the Red Lotus website is:
**https://red-lotus-music.vercel.app/**

### Deployment Steps

1. **Environment Variables Setup**
   - Copy all variables from `.env.production` to your Vercel project's Environment Variables settings
   - Make sure to use actual values, not placeholders
   - Mark sensitive variables (like API keys) as "Encrypted"

2. **Firebase Configuration**
   - Ensure the Firebase project is properly configured for production
   - Enable Authentication with Email/Password provider
   - Set up proper security rules for Firestore and Storage

3. **Admin Account Setup**
   - ✅ Admin user created in Firebase Authentication (UID: YW6ZOqhx0pd8lx0bD3EruCTEfTF3)
   - Security rules have been updated to use this specific admin UID
   - See ADMIN_ACCOUNTS.md for details on managing admin users

4. **Deployment Process**
   - Connect GitHub repository to Vercel
   - Configure build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

5. **Domain Configuration**
   - Follow instructions in `DOMAIN_SETUP.md` to set up the custom domain
   - Current DNS configuration points `redlotusmusic.com` to the Vercel deployment

6. **Post-Deployment Verification**
   - Check that authentication works properly
   - Verify all Firebase interactions are working
   - Test responsive design on multiple device sizes

## Maintenance

- Update environment variables in the Vercel dashboard when needed
- Use the Vercel CLI for more advanced deployment options: `vercel`
- Monitor error tracking through Vercel's analytics dashboard

## Troubleshooting

If the application fails to connect to Firebase:
1. Check environment variables in Vercel dashboard
2. Verify Firebase configuration in Firebase console
3. Check browser console for specific error messages
