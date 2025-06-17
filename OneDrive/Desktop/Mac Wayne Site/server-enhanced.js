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
        return_url: `${SITE_URL}/payment-success?userId=${userId}&itemType=${itemType}&itemId=${itemId}`,
        cancel_url: `${SITE_URL}/payment-cancelled`
      },
      transactions: [{
        item_list: {
          items: [{
            name: itemName,
            sku: itemId,
            price: amount,
            currency: currency,
            quantity: 1
          }]
        },
        amount: {
          currency: currency,
          total: amount
        },
        description: `Purchase of ${itemName} by Mac Wayne`,
        custom: JSON.stringify({ userId, itemType, itemId, userEmail })
      }]
    };

    const response = await axios.post(`${PAYPAL_API_BASE}/v1/payments/payment`, payment, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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

    const response = await axios.post(`${PAYPAL_API_BASE}/v1/payments/payment/${paymentId}/execute`, execution, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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

// Record purchase in database
async function recordPurchase(userId, itemType, itemId, paymentData) {
  const purchases = readPurchases();
  
  if (!purchases[userId]) {
    purchases[userId] = { 
      purchasedTracks: [], 
      purchasedAlbums: [],
      purchaseHistory: []
    };
  }

  const purchaseRecord = {
    id: uuidv4(),
    paymentId: paymentData.id,
    itemType,
    itemId,
    amount: paymentData.transactions[0].amount.total,
    currency: paymentData.transactions[0].amount.currency,
    timestamp: new Date().toISOString(),
    paypalData: paymentData
  };

  purchases[userId].purchaseHistory.push(purchaseRecord);

  if (itemType === 'track' && !purchases[userId].purchasedTracks.includes(itemId)) {
    purchases[userId].purchasedTracks.push(itemId);
  } else if (itemType === 'album' && !purchases[userId].purchasedAlbums.includes(itemId)) {
    purchases[userId].purchasedAlbums.push(itemId);
    
    // Unlock all tracks in the album
    const albumTracks = ALBUM_CONFIG[itemId]?.tracks || [];
    albumTracks.forEach(track => {
      if (!purchases[userId].purchasedTracks.includes(track)) {
        purchases[userId].purchasedTracks.push(track);
      }
    });
  }

  writePurchases(purchases);
  console.log('Purchase recorded for user:', userId, 'Item:', itemId);
  
  // Send download links via email if email provided
  const customData = JSON.parse(paymentData.transactions[0].custom || '{}');
  if (customData.userEmail) {
    await sendDownloadEmail(customData.userEmail, userId, itemType, itemId, purchaseRecord.id);
  }
}

// Send download email
async function sendDownloadEmail(email, userId, itemType, itemId, purchaseId) {
  try {
    const downloadUrl = `${SITE_URL}/download/${userId}/${purchaseId}`;
    
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: `Your Mac Wayne Music Download - ${itemType === 'album' ? 'Album' : 'Track'}: ${itemId}`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your download is ready:</p>
        <p><strong>Item:</strong> ${itemId}</p>
        <p><strong>Type:</strong> ${itemType === 'album' ? 'Full Album' : 'Single Track'}</p>
        <p><a href="${downloadUrl}" style="background-color: #0070ba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Your Music</a></p>
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
    const audioDir = path.join(__dirname, 'deploy-clean', 'public', 'audio', 'Blind and Battered [Explicit]');

    if (itemType === 'track') {
      // Download single track
      const trackPath = path.join(audioDir, itemId);
      if (fs.existsSync(trackPath)) {
        res.download(trackPath, itemId);
      } else {
        res.status(404).json({ error: 'Track file not found' });
      }
    } else if (itemType === 'album') {
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
    res.json({ purchasedTracks: [], purchasedAlbums: [], purchaseHistory: [] });
  }
});

// Payment success page
app.get('/payment-success', async (req, res) => {
  const { paymentId, PayerID, userId, itemType, itemId } = req.query;
  
  if (paymentId && PayerID) {
    try {
      // Execute the payment
      await axios.post(`${SITE_URL}/execute-payment`, {
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
              // Notify parent window and close after delay
              if (window.opener) {
                window.opener.postMessage({ type: 'PAYMENT_SUCCESS', userId: '${userId}', itemType: '${itemType}', itemId: '${itemId}' }, '*');
                setTimeout(() => window.close(), 3000);
              }
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Payment execution error:', error);
      res.send(`
        <html>
          <head><title>Payment Error</title></head>
          <body>
            <h1>Payment Error</h1>
            <p>There was an issue processing your payment. Please contact support.</p>
            <p><a href="/">Return to Mac Wayne Official</a></p>
          </body>
        </html>
      `);
    }
  } else {
    res.redirect('/');
  }
});

// Payment cancelled page
app.get('/payment-cancelled', (req, res) => {
  res.send(`
    <html>
      <head><title>Payment Cancelled</title></head>
      <body>
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. No charges were made.</p>
        <p><a href="/">Return to Mac Wayne Official</a></p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'PAYMENT_CANCELLED' }, '*');
            setTimeout(() => window.close(), 3000);
          }
        </script>
      </body>
    </html>
  `);
});

// Show notification signup endpoint
app.post('/signup-show-notifications', async (req, res) => {
  try {
    const signupData = req.body;
    
    // Validate required fields
    if (!signupData.name || !signupData.email || !signupData.showType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // In a real implementation, you would:
    // 1. Store in a database
    // 2. Add to email marketing list
    // 3. Send confirmation email
    
    console.log('Show notification signup received:', {
      name: signupData.name,
      email: signupData.email,
      showType: signupData.showType,
      city: signupData.city,
      preferences: {
        earlyAccess: signupData.earlyAccess,
        backstageUpdates: signupData.backstageUpdates,
        streamingAlerts: signupData.streamingAlerts
      },
      timestamp: signupData.timestamp
    });
    
    // Store in a simple JSON file for now
    const showSignupsPath = path.join(__dirname, 'show-signups.json');
    let signups = [];
    
    try {
      if (fs.existsSync(showSignupsPath)) {
        const data = fs.readFileSync(showSignupsPath);
        signups = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading show signups:', error);
    }
    
    signups.push({
      id: uuidv4(),
      ...signupData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    try {
      fs.writeFileSync(showSignupsPath, JSON.stringify(signups, null, 2));
    } catch (error) {
      console.error('Error writing show signups:', error);
    }
    
    // Send confirmation email (optional)
    if (emailTransporter && signupData.email) {
      const mailOptions = {
        from: EMAIL_USER,
        to: signupData.email,
        subject: 'Mac Wayne - Show Notifications Confirmed!',
        html: `
          <h2>You're All Set for Mac Wayne Show Notifications!</h2>
          <p>Hi ${signupData.name},</p>
          <p>Thank you for signing up to receive notifications about Mac Wayne's upcoming shows!</p>
          
          <h3>Your Preferences:</h3>
          <ul>
            <li><strong>Show Type:</strong> ${signupData.showType}</li>
            ${signupData.city ? `<li><strong>City:</strong> ${signupData.city}</li>` : ''}
            ${signupData.earlyAccess ? '<li>✓ Early access to tickets</li>' : ''}
            ${signupData.backstageUpdates ? '<li>✓ Behind-the-scenes updates</li>' : ''}
            ${signupData.streamingAlerts ? '<li>✓ Live streaming notifications</li>' : ''}
          </ul>
          
          <p>We'll notify you as soon as Mac Wayne announces his comeback tour and streaming events!</p>
          
          <p>Stay tuned and keep supporting great music!</p>
          
          <hr>
          <p><small>Mac Wayne Official - macwayneofficial.com</small></p>
        `
      };
      
      try {
        await emailTransporter.sendMail(mailOptions);
        console.log('Show notification confirmation email sent to:', signupData.email);
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Show notification signup successful!',
      id: signups[signups.length - 1].id
    });
    
  } catch (error) {
    console.error('Error processing show notification signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'deploy-clean', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`PayPal Mode: ${PAYPAL_SANDBOX_MODE ? 'SANDBOX' : 'PRODUCTION'}`);
  
  // Initialize purchases.json if it doesn't exist
  if (!fs.existsSync(purchasesDBPath)) {
    writePurchases({});
    console.log('Initialized empty purchases.json');
  }
});
