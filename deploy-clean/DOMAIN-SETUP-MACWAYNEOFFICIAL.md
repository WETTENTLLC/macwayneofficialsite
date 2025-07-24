# 🌐 MACWAYNEOFFICIAL.COM - CUSTOM DOMAIN SETUP GUIDE

## 📊 CURRENT DEPLOYMENT STATUS
✅ **Deployment Package:** Ready (live-deployment folder)  
✅ **Dependencies:** Installed (WalletConnect + all packages)  
✅ **Rewards System:** Ready (Sheriff Thizz system)  
✅ **API Configuration:** Infura key configured  
⏳ **WalletConnect ID:** Needs setup at cloud.reown.com  

**DEPLOYMENT READINESS: 95% COMPLETE**

---

## 🚀 DOMAIN DEPLOYMENT STEPS

### STEP 1: WEB HOSTING SETUP
Choose one of these hosting providers for macwayneofficial.com:

#### Option A: Shared Hosting (Recommended for beginners)
- **Bluehost, SiteGround, or Hostinger**
- Upload entire `live-deployment/` folder to public_html/
- Automatic SSL certificate included
- Cost: $3-10/month

#### Option B: VPS Hosting (More control)
- **DigitalOcean, Linode, or Vultr**
- Ubuntu server with Apache/Nginx
- Manual SSL setup required
- Cost: $5-20/month

#### Option C: CDN Hosting (Best performance)
- **Cloudflare Pages, Netlify, or Vercel**
- Git-based deployment
- Global CDN included
- Cost: Free tier available

---

### STEP 2: DOMAIN DNS CONFIGURATION

#### For Shared Hosting:
```
A Record: @ → Your hosting IP address
CNAME: www → macwayneofficial.com
```

#### For CDN Hosting:
```
CNAME: macwayneofficial.com → your-site.netlify.app
CNAME: www → your-site.netlify.app
```

#### DNS Propagation:
- **Time:** 24-48 hours for full propagation
- **Check:** Use dnschecker.org to verify

---

### STEP 3: SSL CERTIFICATE SETUP

#### Automatic SSL (Recommended):
Most modern hosts provide free SSL certificates automatically.

#### Manual SSL Setup:
```bash
# For Apache servers
sudo certbot --apache -d macwayneofficial.com -d www.macwayneofficial.com

# For Nginx servers
sudo certbot --nginx -d macwayneofficial.com -d www.macwayneofficial.com
```

#### SSL Verification:
- Visit: https://macwayneofficial.com
- Look for 🔒 lock icon in browser
- Certificate should be valid and trusted

---

### STEP 4: FILE UPLOAD PROCESS

#### Via FTP/SFTP:
```
Local: c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\live-deployment\
Remote: /public_html/ (or /var/www/html/)

Upload ALL files and folders:
✓ index.html
✓ battered-coin.html
✓ js/ folder (with production-config.js)
✓ css/ folder
✓ public/ folder
✓ node_modules/ folder
✓ .htaccess file
✓ All other files (110+ files total)
```

#### Via Git (if using CDN hosting):
```bash
git add live-deployment/*
git commit -m "Deploy Mac Wayne Battered Coin platform"
git push origin main
```

---

### STEP 5: DOMAIN-SPECIFIC CONFIGURATION

#### Update production-config.js:
```javascript
window.CRYPTO_CONFIG = {
    environment: 'production',
    apiBaseUrl: 'https://api.macwayneofficial.com/crypto/',
    domain: 'macwayneofficial.com',
    // ... rest of config
};
```

#### Update .htaccess for domain:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://macwayneofficial.com%{REQUEST_URI} [L,R=301]

