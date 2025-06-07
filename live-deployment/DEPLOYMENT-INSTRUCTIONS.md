# Mac Wayne Battered Coin - Live Deployment Instructions

## 🚀 Production Deployment Guide

This document provides comprehensive instructions for deploying the Mac Wayne Battered Coin cryptocurrency system to a live production environment.

---

## ⚡ Quick Start

1. **Run the automated deployment script:**
   ```powershell
   .\deploy-live.ps1 -Domain "yourdomain.com" -Environment "production"
   ```

2. **Upload the `live-deployment/` folder to your web server**

3. **Configure your server (Apache/IIS/Nginx) using provided config files**

4. **Update production API keys and smart contract addresses**

5. **Run deployment verification tests**

---

## 📋 Pre-Deployment Checklist

### Domain & Hosting Requirements
- [ ] Domain name registered and DNS configured
- [ ] SSL certificate obtained (Let's Encrypt, Cloudflare, or commercial)
- [ ] Web hosting with HTTPS support
- [ ] CDN configured (optional but recommended)

### API Keys & Services
- [ ] Infura Project ID for Ethereum access
- [ ] Alchemy API key (backup provider)
- [ ] WalletConnect Project ID
- [ ] Google Analytics 4 Tracking ID
- [ ] Smart contract addresses deployed to mainnet

### Performance Requirements
- [ ] Minimum 2GB RAM
- [ ] 10GB+ storage space
- [ ] Modern web server (Apache 2.4+, Nginx 1.18+, IIS 10+)
- [ ] PHP 8+ (if using PHP backend)
- [ ] Node.js 18+ (if using Node.js backend)

---

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Production Build

1. **Run the deployment script:**
   ```powershell
   cd "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official"
   .\deploy-live.ps1 -Domain "macwayneofficial.com"
   ```

2. **The script will create a `live-deployment/` directory with:**
   - Optimized and minified assets
   - Production configuration files
   - Server configuration templates
   - Deployment verification tools

### Step 2: Configure Production Settings

1. **Edit `live-deployment/js/production-config.js`:**
   ```javascript
   // Update with your real values
   walletConnectProjectId: 'YOUR_REAL_PROJECT_ID',
   contracts: {
       macWayneCoin: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS',
       // ... other contracts
   },
   services: {
       infura: {
           projectId: 'YOUR_INFURA_PROJECT_ID',
           projectSecret: 'YOUR_INFURA_SECRET'
       },
       // ... other services
   }
   ```

2. **Update analytics tracking:**
   ```javascript
   analytics: {
       googleAnalytics: {
           trackingId: 'G-XXXXXXXXXX', // Your GA4 ID
           gtmId: 'GTM-XXXXXXX'       // Your GTM ID
       }
   }
   ```

### Step 3: Server Configuration

#### For Apache Hosting:
1. Upload `.htaccess` file to your web root
2. Ensure mod_rewrite, mod_headers, and mod_deflate are enabled
3. Verify SSL certificate is installed

#### For IIS Hosting:
1. Upload `web.config` file to your web root
2. Install URL Rewrite module if not present
3. Configure SSL bindings in IIS Manager

#### For Nginx Hosting:
1. Copy `nginx.conf` settings to your server configuration
2. Update SSL certificate paths
3. Reload Nginx configuration: `sudo nginx -s reload`

### Step 4: Upload Files

1. **Upload the entire `live-deployment/` directory contents to your web server**

2. **Set proper file permissions:**
   ```bash
   # Linux/Unix
   chmod 644 *.html *.css *.js *.json
   chmod 755 directories/
   ```

3. **Verify file structure:**
   ```
   /var/www/html/ (or your web root)
   ├── index.html
   ├── js/
   │   ├── production-config.js
   │   └── [other JS files]
   ├── css/
   ├── assets/
   ├── verify-deployment.html
   └── [server config files]
   ```

### Step 5: DNS Configuration

1. **Configure A/AAAA records:**
   ```
   @ (root domain) → Your server IP
   www → Your server IP
   api → API server IP (if separate)
   ```

2. **Optional CNAME records:**
   ```
   cdn → Your CDN provider
   ws → WebSocket server (if separate)
   ```

### Step 6: SSL Certificate Setup

#### Option A: Let's Encrypt (Free)
```bash
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

#### Option B: Cloudflare (Free with account)
1. Sign up for Cloudflare
2. Add your domain
3. Update nameservers
4. Enable "Always Use HTTPS"

#### Option C: Commercial Certificate
1. Purchase SSL certificate
2. Install on your server
3. Configure server to use the certificate

---

## 🧪 Deployment Verification

### Automated Testing

1. **Open the verification page:**
   ```
   https://yourdomain.com/verify-deployment.html
   ```

2. **Run all tests:**
   - Click "🧪 Run All Tests"
   - Wait for all tests to complete
   - Review any failed tests

3. **Export report:**
   - Click "📊 Export Report"
   - Save the JSON report for your records

### Manual Testing Checklist

- [ ] **SSL/HTTPS:** Site loads with valid SSL certificate
- [ ] **Performance:** Page loads in under 3 seconds
- [ ] **Mobile:** Site works on mobile devices
- [ ] **Cryptocurrency:** Wallet connection works
- [ ] **Navigation:** All pages and links work correctly
- [ ] **Forms:** Contact forms submit successfully
- [ ] **Analytics:** Google Analytics tracking active

### Performance Benchmarks

**Target Metrics:**
- Page Load Time: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Largest Contentful Paint: < 2.5 seconds
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
- Lighthouse Score: > 90

**Tools for Testing:**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Chrome DevTools Lighthouse

---

## 🔒 Security Configuration

### Required Security Headers

```apache
# Apache (.htaccess)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
```

### Content Security Policy

```
Content-Security-Policy: default-src 'self'; 
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; 
img-src 'self' data: https:; 
connect-src 'self' https://api.yourdomain.com wss://ws.yourdomain.com https:;
```

### Additional Security Measures

- [ ] Enable firewall rules
- [ ] Configure fail2ban (Linux)
- [ ] Set up regular security updates
- [ ] Monitor error logs
- [ ] Implement rate limiting
- [ ] Use secure passwords
- [ ] Enable two-factor authentication

---

## 📊 Monitoring & Analytics

### Google Analytics 4 Setup

1. **Create GA4 property**
2. **Add tracking code to production-config.js**
3. **Set up conversion goals**
4. **Configure eCommerce tracking**

### Error Monitoring

1. **Set up Sentry for error tracking:**
   ```javascript
   errorTracking: {
       sentryDsn: 'https://YOUR_SENTRY_DSN@sentry.io/PROJECT_ID'
   }
   ```

2. **Monitor server logs:**
   - Apache: `/var/log/apache2/access.log`
   - Nginx: `/var/log/nginx/access.log`
   - IIS: Event Viewer

### Performance Monitoring

1. **Core Web Vitals tracking**
2. **Real User Monitoring (RUM)**
3. **Server resource monitoring**
4. **Database performance (if applicable)**

---

## 🚦 Go-Live Checklist

### Final Pre-Launch

- [ ] All tests passing in verify-deployment.html
- [ ] SSL certificate valid and properly configured
- [ ] DNS propagation complete (24-48 hours)
- [ ] Analytics tracking confirmed working
- [ ] Error monitoring active
- [ ] Backup systems in place
- [ ] Team notification systems ready

### Launch Day

- [ ] Monitor server resources
- [ ] Watch error logs in real-time
- [ ] Check site functionality every hour
- [ ] Monitor analytics for traffic
- [ ] Respond to any user reports
- [ ] Document any issues for post-launch review

### Post-Launch (24 hours)

- [ ] Review analytics data
- [ ] Check Core Web Vitals scores
- [ ] Monitor server performance
- [ ] Review error logs
- [ ] Test all cryptocurrency features
- [ ] Gather user feedback
- [ ] Plan any immediate fixes

---

## 🆘 Troubleshooting

### Common Issues

**Site Not Loading:**
1. Check DNS propagation
2. Verify server is running
3. Check SSL certificate
4. Review server error logs

**SSL Errors:**
1. Verify certificate installation
2. Check certificate expiration
3. Ensure all resources load via HTTPS
4. Test with multiple browsers

**Performance Issues:**
1. Enable compression
2. Optimize images
3. Use CDN
4. Check server resources

**Cryptocurrency Features Not Working:**
1. Verify API keys are correct
2. Check smart contract addresses
3. Test with different wallets
4. Review browser console errors

### Support Resources

- **Technical Support:** Contact your hosting provider
- **SSL Issues:** Certificate authority support
- **DNS Problems:** Domain registrar support
- **Performance:** Use Google PageSpeed Insights
- **Security:** OWASP security guidelines

---

## 📞 Emergency Contacts

### Critical Issues Escalation
1. **Server Down:** Contact hosting provider immediately
2. **Security Breach:** Disable site, contact security team
3. **SSL Expired:** Renew certificate ASAP
4. **Database Issues:** Contact database administrator

### Monitoring Alerts
- Set up email alerts for server downtime
- Configure SMS notifications for critical errors
- Monitor cryptocurrency transaction failures
- Track unusual traffic patterns

---

## 🎯 Success Metrics

### Launch Success Indicators
- [ ] Site loads in under 3 seconds
- [ ] All functionality tests pass
- [ ] No critical errors in logs
- [ ] Analytics tracking confirmed
- [ ] User registrations working
- [ ] Cryptocurrency features operational

### 30-Day Goals
- [ ] 99.9% uptime achieved
- [ ] Page speed scores > 90
- [ ] Zero security incidents
- [ ] User engagement metrics positive
- [ ] Cryptocurrency transaction volume growing

---

**🎉 Congratulations on your successful deployment of Mac Wayne Battered Coin!**

For ongoing support and updates, monitor the production environment and keep all systems updated with the latest security patches and feature improvements.
