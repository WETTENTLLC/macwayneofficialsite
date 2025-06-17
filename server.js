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
}

// Simulate PayPal IPN listener
app.post('/paypal-ipn', (req, res) => {
    console.log('Received PayPal IPN:', req.body);

    // IMPORTANT: In a real application, you MUST verify the IPN message with PayPal
    // to ensure it's a genuine notification from PayPal and not a spoofed request.
    // This involves sending the received data back to PayPal for validation.
    // See PayPal IPN documentation for details: 
    // https://developer.paypal.com/api/nvp-soap/ipn/IPNImplementation/

    const paymentStatus = req.body.payment_status;
    const customData = req.body.custom ? JSON.parse(req.body.custom) : null;

    if (paymentStatus === 'Completed' && customData) {
        const { userId, itemId, itemType, itemName, amount, currency } = customData;
        console.log(`Payment completed for ${itemType}: ${itemName} by user ${userId}`);

        const purchases = readPurchases();
        if (!purchases[userId]) {
            purchases[userId] = { purchasedTracks: [], purchasedAlbums: [] };
        }

        if (itemType === 'track' && !purchases[userId].purchasedTracks.includes(itemId)) {
            purchases[userId].purchasedTracks.push(itemId);
        } else if (itemType === 'album' && !purchases[userId].purchasedAlbums.includes(itemId)) {
            purchases[userId].purchasedAlbums.push(itemId);
            // If an album is purchased, unlock all its tracks (assuming a predefined tracklist for the album)
            // This part needs to be adapted based on how your album tracks are identified.
            // For now, we'll assume 'Blind and Battered [Explicit]' is the only album.
            if (itemId === 'Blind and Battered [Explicit]') {
                const albumTracks = [
                    '01 - Intro.mp3',
                    '02 - Blind and Battered.mp3',
                    '03 - City Lights.mp3',
                    '04 - The Comeback.mp3',
                    '05 - Lost and Found.mp3',
                    '06 - Redemption Song.mp3',
                    '07 - Street Life.mp3',
                    '08 - Hard Times.mp3',
                    '09 - New Beginnings.mp3',
                    '10 - Outro.mp3'
                ];
                albumTracks.forEach(track => {
                    if (!purchases[userId].purchasedTracks.includes(track)) {
                        purchases[userId].purchasedTracks.push(track);
                    }
                });
            }
        }
        writePurchases(purchases);
        console.log('Purchase recorded for user:', userId, 'Item:', itemId);
    } else {
        console.log('Payment not completed or custom data missing. Status:', paymentStatus);
    }

    res.status(200).send('IPN Handled');
});

// Endpoint to check purchase status
app.get('/check-purchase/:userId/:itemType/:itemId', (req, res) => {
    const { userId, itemType, itemId } = req.params;
    const purchases = readPurchases();

    if (purchases[userId]) {
        if (itemType === 'track' && purchases[userId].purchasedTracks.includes(itemId)) {
            return res.json({ purchased: true });
        }
        if (itemType === 'album' && purchases[userId].purchasedAlbums.includes(itemId)) {
            return res.json({ purchased: true });
        }
        // Check if the track is part of a purchased album
        if (itemType === 'track') {
            for (const albumId of purchases[userId].purchasedAlbums) {
                // This logic assumes you have a way to map albumId to its tracks
                // For 'Blind and Battered [Explicit]' album:
                if (albumId === 'Blind and Battered [Explicit]') {
                     const albumTracks = [
                        '01 - Intro.mp3',
                        '02 - Blind and Battered.mp3',
                        '03 - City Lights.mp3',
                        '04 - The Comeback.mp3',
                        '05 - Lost and Found.mp3',
                        '06 - Redemption Song.mp3',
                        '07 - Street Life.mp3',
                        '08 - Hard Times.mp3',
                        '09 - New Beginnings.mp3',
                        '10 - Outro.mp3'
                    ];
                    if (albumTracks.includes(itemId)) {
                        return res.json({ purchased: true });
                    }
                }
            }
        }
    }
    return res.json({ purchased: false });
});

// Endpoint to get all purchases for a user (for enabling downloads/full playback on return)
app.get('/user-purchases/:userId', (req, res) => {
    const { userId } = req.params;
    const purchases = readPurchases();
    if (purchases[userId]) {
        res.json(purchases[userId]);
    } else {
        res.json({ purchasedTracks: [], purchasedAlbums: [] });
    }
});

// Generate or retrieve a unique user ID
app.get('/get-user-id', (req, res) => {
    // In a real app, you might use session cookies or a more robust user identification system.
    // For this example, we'll use a simple approach.
    // We can't reliably use localStorage on the server side for this, 
    // so the client will generate/retrieve and send it.
    // This endpoint is more of a placeholder for future user auth integration.
    res.json({ userId: uuidv4() }); // For now, always generate a new one for demonstration
});


// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-clean', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Initialize purchases.json if it doesn't exist
    if (!fs.existsSync(purchasesDBPath)) {
        writePurchases({});
        console.log('Initialized empty purchases.json');
    }
});
