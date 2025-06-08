# Fix GitHub Pages Custom Domain Configuration
# This script provides step-by-step instructions to fix the custom domain issue

Write-Host "Starting custom domain fix process..." -ForegroundColor Cyan

# Step 1: Verify GitHub Repository Settings
Write-Host "`nSTEP 1: CHECK GITHUB REPOSITORY SETTINGS" -ForegroundColor Green
Write-Host "1. Go to https://github.com/WETTENTLLC/macwayneofficialsite/settings/pages" -ForegroundColor White
Write-Host "2. Under 'Custom domain', verify that macwayneofficial.com is set" -ForegroundColor White
Write-Host "3. If not, enter macwayneofficial.com and click 'Save'" -ForegroundColor White
Write-Host "4. Make sure 'Enforce HTTPS' is checked" -ForegroundColor White
Write-Host "5. Note: If there's a warning about DNS records, proceed to Step 2" -ForegroundColor Yellow

# Step 2: Verify Namecheap DNS Settings
Write-Host "`nSTEP 2: VERIFY NAMECHEAP DNS SETTINGS" -ForegroundColor Green
Write-Host "1. Log in to your Namecheap account" -ForegroundColor White
Write-Host "2. Go to Domain List and select macwayneofficial.com" -ForegroundColor White
Write-Host "3. Click 'Manage' and then 'Advanced DNS'" -ForegroundColor White
Write-Host "4. REMOVE any existing A or CNAME records that point to other websites" -ForegroundColor Red
Write-Host "5. ADD these records:" -ForegroundColor White
Write-Host "   A Record: @ -> 185.199.108.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.109.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.110.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.111.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   CNAME Record: www -> wettentllc.github.io." -ForegroundColor Yellow
Write-Host "   Note: Make sure the CNAME includes the trailing dot!" -ForegroundColor Red

# Step 3: Verify CNAME file in repository
Write-Host "`nSTEP 3: VERIFY CNAME FILE" -ForegroundColor Green
Write-Host "1. Ensure your CNAME file contains only: macwayneofficial.com" -ForegroundColor White
Write-Host "2. No extra spaces, returns, or other text" -ForegroundColor White

# Step 4: Force Rebuild GitHub Pages
Write-Host "`nSTEP 4: FORCE REBUILD GITHUB PAGES" -ForegroundColor Green
Write-Host "1. Go to https://github.com/WETTENTLLC/macwayneofficialsite/settings/pages" -ForegroundColor White
Write-Host "2. Temporarily remove the custom domain and click 'Save'" -ForegroundColor White
Write-Host "3. Re-add macwayneofficial.com as the custom domain and click 'Save'" -ForegroundColor White
Write-Host "4. This will trigger a rebuild of your site" -ForegroundColor White

# Step 5: Wait for DNS Propagation
Write-Host "`nSTEP 5: WAIT FOR DNS PROPAGATION" -ForegroundColor Green
Write-Host "1. DNS changes can take up to 48 hours to propagate" -ForegroundColor White
Write-Host "2. You can check propagation status using: https://dnschecker.org/#A/macwayneofficial.com" -ForegroundColor White
Write-Host "3. The A records should point to the GitHub Pages IPs" -ForegroundColor White

# Step 6: Final Verification
Write-Host "`nSTEP 6: FINAL VERIFICATION" -ForegroundColor Green
Write-Host "1. Once DNS has propagated, visit macwayneofficial.com" -ForegroundColor White
Write-Host "2. It should display the Mac Wayne website" -ForegroundColor White
Write-Host "3. If still seeing Dru Down's website, clear your browser cache or try incognito mode" -ForegroundColor White

Write-Host "`nIMPORTANT NOTE:" -ForegroundColor Cyan
Write-Host "If macwayneofficial.com was previously pointing to another website, it may take longer" -ForegroundColor White
Write-Host "for the change to take effect due to DNS caching." -ForegroundColor White

Write-Host "`nTROUBLESHOOTING:" -ForegroundColor Cyan
Write-Host "1. Verify your GitHub repository contains the correct Mac Wayne website files" -ForegroundColor White
Write-Host "2. Check if there are conflicting DNS records in Namecheap" -ForegroundColor White
Write-Host "3. Ensure the repository name in your GitHub Pages settings is correct" -ForegroundColor White
Write-Host "4. Try accessing the site from a different network (e.g., mobile data instead of WiFi)" -ForegroundColor White

Write-Host "`nScript completed! Follow these steps to fix your custom domain issue." -ForegroundColor Green
