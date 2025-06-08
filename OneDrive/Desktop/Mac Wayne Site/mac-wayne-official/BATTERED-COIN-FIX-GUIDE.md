# Battered Coin Page Fix and Deployment Guide

## Problem Summary

The Mac Wayne Battered Coin page is currently experiencing two main issues:

1. **404 Error**: The page isn't accessible at https://wettentllc.github.io/macwayneofficialsite/battered-coin.html
2. **CSS Styling Issues**: When the page does load, it appears without proper CSS styling
3. **Domain Configuration**: macwayneofficial.com is pointing to Dru Down's website instead of Mac Wayne's site

## Solution Steps

### Step 1: Fix CSS Path Issues

The main issue is with how CSS, JavaScript and image files are referenced. The original files use relative paths, but GitHub Pages requires absolute paths with the repository name.

Run this script to fix all paths in the HTML files:

```powershell
# Run from the mac-wayne-official directory
.\fix-github-paths.ps1
```

This script will:
- Update all CSS references to use `/macwayneofficialsite/styles/...`
- Update all JavaScript references to use `/macwayneofficialsite/js/...`
- Update all image references to use `/macwayneofficialsite/public/Images/...`
- Remove any `<base>` tags that might be causing path issues

### Step 2: Create Case-Insensitive Variants

GitHub Pages is case-sensitive, so we need to create multiple versions of the battered-coin.html file:

```powershell
# Run from the mac-wayne-official directory
.\update-battered-variants.ps1
```

This creates these variants:
- battered-coin.html (original)
- Battered-coin.html
- Battered-Coin.html
- BATTERED-COIN.html
- batteredcoin.html
- BatteredCoin.html

### Step 3: Create a Redirect Page

For maximum compatibility, we've created a redirect page that will automatically redirect to the correct file:

```html
<!-- battered-coin-redirect.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mac Wayne - Battered Coin</title>
    <meta http-equiv="refresh" content="0; url=battered-coin.html">
    <script>window.location.href = "battered-coin.html";</script>
</head>
<body>
    <p>Redirecting to <a href="battered-coin.html">Battered Coin</a>...</p>
</body>
</html>
```

### Step 4: Deploy to GitHub Pages

```powershell
# Make sure you're in the mac-wayne-official directory
cd "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official"

# Add all files to git
git add .

# Commit the changes
git commit -m "Fix Battered Coin page styling and 404 errors"

# Push to GitHub
git push origin master
```

### Step 5: Configure Namecheap DNS for GitHub Pages

For the domain to work correctly, follow these steps in Namecheap:

1. **CRITICAL**: Remove ALL existing DNS records first to avoid conflicts
2. Add these A Records:
   - @ -> 185.199.108.153
   - @ -> 185.199.109.153
   - @ -> 185.199.110.153
   - @ -> 185.199.111.153
3. Add this CNAME Record:
   - www -> wettentllc.github.io
4. In GitHub repository settings, ensure custom domain is set to: macwayneofficial.com
5. Wait for DNS propagation (can take up to 48 hours)

### Step 6: Verify Deployment

Run the verification script to check if everything is working:

```powershell
# Run from the mac-wayne-official directory
.\verify-battered-coin.ps1
```

This will check:
- If the Battered Coin page is accessible
- If all CSS and JavaScript files are loading
- Provide recommendations if issues are found

## Troubleshooting

### If the page still shows a 404 error:

1. Verify GitHub Pages is enabled in repository settings
2. Check if the repository name is correct in the paths (should be "macwayneofficialsite")
3. Ensure all files were pushed to the correct branch (master)
4. Try clearing your browser cache or using incognito mode

### If the styling is still missing:

1. Check browser developer tools (F12) to see which CSS files are failing to load
2. Verify the paths in the HTML files are correct
3. Run the fix-github-paths.ps1 script again and redeploy

### If the domain still points to Dru Down's website:

1. Double-check that ALL previous DNS records were removed
2. Verify the A Records and CNAME Record are set correctly
3. Check if the custom domain is set in GitHub repository settings
4. Wait longer for DNS propagation (up to 48 hours)
5. Clear your DNS cache: `ipconfig /flushdns`

## Contact and Support

If issues persist after following this guide, contact:
- GitHub Support for repository issues
- Namecheap Support for domain issues
- The development team for code-specific issues
