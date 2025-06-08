# Domain Correction Script for Mac Wayne Official Website
# This script provides detailed steps to fix the domain pointing to Dru Down's site

Write-Host "Mac Wayne Official Website - Domain Correction Guide" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host

Write-Host "PROBLEM IDENTIFIED:" -ForegroundColor Red
Write-Host "Your domain macwayneofficial.com is currently pointing to Dru Down's website" -ForegroundColor Red
Write-Host "instead of Mac Wayne's GitHub Pages site." -ForegroundColor Red
Write-Host

Write-Host "ROOT CAUSE ANALYSIS:" -ForegroundColor Yellow
Write-Host "1. Conflicting DNS records in Namecheap" -ForegroundColor Yellow
Write-Host "2. Incorrect or outdated DNS configuration" -ForegroundColor Yellow
Write-Host "3. Domain may have been previously used for another site" -ForegroundColor Yellow
Write-Host

Write-Host "STEP-BY-STEP SOLUTION:" -ForegroundColor Green
Write-Host

Write-Host "STEP 1: Completely Reset Namecheap DNS Configuration" -ForegroundColor White
Write-Host "----------------------------------------------" -ForegroundColor White
Write-Host "1. Log in to your Namecheap account" -ForegroundColor White
Write-Host "2. Go to 'Domain List' and click 'Manage' next to macwayneofficial.com" -ForegroundColor White
Write-Host "3. Click on the 'Advanced DNS' tab" -ForegroundColor White
Write-Host "4. IMPORTANT: DELETE ALL EXISTING DNS RECORDS" -ForegroundColor Red
Write-Host "   This is crucial as there are likely conflicting records pointing to Dru Down's site" -ForegroundColor Red
Write-Host "5. Add these NEW GitHub Pages DNS records:" -ForegroundColor White
Write-Host "   - Type: A Record | Host: @ | Value: 185.199.108.153 | TTL: Automatic" -ForegroundColor Yellow
Write-Host "   - Type: A Record | Host: @ | Value: 185.199.109.153 | TTL: Automatic" -ForegroundColor Yellow
Write-Host "   - Type: A Record | Host: @ | Value: 185.199.110.153 | TTL: Automatic" -ForegroundColor Yellow
Write-Host "   - Type: A Record | Host: @ | Value: 185.199.111.153 | TTL: Automatic" -ForegroundColor Yellow
Write-Host "   - Type: CNAME Record | Host: www | Value: wettentllc.github.io | TTL: Automatic" -ForegroundColor Yellow
Write-Host

Write-Host "STEP 2: Verify GitHub Repository Settings" -ForegroundColor White
Write-Host "----------------------------------------------" -ForegroundColor White
Write-Host "1. Go to: https://github.com/WETTENTLLC/macwayneofficialsite/settings/pages" -ForegroundColor White
Write-Host "2. Under 'Custom domain', ensure it's set to: macwayneofficial.com" -ForegroundColor White
Write-Host "3. Click 'Save'" -ForegroundColor White
Write-Host "4. Wait for GitHub to verify DNS settings (this may take a few minutes)" -ForegroundColor White
Write-Host "5. Once verified, check 'Enforce HTTPS' option" -ForegroundColor White
Write-Host

Write-Host "STEP 3: Ensure CNAME File Exists in Repository" -ForegroundColor White
Write-Host "----------------------------------------------" -ForegroundColor White
Write-Host "1. Check that your repository has a CNAME file at the root" -ForegroundColor White
Write-Host "2. The CNAME file should contain only: macwayneofficial.com" -ForegroundColor White
Write-Host "3. If needed, create this file and push it to the repository" -ForegroundColor White
Write-Host

# Create CNAME file if it doesn't exist
if (-not (Test-Path "CNAME")) {
    Write-Host "Creating CNAME file with macwayneofficial.com..." -ForegroundColor Green
    Set-Content -Path "CNAME" -Value "macwayneofficial.com"
    Write-Host "CNAME file created successfully." -ForegroundColor Green
} else {
    $cnameContent = Get-Content "CNAME"
    if ($cnameContent -ne "macwayneofficial.com") {
        Write-Host "Updating CNAME file with correct domain..." -ForegroundColor Yellow
        Set-Content -Path "CNAME" -Value "macwayneofficial.com"
        Write-Host "CNAME file updated successfully." -ForegroundColor Green
    } else {
        Write-Host "CNAME file already exists with correct content." -ForegroundColor Green
    }
}

Write-Host "STEP 4: Verify DNS Propagation" -ForegroundColor White
Write-Host "----------------------------------------------" -ForegroundColor White
Write-Host "1. DNS changes can take up to 48 hours to fully propagate" -ForegroundColor White
Write-Host "2. Use online tools to check DNS propagation:" -ForegroundColor White
Write-Host "   - https://dnschecker.org/#A/macwayneofficial.com" -ForegroundColor Cyan
Write-Host "   - https://www.whatsmydns.net/#A/macwayneofficial.com" -ForegroundColor Cyan
Write-Host "3. Verify that the A records are pointing to GitHub Pages IPs:" -ForegroundColor White
Write-Host "   - 185.199.108.153" -ForegroundColor Yellow
Write-Host "   - 185.199.109.153" -ForegroundColor Yellow
Write-Host "   - 185.199.110.153" -ForegroundColor Yellow
Write-Host "   - 185.199.111.153" -ForegroundColor Yellow
Write-Host