# WWW redirect
RewriteCond %{HTTP_HOST} ^www\.macwayneofficial\.com [NC]
RewriteRule ^(.*)$ https://macwayneofficial.com/$1 [L,R=301]
```

---

### STEP 6: POST-DEPLOYMENT VERIFICATION

#### Test These URLs:
- ✅ https://macwayneofficial.com
- ✅ https://macwayneofficial.com/battered-coin.html
- ✅ https://www.macwayneofficial.com (should redirect)
- ✅ http://macwayneofficial.com (should redirect to HTTPS)

#### Test These Features:
- [ ] Page loads without errors
- [ ] Wallet connection button appears
- [ ] Crypto features accessible
- [ ] Mobile responsiveness works
- [ ] Screen reader compatibility
- [ ] All images and assets load

#### Run Verification Script:
```powershell
# After domain is live, test from local machine
Invoke-WebRequest -Uri "https://macwayneofficial.com" -Method GET
```

---

### STEP 7: WALLETCONNECT FINAL SETUP

#### Complete WalletConnect Configuration:
1. **Visit:** https://cloud.reown.com/
2. **Create Project:** "Mac Wayne Battered Coin"
3. **Add Domain:** macwayneofficial.com
4. **Get Project ID:** Copy the generated ID
5. **Update Config:** Replace `YOUR_WALLETCONNECT_PROJECT_ID` in production-config.js

#### Upload Updated Config:
After getting WalletConnect Project ID, re-upload:
- `live-deployment/js/production-config.js`

---

## 🔧 HOSTING-SPECIFIC INSTRUCTIONS

### For Bluehost/SiteGround:
1. Login to cPanel
2. File Manager → public_html
3. Upload live-deployment folder contents
4. SSL automatically enabled
5. Domain points to your account

### For Cloudflare Pages:
1. Connect GitHub repository
2. Build command: (none needed - static site)
3. Publish directory: live-deployment
4. Custom domain: macwayneofficial.com
5. SSL automatically enabled

### For Netlify:
1. Drag & drop live-deployment folder
2. Domain settings → Add custom domain
3. DNS settings → Configure external DNS
4. SSL automatically enabled

---

## 🚨 SECURITY CHECKLIST

### Before Going Live:
- [ ] All API keys properly configured
- [ ] HTTPS force-redirect enabled
- [ ] No development/debug code in production
- [ ] Content Security Policy headers set
- [ ] Error pages (404.html, 500.html) in place

### Security Headers (.htaccess):
```apache
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
```

---

## 📱 MOBILE & ACCESSIBILITY VERIFICATION

### Test On:
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Desktop Chrome/Firefox/Edge
- [ ] Screen readers (NVDA/JAWS)
- [ ] Keyboard navigation only
- [ ] High contrast mode

### Performance Check:
- **Google PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebAIM Accessibility:** https://wave.webaim.org/

---

## 🎯 GO-LIVE TIMELINE

### Immediate (0-2 hours):
1. Choose hosting provider
2. Purchase/configure domain
3. Upload deployment package

### Within 24 hours:
1. DNS propagation complete
2. SSL certificate active
3. Domain fully accessible

### Within 48 hours:
1. Complete WalletConnect setup
2. Final testing and verification
3. Public announcement ready

---

## 🔍 TROUBLESHOOTING

### Common Issues:

#### "Site Not Found" Error:
- Check DNS propagation: dnschecker.org
- Verify hosting account is active
- Confirm files uploaded to correct directory

#### SSL Certificate Issues:
- Wait 24 hours for auto-SSL
- Contact hosting support
- Use Let's Encrypt if manual setup needed

#### WalletConnect Not Working:
- Verify Project ID in production-config.js
- Check domain whitelist in Reown dashboard
- Ensure HTTPS is working properly

### Support Contacts:
- **Hosting Issues:** Contact your hosting provider
- **Domain Issues:** Contact your domain registrar
- **WalletConnect Issues:** Check Reown documentation

---

## 📈 POST-LAUNCH MONITORING

### Analytics Setup:
- Google Analytics for traffic monitoring
- Search Console for SEO tracking
- Uptime monitoring service

### Regular Maintenance:
- Monthly security updates
- SSL certificate renewal (if manual)
- Performance optimization
- Content updates

---

## 🎉 LAUNCH ANNOUNCEMENT

### When Everything is Working:
1. **Test all features thoroughly**
2. **Verify accessibility compliance**
3. **Confirm crypto wallet integration**
4. **Announce on social media**
5. **Celebrate the launch!** 🚀

---

**Your Mac Wayne Battered Coin accessibility-first cryptocurrency platform is ready for macwayneofficial.com!**

*Total deployment time: 2-48 hours depending on DNS propagation*
