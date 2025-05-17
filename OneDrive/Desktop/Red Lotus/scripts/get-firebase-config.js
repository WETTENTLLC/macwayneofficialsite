// Get Firebase Config Helper

// Copy this function into your browser console when on your Firebase project settings page
// This will help you extract the config values needed for your .env files

function extractFirebaseConfig() {
  // Try to find the Firebase config on the page
  const configElement = document.querySelector('pre[class*="config"]') || 
                        document.querySelector('code:contains("apiKey")') ||
                        document.querySelector('span:contains("apiKey")');
  
  if (!configElement) {
    console.log('Could not find Firebase config on this page. Please navigate to:');
    console.log('Firebase Console > Project Settings > General > Your apps > SDK setup and configuration');
    return;
  }
  
  // Try to extract the config
  let configText = configElement.textContent;
  let match = configText.match(/apiKey:\s*["']([^"']*)["']/);
  if (!match) {
    console.log('Could not extract Firebase config. Please copy it manually.');
    return;
  }
  
  // Try to parse the config
  try {
    // Look for pattern that resembles Firebase config object
    const configPattern = /\{[\s\S]*?apiKey[\s\S]*?\}/;
    const configMatch = configText.match(configPattern);
    
    if (configMatch) {
      // Extract the config string and clean it up
      let configStr = configMatch[0]
        .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
        .replace(/'/g, '"');          // Replace single quotes with double quotes
      
      // Try to parse as JSON
      try {
        const config = JSON.parse(configStr);
        
        // Format for .env file
        const envFormat = `
# Firebase Configuration
VITE_FIREBASE_API_KEY=${config.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}
VITE_FIREBASE_PROJECT_ID=${config.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
VITE_FIREBASE_APP_ID=${config.appId}
`;
        console.log('Copy these values to your .env.development file:');
        console.log(envFormat);
        
        return envFormat;
      } catch (e) {
        console.log('Failed to parse Firebase config as JSON. Please copy it manually.');
      }
    }
  } catch (error) {
    console.log('Error parsing Firebase config:', error);
  }
}

// Run the function
extractFirebaseConfig();
