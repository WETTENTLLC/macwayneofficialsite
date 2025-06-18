# Mac Wayne Official - Email Delivery System Setup

## Overview
The Mac Wayne website includes an automated email delivery system that sends download links to customers after successful PayPal purchases.

## Current Status
- ✅ PayPal modal now centers properly in the viewport
- ✅ Frontend PayPal integration is working
- ✅ Server-side email delivery system is implemented
- ⚠️ Email delivery requires server to be running

## How Email Delivery Works

### When Server is Running:
1. User completes PayPal payment
2. Frontend calls backend server at `/webhook/paypal`
3. Server processes payment and stores purchase record
4. Server automatically sends download email with links
5. User receives email with download instructions

### When Server is Not Running:
1. User completes PayPal payment
2. Frontend stores purchase locally
3. Shows mock email notification to user
4. User needs to contact support for download links

## Setting Up the Email Server

### Prerequisites
- Node.js installed
- Gmail account with App Password (recommended)

### Installation Steps

1. **Install server dependencies:**
   ```bash
   cd "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site"
   npm install express body-parser uuid nodemailer archiver axios
   ```

2. **Configure email credentials:**
   Create a `.env` file in the project root:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PAYPAL_CLIENT_ID=your-paypal-client-id
   PAYPAL_CLIENT_SECRET=your-paypal-client-secret
   PAYPAL_SANDBOX_MODE=false
   SITE_URL=https://macwayneofficial.com
   ```

3. **Run the server:**
   ```bash
   node server-enhanced.js
   ```
   Server will start on port 3000 (http://localhost:3000)

### Gmail App Password Setup
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this App Password in the EMAIL_PASS environment variable

## Files Updated
- `js/macwayne-audio-player.js` - Added email delivery integration
- PayPal modal now centers properly in viewport
- Added server communication for purchase processing

## Testing
1. Test PayPal payment flow on the live site
2. Modal should appear centered in viewport
3. After payment, check if email delivery works:
   - If server running: Automatic email sent
   - If server not running: Mock notification shown

## Production Deployment
For production use, deploy the server on a hosting platform like:
- Heroku
- Digital Ocean
- AWS
- Netlify Functions (serverless)

Set the same environment variables in your hosting platform.

## Support
If customers don't receive download emails:
1. Check if server is running
2. Verify email configuration
3. Check spam/junk folders
4. Manually send download links from purchase records

## Next Steps
- Deploy server to production hosting
- Set up proper email templates
- Add download analytics
- Implement download link expiration (currently 30 days)
