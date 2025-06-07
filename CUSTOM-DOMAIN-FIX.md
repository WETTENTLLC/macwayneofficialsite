# Fix Custom Domain Issues for macwayneofficial.com

This guide will help you resolve the issue where macwayneofficial.com is pointing to the wrong website (Dru Down's site).

## Problem Analysis

The issue is that your domain macwayneofficial.com is currently pointing to a different website instead of your GitHub Pages site. This happens when:

1. There are conflicting DNS records
2. The GitHub Pages custom domain setup is incorrect
3. DNS changes haven't fully propagated

## Step-by-Step Fix

### 1. Clean Up Namecheap DNS Records

1. Log in to your Namecheap account
2. Go to "Domain List" and click "Manage" next to macwayneofficial.com
3. Click on "Advanced DNS" tab
4. **IMPORTANT**: Remove ALL existing A records and CNAME records that might be pointing to any other server
5. Add these GitHub Pages records:
   - A Record: @ → 185.199.108.153
   - A Record: @ → 185.199.109.153
   - A Record: @ → 185.199.110.153
   - A Record: @ → 185.199.111.153
   - CNAME Record: www → wettentllc.github.io

### 2. Fix GitHub Repository Settings

1. Go to your GitHub repository: https://github.com/WETTENTLLC/macwayneofficialsite
2. Click "Settings" tab
3. In the left sidebar, click "Pages"
4. Under "Custom domain", enter: macwayneofficial.com
5. Click "Save"
6. Check "Enforce HTTPS" (after DNS verification completes)

### 3. Verify CNAME File

Make sure your repository has a CNAME file in the root directory containing only:
```
macwayneofficial.com
```

### 4. Verify DNS Propagation

DNS changes can take up to 48 hours to fully propagate. Use these tools to check:

1. Visit https://dnschecker.org/#A/macwayneofficial.com
2. Check if the A records are showing the GitHub Pages IPs (185.199.108.153, etc.)

### 5. Testing Your Domain

Test these URLs once DNS has propagated:
- https://macwayneofficial.com
- https://macwayneofficial.com/battered-coin.html
- https://www.macwayneofficial.com

### 6. Clear Browser Cache

If you're still seeing the wrong website:
1. Clear your browser cache
2. Try a different browser
3. Try a different network (like mobile data)

### 7. Contact Support If Issues Persist

If after 48 hours you're still seeing the wrong website:
1. Verify DNS records are correctly set
2. Check GitHub Pages settings
3. Contact Namecheap support to ensure there are no domain conflicts

## Testing and Confirmation

When correctly configured, these tests should pass:
- [ ] https://wettentllc.github.io/macwayneofficialsite/ shows your site
- [ ] https://macwayneofficial.com shows your site (not Dru Down's)
- [ ] https://macwayneofficial.com/battered-coin.html shows the Battered Coin page
- [ ] All navigation links on the site work correctly
- [ ] The Sheriff Thizz Rewards System is functional on the Battered Coin page
