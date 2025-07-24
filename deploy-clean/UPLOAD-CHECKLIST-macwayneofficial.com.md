# Mac Wayne Battered Coin - Upload Checklist for macwayneofficial.com

## Pre-Upload Steps
- [ ] Domain DNS configured to point to server IP
- [ ] SSL certificate obtained and ready to install
- [ ] Server configured (Apache/IIS/Nginx)
- [ ] API keys updated in js/production-config.js

## Upload Steps  
- [ ] Upload all files from live-deployment/ to server web root
- [ ] Set file permissions (755 for directories, 644 for files)
- [ ] Configure SSL certificate
- [ ] Test HTTPS redirect

## Post-Upload Verification
- [ ] Visit https://macwayneofficial.com (main site loads)
- [ ] Visit https://macwayneofficial.com/battered-coin.html (crypto page loads)
- [ ] Visit https://macwayneofficial.com/verify-deployment.html (run all tests)
- [ ] Test wallet connectivity (MetaMask, WalletConnect)
- [ ] Verify mobile responsiveness
- [ ] Check SSL certificate validity

## Performance Validation
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] All Core Web Vitals in "Good" range
- [ ] No console errors

## Go-Live
- [ ] All verification tests pass
- [ ] Cryptocurrency features functional
- [ ] Analytics tracking active
- [ ] Ready for public launch

Generated: 06/06/2025 15:51:12
Domain: macwayneofficial.com
