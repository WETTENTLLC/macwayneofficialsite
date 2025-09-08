// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import archiver from 'archiver';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      "19 - Do the I'm the Shit [Explicit].mp3",
      '20 - Hatin On a Blind Man [Explicit].mp3'
    ]
  }
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve all files in the root directory (css, js, public, etc.)
// This makes it easy to run locally without a separate build step.
app.use(express.static(__dirname));

// === CORS HEADERS FOR ALL ROUTES ===
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const purchasesDBPath = path.join(__dirname, 'purchases.json');

// Email transporter setup
const emailTransporter = nodemailer.createTransport({
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

// Create PayPal payment
app.post('/create-payment', async (req, res) => {
  try {
    const { itemType, itemId, itemName, amount, currency, userId, userEmail } = req.body;
    
    if (!itemType || !itemId || !amount || !userId) {
      return res.status(400).json({ error: 'Missing required payment parameters' });
    }

    const accessToken = await getPayPalAccessToken();
    
    const payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `/payment-success?userId=&itemType=&itemId=`,
        cancel_url: `/payment-cancelled`
      },
      transactions: [{
        item_list: {
          items: [{
            name: itemName,
            sku: itemId,
            price: amount,
            currency: currency || 'USD',
            quantity: 1
          }]
        },
        amount: {
          currency: currency || 'USD',
          total: amount
        },
        description: `Purchase of  by Mac Wayne`,
        custom: JSON.stringify({ userId, itemType, itemId, userEmail })
      }]
    };

    const response = await axios.post(`/v1/payments/payment`, payment, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `
      }
    });

    const approvalUrl = response.data.links.find(link => link.rel === 'approval_url').href;
    res.json({ approvalUrl, paymentId: response.data.id });

  } catch (error) {
    console.error('Error creating PayPal payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Execute PayPal payment
app.post('/execute-payment', async (req, res) => {
  try {
    const { paymentId, PayerID, userId, itemType, itemId } = req.body;
    
    const accessToken = await getPayPalAccessToken();
    
    const execution = {
      payer_id: PayerID
    };

    const response = await axios.post(`/v1/payments/payment//execute`, execution, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer `
      }
    });

    if (response.data.state === 'approved') {
      // Record the purchase
      await recordPurchase(userId, itemType, itemId, response.data);
      res.json({ success: true, payment: response.data });
    } else {
      res.status(400).json({ error: 'Payment not approved' });
    }

  } catch (error) {
    console.error('Error executing PayPal payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to execute payment' });
  }
});
// Record payment from PayPal JS SDK
app.post('/record-payment', async (req, res) => {
  try {
    const { userId, itemType, itemId, paymentData } = req.body;
    if (!userId || !itemType || !itemId || !paymentData) {
      return res.status(400).json({ error: 'Missing required parameters for recording payment' });
    }

    // The payment is already approved and captured on the client by the SDK.
    // We just need to record it and send the confirmation email.
    await recordPurchase(userId, itemType, itemId, paymentData);

    res.json({ success: true, message: 'Purchase recorded successfully.' });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Record purchase in database
async function recordPurchase(userId, itemType, itemId, paymentData) {
  const purchases = readPurchases();
  
  if (!purchases[userId]) {
    purchases[userId] = { 
      downloadableTracks: [], 
      downloadableAlbums: [],
      streamableAlbums: [],
      purchaseHistory: []
    };
  }

  // Adapt to v2 Orders API (from JS SDK) or v1 Payments API (from redirect flow)
  // NOTE: The new player uses the v2 Orders API via the PayPal JS SDK.
  const isV2Order = paymentData.purchase_units && Array.isArray(paymentData.purchase_units);
  let amount, currency, customDataString;

  if (isV2Order) {
    const pu = paymentData.purchase_units[0];
    amount = pu.amount.value;
    currency = pu.amount.currency_code;
    customDataString = pu.custom_id; // This will be a JSON string from the client
  } else { // Assume v1 for backward compatibility with redirect flow
    const tx = paymentData.transactions[0];
    amount = tx.amount.total;
    currency = tx.amount.currency;
    customDataString = tx.custom; // This is also a JSON string from the redirect flow
  }

  const purchaseRecord = {
    id: uuidv4(),
    paymentId: paymentData.id,
    itemType, itemId, amount, currency,
    timestamp: new Date().toISOString(),
    paypalData: paymentData
  };

  purchases[userId].purchaseHistory.push(purchaseRecord);

  if (itemType === 'download-track' && !purchases[userId].downloadableTracks.includes(itemId)) {
    purchases[userId].downloadableTracks.push(itemId);
  } else if (itemType === 'download-album' && !purchases[userId].downloadableAlbums.includes(itemId)) {
    purchases[userId].downloadableAlbums.push(itemId);
    
    // Unlock all tracks in the album
    const albumTracks = ALBUM_CONFIG[itemId]?.tracks || [];
    albumTracks.forEach(track => {
      if (!purchases[userId].downloadableTracks.includes(track)) {
        purchases[userId].downloadableTracks.push(track);
      }
    });
  } else if (itemType === 'stream-album' && !purchases[userId].streamableAlbums.includes(itemId)) {
    purchases[userId].streamableAlbums.push(itemId);
  }

  writePurchases(purchases);
  console.log('Purchase recorded for user:', userId, 'Item:', itemId);
  
  // Send download links via email if email provided
  const customData = JSON.parse(customDataString || '{}');
  if (customData.userEmail) {
    await sendDownloadEmail(customData.userEmail, userId, itemType, itemId, purchaseRecord.id, amount, currency);
  }
}

// Send download email
async function sendDownloadEmail(email, userId, itemType, itemId, purchaseId, amount, currency) {
  // Only send download links for downloadable items
  if (!itemType.startsWith('download-')) {
    return;
  }

  try {
    const downloadUrl = `${SITE_URL}/download//`;
    const isAlbum = itemType === 'download-album';
    
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: `Your Mac Wayne Music Download - ${isAlbum ? 'Album' : 'Track'}: `,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your download is ready:</p>
        <p><strong>Item:</strong> </p>
        <p><strong>Type:</strong> ${isAlbum ? 'Full Album' : 'Single Track'}</p>
        <p><strong>Amount Paid:</strong>  </p>
        <p><a href="" style="background-color: #0070ba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Your Music</a></p>
        <p>This download link will be valid for 30 days.</p>
        <p>Thank you for supporting Mac Wayne!</p>
        <hr>
        <p><small>Mac Wayne Official - macwayneofficial.com</small></p>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    console.log('Download email sent to:', email);
  } catch (error) {
    console.error('Error sending download email:', error);
  }
}

// Download endpoint
app.get('/download/:userId/:purchaseId', async (req, res) => {
  try {
    const { userId, purchaseId } = req.params;
    const purchases = readPurchases();
    
    if (!purchases[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }

    const purchase = purchases[userId].purchaseHistory.find(p => p.id === purchaseId);
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Check if purchase is within 30 days
    const purchaseDate = new Date(purchase.timestamp);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (purchaseDate < thirtyDaysAgo) {
      return res.status(410).json({ error: 'Download link has expired' });
    }

    const { itemType, itemId } = purchase;
    const audioDir = path.join(__dirname, 'public', 'audio', 'Blind and Battered [Explicit]');

    if (itemType === 'download-track') {
      // Download single track
      const trackPath = path.join(audioDir, itemId);
      if (fs.existsSync(trackPath)) {
        res.download(trackPath, itemId);
      } else {
        res.status(404).json({ error: 'Track file not found' });
      }
    } else if (itemType === 'download-album') {
      // Create zip file for album download
      const zipName = `${itemId.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
      
      res.attachment(zipName);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      archive.on('error', (err) => {
        console.error('Archive error:', err);
        res.status(500).json({ error: 'Failed to create download archive' });
      });
      
      archive.pipe(res);
      
      const albumTracks = ALBUM_CONFIG[itemId]?.tracks || [];
      for (const track of albumTracks) {
        const trackPath = path.join(audioDir, track);
        if (fs.existsSync(trackPath)) {
          archive.file(trackPath, { name: track });
        }
      }
      
      archive.finalize();
    } else {
      return res.status(403).json({ error: 'This purchase is not downloadable.' });
    }

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Get user purchases
app.get('/user-purchases/:userId', (req, res) => {
  const { userId } = req.params;
  const purchases = readPurchases();
  if (purchases[userId]) {
    res.json(purchases[userId]);
  } else {
    res.json({ downloadableTracks: [], downloadableAlbums: [], streamableAlbums: [], purchaseHistory: [] });
  }
});

// Payment success page
app.get('/payment-success', async (req, res) => {
  const { paymentId, PayerID, userId, itemType, itemId } = req.query;
  
  if (paymentId && PayerID) {
    try {
      // Execute the payment by calling our own endpoint
      await axios.post(`/execute-payment`, {
        paymentId,
        PayerID,
        userId,
        itemType,
        itemId
      });
      
      res.send(`
        <html>
          <head><title>Payment Successful</title></head>
          <body>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your music has been unlocked!</p>
            <p><a href="/">Return to Mac Wayne Official</a></p>
            <script>
              // Use localStorage as a fallback to notify main window
              localStorage.setItem('paymentStatus', 'success');
              setTimeout(() => window.close(), 3000);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send('<h1>Payment Execution Failed</h1><p>There was an error processing your payment. Please contact support.</p>');
    }
  } else {
    res.status(400).send('<h1>Invalid Payment Information</h1><p>Missing payment details.</p>');
  }
});

// Payment cancelled page
app.get('/payment-cancelled', (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Cancelled</title></head>
      <body>
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. You have not been charged.</p>
        <p><a href="/">Return to Mac Wayne Official</a></p>
        <script>
          setTimeout(() => window.close(), 3000);
        </script>
      </body>
    </html>
  `);
});

// === AUDIO FILE INTEGRITY CHECK ===
function checkAudioFiles() {
  const audioDir = path.join(__dirname, 'public', 'audio', 'Blind and Battered [Explicit]');
  const album = ALBUM_CONFIG['Blind and Battered [Explicit]'];
  if (!album) {
    console.warn('No album config found for Blind and Battered [Explicit]');
    return;
  }
  album.tracks.forEach((trackFile, index) => {
    const fullPath = path.join(audioDir, trackFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`[MISSING FILE] Full track not found: `);
    }
    const sampleNumber = String(index + 1).padStart(2, '0');
    const samplePath = path.join(audioDir, 'samples', `-sample.mp3`);
    if (!fs.existsSync(samplePath)) {
      console.error(`[MISSING FILE] Sample track not found: `);
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:`);
  console.log(`PayPal Mode: ${PAYPAL_SANDBOX_MODE ? 'SANDBOX' : 'PRODUCTION'}`);
  // Initialize purchases.json if it doesn't exist
  if (!fs.existsSync(purchasesDBPath)) {
    writePurchases({});
  }
  checkAudioFiles();
});

