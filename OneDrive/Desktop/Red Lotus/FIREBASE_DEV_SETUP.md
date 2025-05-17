# Firebase Development Setup Guide

This guide will help you set up your Firebase credentials for local development.

## Steps to Configure Firebase for Local Development

1. **Access Firebase Console**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your Red Lotus project (red-lotus-cf4b4)

2. **Get Firebase Project Configuration**
   - Click on the gear icon (Project Settings) 
   - In the General tab, scroll down to "Your apps" section
   - If no app is registered, click on the web icon (</>) to add a web app
   - If an app is already registered, select it to view configuration

3. **Copy Firebase Configuration**
   - In the SDK setup section, you'll see a firebaseConfig object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "project-id.firebaseapp.com",
     projectId: "project-id",
     storageBucket: "project-id.appspot.com",
     messagingSenderId: "sender-id",
     appId: "app-id"
   };
   ```

4. **Update .env.development File**
   - Open `.env.development` file in your project
   - Add the values from your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=project-id
   VITE_FIREBASE_STORAGE_BUCKET=project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=sender-id
   VITE_FIREBASE_APP_ID=app-id
   ```

5. **Restart Development Server**
   - Stop the current development server if running
   - Run `npm run dev` to restart with the new configuration

6. **Test Authentication**
   - Try to log in using your Firebase admin account
   - Verify that authentication works correctly

## Troubleshooting

- **Invalid API Key Error**: Make sure the API key copied from Firebase console is correct
- **Project Not Found**: Verify that the project ID in firebaseConfig matches your Firebase project
- **Authentication Failures**: Ensure that Email/Password authentication is enabled in Firebase console

## Security Note

- Never commit your `.env.development` file with real credentials to version control
- Make sure `.env.development` is in your .gitignore file
