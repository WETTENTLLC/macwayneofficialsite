const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const archiver = require('archiver');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables for production (set these in your hosting environment)
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET';
const PAYPAL_SANDBOX_MODE = process.env.PAYPAL_SANDBOX_MODE !== 'false'; // Default to sandbox
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

// PayPal API URLs
const PAYPAL_API_BASE = PAYPAL_SANDBOX_MODE 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com';

// Album configuration
const ALBUM_CONFIG = {
  'Blind and Battered [Explicit]': {
    name: 'Blind and Battered [Explicit]',
    price: '25.00',
    tracks: [
      '01 - Gotta Split [Explicit].mp3',
      '02 - I Think [Explicit].mp3',
      '03 - Keep Your Mouth Shut (Skit) [Explicit].mp3',
      '04 - Just a Player [Explicit].mp3',
      '05 - Ziplocks [Explicit].mp3',
      '06 - Where You Been (Skit) [Explicit].mp3',
      '07 - Cant Tell Me [Explicit].mp3',
      '08 - Just a Gimmick [Explicit].mp3',
      '09 - Wish I Knew Then [Explicit].mp3',
      '10 - Blind and Battered [Explicit].mp3',
      '11 - Smoother Than Woodgrain [Explicit].mp3',
      '12 - Touch You [Explicit].mp3',
      '13 - Life of Magic [Explicit].mp3',
      '14 - Its Going Down [Explicit].mp3',
      '15 - One Way In [Explicit].mp3',
      '16 - Crispy Game [Explicit].mp3',
      '17 - The End of the World [Explicit].mp3',
      '18 - Smell of Victory [Explicit].mp3',
      '19 - Do the I\'m the Shit [Explicit].mp3',
      '20 - Hatin On a Blind Man [Explicit].mp3'
    ]
  }
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'deploy-clean')));

const purchasesDBPath = path.join(__dirname, 'purchases.json');

