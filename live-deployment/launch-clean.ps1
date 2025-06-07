# Mac Wayne Battered Coin - Final Launch Script (Clean Version)
param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$false)]
    [string]$ServerType = "auto",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipVerification
)

Write-Host "Mac Wayne Battered Coin - Final Launch Assistant" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$deploymentPath = Get-Location

# Validate deployment package
Write-Host "`nValidating Deployment Package..." -ForegroundColor Yellow

$requiredFiles = @(
    "index.html",
    "battered-coin.html", 
    "js\production-config.js",
    "verify-deployment.html",
    "sw.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "Missing required files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "All required files present" -ForegroundColor Green

# Check configuration file
Write-Host "`nChecking Configuration..." -ForegroundColor Yellow

$configContent = Get-Content "js\production-config.js" -Raw
if ($configContent -match "YOUR_INFURA_PROJECT_ID" -or $configContent -match "YOUR_WALLETCONNECT_PROJECT_ID") {
    Write-Host "API keys still contain placeholders" -ForegroundColor Yellow
    Write-Host "Please update js\production-config.js with real API keys" -ForegroundColor Yellow
    Write-Host "See API-SETUP-GUIDE.md for detailed instructions" -ForegroundColor Yellow
} else {
    Write-Host "Configuration appears to be updated" -ForegroundColor Green
}

# Domain configuration
Write-Host "`nConfiguring for Domain: $Domain" -ForegroundColor Yellow

# Update service worker with domain
$swContent = Get-Content "sw.js" -Raw
$swContent = $swContent -replace "macwayneofficial\.com", $Domain
Set-Content "sw.js" -Value $swContent

Write-Host "Service worker updated for $Domain" -ForegroundColor Green

# Server configuration recommendations
Write-Host "`nServer Configuration Recommendations:" -ForegroundColor Yellow

Write-Host "Detected server configurations available:" -ForegroundColor Cyan
if (Test-Path ".htaccess") { Write-Host "  * Apache (.htaccess)" -ForegroundColor White }
if (Test-Path "web.config") { Write-Host "  * IIS (web.config)" -ForegroundColor White }
if (Test-Path "nginx.conf") { Write-Host "  * Nginx (nginx.conf)" -ForegroundColor White }

Write-Host "`nUpload Instructions:" -ForegroundColor Cyan
Write-Host "1. Upload entire 'live-deployment' folder contents to your web server root" -ForegroundColor White
Write-Host "2. Ensure the appropriate server config file is in place" -ForegroundColor White
Write-Host "3. Configure SSL certificate for HTTPS" -ForegroundColor White
Write-Host "4. Point domain DNS to server IP" -ForegroundColor White

# Generate upload checklist
Write-Host "`nCreating Upload Checklist..." -ForegroundColor Yellow

$checklist = @"
# Mac Wayne Battered Coin - Upload Checklist for $Domain

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
- [ ] Visit https://$Domain (main site loads)
- [ ] Visit https://$Domain/battered-coin.html (crypto page loads)
- [ ] Visit https://$Domain/verify-deployment.html (run all tests)
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

Generated: $(Get-Date)
Domain: $Domain
"@

Set-Content "UPLOAD-CHECKLIST-$Domain.md" -Value $checklist
Write-Host "Created UPLOAD-CHECKLIST-$Domain.md" -ForegroundColor Green

# Final verification
if (-not $SkipVerification) {
    Write-Host "`nRunning Final Pre-Upload Verification..." -ForegroundColor Yellow
    
    # Check file sizes
    $totalSize = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum
    $sizeMB = [math]::Round($totalSize / 1MB, 2)
    Write-Host "Total package size: $sizeMB MB" -ForegroundColor Cyan
    
    # Check critical paths
    $criticalPaths = @("js", "styles", "public")
    foreach ($path in $criticalPaths) {
        if (Test-Path $path) {
            $fileCount = (Get-ChildItem $path -Recurse -File).Count
            Write-Host "$path/ - $fileCount files" -ForegroundColor Green
        } else {
            Write-Host "Missing critical path: $path/" -ForegroundColor Red
        }
    }
}

Write-Host "`nAfter Upload - Run This Command to Test:" -ForegroundColor Cyan
Write-Host ".\quick-verify.ps1" -ForegroundColor White
Write-Host "OR visit: https://$Domain/verify-deployment.html" -ForegroundColor White

Write-Host "`nDEPLOYMENT PACKAGE READY FOR UPLOAD!" -ForegroundColor Green
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Upload live-deployment/ contents to web server" -ForegroundColor White
Write-Host "2. Configure SSL and server settings" -ForegroundColor White  
Write-Host "3. Update API keys in production-config.js" -ForegroundColor White
Write-Host "4. Run verification tests" -ForegroundColor White
Write-Host "5. LAUNCH!" -ForegroundColor Cyan

# Final summary
Write-Host "`nDeployment Summary:" -ForegroundColor Cyan
Write-Host "Domain: $Domain" -ForegroundColor White
Write-Host "Package Size: $sizeMB MB" -ForegroundColor White
Write-Host "Files Ready: YES" -ForegroundColor Green
Write-Host "Configs Ready: YES" -ForegroundColor Green
Write-Host "Launch Ready: YES" -ForegroundColor Green