Write-Host "STEP 5: Clear Local DNS Cache and Browser Cache" -ForegroundColor White
Write-Host "----------------------------------------------" -ForegroundColor White
Write-Host "1. Clear your local DNS cache:" -ForegroundColor White
Write-Host "   - Run this command in PowerShell as Administrator: ipconfig /flushdns" -ForegroundColor Gray
Write-Host "2. Clear your browser cache:" -ForegroundColor White
Write-Host "   - Chrome: Settings > Privacy and security > Clear browsing data" -ForegroundColor White
Write-Host "   - Edge: Settings > Privacy, search, and services > Clear browsing data" -ForegroundColor White
Write-Host "   - Firefox: Options > Privacy & Security > Cookies and Site Data > Clear Data" -ForegroundColor White
Write-Host "3. Try accessing in a different browser or private/incognito mode" -ForegroundColor White
Write-Host "4. Try from a different network (e.g., mobile data instead of WiFi)" -ForegroundColor White
Write-Host

Write-Host "TESTING YOUR SITE AFTER CHANGES:" -ForegroundColor Magenta
Write-Host "----------------------------------------------" -ForegroundColor Magenta
Write-Host "Test the following URLs after DNS propagation:" -ForegroundColor White
Write-Host "1. https://macwayneofficial.com" -ForegroundColor Cyan
Write-Host "2. https://www.macwayneofficial.com" -ForegroundColor Cyan
Write-Host "3. https://macwayneofficial.com/battered-coin.html" -ForegroundColor Cyan
Write-Host "4. https://wettentllc.github.io/macwayneofficialsite/" -ForegroundColor Cyan
Write-Host

Write-Host "TROUBLESHOOTING:" -ForegroundColor Red
Write-Host "----------------------------------------------" -ForegroundColor Red
Write-Host "If after 48 hours you still see Dru Down's website:" -ForegroundColor White
Write-Host "1. Double-check all Namecheap DNS records - ensure NO conflicting records exist" -ForegroundColor White
Write-Host "2. Contact Namecheap support to verify there are no domain conflicts" -ForegroundColor White
Write-Host "3. Check if there are any URL redirects configured in Namecheap" -ForegroundColor White
Write-Host "4. Verify GitHub Pages is correctly set up for your repository" -ForegroundColor White
Write-Host

Write-Host "GITHUB REPOSITORY MAINTENANCE:" -ForegroundColor Blue
Write-Host "----------------------------------------------" -ForegroundColor Blue
Write-Host "To ensure your GitHub Pages deployment works correctly:" -ForegroundColor White
Write-Host "1. Push any updates to the 'master' branch (not 'main')" -ForegroundColor White
Write-Host "2. Ensure the CNAME file is not deleted in future pushes" -ForegroundColor White
Write-Host "3. Verify all HTML files use relative links to resources" -ForegroundColor White
Write-Host "4. Check that Battered Coin page is correctly linked in the navigation" -ForegroundColor White
Write-Host

Write-Host "DNS CONFIGURATION SUMMARY:" -ForegroundColor Green
Write-Host "----------------------------------------------" -ForegroundColor Green
Write-Host "Correct configuration should be:" -ForegroundColor White
Write-Host "NAMECHEAP DNS RECORDS:" -ForegroundColor White
Write-Host "A Records:" -ForegroundColor White
Write-Host "  @ -> 185.199.108.153" -ForegroundColor Yellow
Write-Host "  @ -> 185.199.109.153" -ForegroundColor Yellow
Write-Host "  @ -> 185.199.110.153" -ForegroundColor Yellow
Write-Host "  @ -> 185.199.111.153" -ForegroundColor Yellow
Write-Host "CNAME Record:" -ForegroundColor White
Write-Host "  www -> wettentllc.github.io" -ForegroundColor Yellow
Write-Host "GITHUB PAGES SETTING:" -ForegroundColor White
Write-Host "  Custom domain: macwayneofficial.com" -ForegroundColor Yellow
Write-Host "  Enforce HTTPS: Checked" -ForegroundColor Yellow
Write-Host

Write-Host "Success Verification Checklist:" -ForegroundColor Cyan
Write-Host "□ Namecheap DNS records show only GitHub Pages IPs" -ForegroundColor White
Write-Host "□ CNAME file exists in repository with correct domain" -ForegroundColor White
Write-Host "□ GitHub Pages shows 'Your site is published at https://macwayneofficial.com/'" -ForegroundColor White
Write-Host "□ Website loads Mac Wayne content (not Dru Down)" -ForegroundColor White
Write-Host "□ Battered Coin page is accessible from navigation" -ForegroundColor White
Write-Host "□ HTTPS is working for all pages" -ForegroundColor White
Write-Host

Write-Host "IMPORTANT REMINDER:" -ForegroundColor Red
Write-Host "It's crucial to DELETE ALL existing DNS records before adding the new ones." -ForegroundColor Red
Write-Host "This ensures no conflicting records remain pointing to Dru Down's server." -ForegroundColor Red