// Email transporter setup
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Helper functions
function readPurchases() {
  try {
    if (fs.existsSync(purchasesDBPath)) {
      const data = fs.readFileSync(purchasesDBPath);
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading purchases DB:', error);
  }
  return {};
}

function writePurchases(data) {
  try {
    fs.writeFileSync(purchasesDBPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to purchases DB:', error);
  }
}

// PayPal access token management
let paypalAccessToken = null;
let tokenExpiry = null;

async function getPayPalAccessToken() {
  if (paypalAccessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return paypalAccessToken;
  }

  try {
    const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, 
      'grant_type=client_credentials',
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_CLIENT_SECRET
        }
      }
    );

    paypalAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 minute early
    return paypalAccessToken;
  } catch (error) {
    console.error('Error getting PayPal access token:', error.response?.data || error.message);
    throw error;
  }
}\n\n// Simulate PayPal IPN listener\napp.post('/paypal-ipn', (req, res) => {\n    console.log('Received PayPal IPN:', req.body);\n\n    // IMPORTANT: In a real application, you MUST verify the IPN message with PayPal\n    // to ensure it's a genuine notification from PayPal and not a spoofed request.\n    // This involves sending the received data back to PayPal for validation.\n    // See PayPal IPN documentation for details: \n    // https://developer.paypal.com/api/nvp-soap/ipn/IPNImplementation/\n\n    const paymentStatus = req.body.payment_status;\n    const customData = req.body.custom ? JSON.parse(req.body.custom) : null;\n\n    if (paymentStatus === 'Completed' && customData) {\n        const { userId, itemId, itemType, itemName, amount, currency } = customData;\n        console.log(`Payment completed for ${itemType}: ${itemName} by user ${userId}`);\n\n        const purchases = readPurchases();\n        if (!purchases[userId]) {\n            purchases[userId] = { purchasedTracks: [], purchasedAlbums: [] };\n        }\n\n        if (itemType === 'track' && !purchases[userId].purchasedTracks.includes(itemId)) {\n            purchases[userId].purchasedTracks.push(itemId);\n        } else if (itemType === 'album' && !purchases[userId].purchasedAlbums.includes(itemId)) {\n            purchases[userId].purchasedAlbums.push(itemId);\n            // If an album is purchased, unlock all its tracks (assuming a predefined tracklist for the album)\n            // This part needs to be adapted based on how your album tracks are identified.\n            // For now, we'll assume 'Blind and Battered [Explicit]' is the only album.\n            if (itemId === 'Blind and Battered [Explicit]') {\n                const albumTracks = [\n                    '01 - Intro.mp3',\n                    '02 - Blind and Battered.mp3',\n                    '03 - City Lights.mp3',\n                    '04 - The Comeback.mp3',\n                    '05 - Lost and Found.mp3',\n                    '06 - Redemption Song.mp3',\n                    '07 - Street Life.mp3',\n                    '08 - Hard Times.mp3',\n                    '09 - New Beginnings.mp3',\n                    '10 - Outro.mp3'\n                ];\n                albumTracks.forEach(track => {\n                    if (!purchases[userId].purchasedTracks.includes(track)) {\n                        purchases[userId].purchasedTracks.push(track);\n                    }\n                });\n            }\n        }\n        writePurchases(purchases);\n        console.log('Purchase recorded for user:', userId, 'Item:', itemId);\n    } else {\n        console.log('Payment not completed or custom data missing. Status:', paymentStatus);\n    }\n\n    res.status(200).send('IPN Handled');\n});\n\n// Endpoint to check purchase status\napp.get('/check-purchase/:userId/:itemType/:itemId', (req, res) => {\n    const { userId, itemType, itemId } = req.params;\n    const purchases = readPurchases();\n\n    if (purchases[userId]) {\n        if (itemType === 'track' && purchases[userId].purchasedTracks.includes(itemId)) {\n            return res.json({ purchased: true });\n        }\n        if (itemType === 'album' && purchases[userId].purchasedAlbums.includes(itemId)) {\n            return res.json({ purchased: true });\n        }\n        // Check if the track is part of a purchased album\n        if (itemType === 'track') {\n            for (const albumId of purchases[userId].purchasedAlbums) {\n                // This logic assumes you have a way to map albumId to its tracks\n                // For 'Blind and Battered [Explicit]' album:\n                if (albumId === 'Blind and Battered [Explicit]') {\n                     const albumTracks = [\n                        '01 - Intro.mp3',\n                        '02 - Blind and Battered.mp3',\n                        '03 - City Lights.mp3',\n                        '04 - The Comeback.mp3',\n                        '05 - Lost and Found.mp3',\n                        '06 - Redemption Song.mp3',\n                        '07 - Street Life.mp3',\n                        '08 - Hard Times.mp3',\n                        '09 - New Beginnings.mp3',\n                        '10 - Outro.mp3'\n                    ];\n                    if (albumTracks.includes(itemId)) {\n                        return res.json({ purchased: true });\n                    }\n                }\n            }\n        }\n    }\n    return res.json({ purchased: false });\n});\n\n// Endpoint to get all purchases for a user (for enabling downloads/full playback on return)\napp.get('/user-purchases/:userId', (req, res) => {\n    const { userId } = req.params;\n    const purchases = readPurchases();\n    if (purchases[userId]) {\n        res.json(purchases[userId]);\n    } else {\n        res.json({ purchasedTracks: [], purchasedAlbums: [] });\n    }\n});\n\n// Generate or retrieve a unique user ID\napp.get('/get-user-id', (req, res) => {\n    // In a real app, you might use session cookies or a more robust user identification system.\n    // For this example, we'll use a simple approach.\n    // We can't reliably use localStorage on the server side for this, \n    // so the client will generate/retrieve and send it.\n    // This endpoint is more of a placeholder for future user auth integration.\n    res.json({ userId: uuidv4() }); // For now, always generate a new one for demonstration\n});\n\n\n// Serve index.html for the root path\napp.get('/', (req, res) => {\n    res.sendFile(path.join(__dirname, 'deploy-clean', 'index.html'));\n});\n\napp.listen(PORT, () => {\n    console.log(`Server running on http://localhost:${PORT}`);\n    // Initialize purchases.json if it doesn't exist\n    if (!fs.existsSync(purchasesDBPath)) {\n        writePurchases({});\n        console.log('Initialized empty purchases.json');\n    }\n});\n
