# Mac Wayne Official Site - Production Setup Guide

## 🎵 Complete PayPal Integration & Download System

Your Mac Wayne audio player is now ready for production with real PayPal payments, email delivery, and secure downloads!

## 🚀 Quick Start

1. **Run the deployment setup:**
   ```powershell
   .\deploy-production-setup.ps1
   ```

2. **Configure your environment variables** (see sections below)

3. **Start the server:**
   ```powershell
   npm start
   ```

## 🔐 PayPal Configuration

### Step 1: Create PayPal Developer Account
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign in or create an account
3. Navigate to "My Apps & Credentials"
4. Click "Create App"

### Step 2: Get Your Credentials
- **App Name:** Mac Wayne Official Music Store
- **Merchant:** Your business account
- **Features:** Standard Payments
- **Return URLs:** `http://localhost:3000/payment-success` (for testing)

### Step 3: Copy Your Credentials
- **Client ID:** Found in your app dashboard
- **Client Secret:** Found in your app dashboard (click "Show")

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Mac Wayne Site"
   - Copy the 16-character password

## 🔧 Environment Variables

Create a `.env` file in your root directory:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_actual_client_id_here
PAYPAL_CLIENT_SECRET=your_actual_client_secret_here
PAYPAL_SANDBOX_MODE=true

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Site Configuration
SITE_URL=http://localhost:3000
PORT=3000
```

### For Production Deployment:
```env
PAYPAL_SANDBOX_MODE=false
SITE_URL=https://macwayneofficial.com
```

## 🎼 Audio File Requirements

### Full Tracks
Located in: `deploy-clean/public/audio/Blind and Battered [Explicit]/`
- All 20 tracks must be present
- High quality MP3 format recommended

### Sample Tracks (30-second previews)
Located in: `deploy-clean/public/audio/Blind and Battered [Explicit]/samples/`
- Named: `01-sample.mp3`, `02-sample.mp3`, etc.
- Exactly 30 seconds each
- Use `.\create-samples.ps1` to auto-generate

## 💳 Payment Flow

### Customer Experience:
1. **Browse tracks** → 30-second previews play automatically
2. **Click "Buy Track ($2.00)"** → PayPal window opens
3. **Complete payment** → Track unlocks immediately
4. **Receive email** → Download link delivered
5. **Download anytime** → Links valid for 30 days

### Album Purchase:
1. **Click "Buy Album ($25.00)"** → PayPal window opens
2. **Complete payment** → All tracks unlock
3. **Download options** → Individual tracks or full ZIP
4. **Email delivery** → All download links included

## 🔒 Security Features

- **PayPal verification** → All payments verified through PayPal API
- **Secure downloads** → Time-limited, user-specific links
- **Purchase persistence** → Tied to unique user IDs
- **Email validation** → Download links sent securely

## 📱 Mobile Compatibility

- **Responsive design** → Works on all devices
- **Touch controls** → Optimized for mobile
- **PayPal mobile** → Seamless mobile payments

## 🧪 Testing

### Test Mode (Sandbox):
1. Keep `PAYPAL_SANDBOX_MODE=true`
2. Use PayPal sandbox accounts
3. No real money charged
4. Full functionality testing

### Production Mode:
1. Set `PAYPAL_SANDBOX_MODE=false`
2. Use real PayPal account
3. Real payments processed
4. Live email delivery

## 🐛 Troubleshooting

### Common Issues:

**PayPal payments not working:**
- Check Client ID and Secret
- Verify sandbox/production mode
- Check browser console for errors

**Email not sending:**
- Verify Gmail app password
- Check EMAIL_USER and EMAIL_PASS
- Ensure 2FA is enabled

**Downloads not working:**
- Check file paths
- Verify purchase records
- Check server permissions

**Audio not playing:**
- Verify sample files exist
- Check browser console
- Ensure server is running

### Debug Mode:
Open browser console to see detailed logging from the audio player.

## 📊 Analytics & Monitoring

The system logs:
- Purchase attempts
- Successful payments
- Download requests
- Email deliveries
- Playback events

## 🚢 Deployment Options

### Local Development:
```bash
npm start
# Runs on http://localhost:3000
```

### Production Hosting:
- **Heroku:** Add environment variables in dashboard
- **Digital Ocean:** Use PM2 for process management
- **AWS:** Configure environment variables in Elastic Beanstalk
- **Netlify/Vercel:** For static files + serverless functions

## 🎯 Features Included

✅ **Real PayPal Integration**
- Secure payment processing
- Automatic verification
- Sandbox and production modes

✅ **Download System**
- Individual track downloads
- Full album ZIP downloads
- Email delivery of links
- 30-day link expiration

✅ **Audio Player**
- 30-second previews
- Full playback after purchase
- Progress tracking
- Volume controls

✅ **Purchase Management**
- Persistent purchases
- User session tracking
- Purchase history
- Download tracking

✅ **Email Integration**
- Automatic email delivery
- Professional templates
- Download instructions
- Purchase confirmations

✅ **Mobile Support**
- Responsive design
- Touch controls
- Mobile payments
- Mobile downloads

## 🎵 Ready to Launch!

Your Mac Wayne Official site now has a complete, professional music sales platform with:
- Real payment processing
- Secure downloads
- Email delivery
- Mobile support
- Purchase tracking

Just configure your PayPal and email credentials, and you're ready to start selling music!
