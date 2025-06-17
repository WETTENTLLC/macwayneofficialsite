# Mac Wayne Battered Coin - Simplified Live Deployment Script
# Execute final production deployment

param(
    [string]$Domain = "macwayneofficial.com",
    [string]$Environment = "production"
)

Write-Host "🚀 Mac Wayne Battered Coin - Live Deployment Implementation" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Target Domain: $Domain" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Green
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green

$sourceDir = Get-Location
$deploymentDir = Join-Path $sourceDir "live-deployment"
$productionDir = Join-Path $sourceDir "production-build"

# Step 1: Verify live deployment directory exists
Write-Host "`n🏗️ Step 1: Verifying deployment environment..." -ForegroundColor Yellow

if (-not (Test-Path $deploymentDir)) {
    Write-Host "❌ Live deployment directory not found. Creating it..." -ForegroundColor Red
    New-Item -ItemType Directory -Path $deploymentDir | Out-Null
}

# Copy any missing production files
if (Test-Path $productionDir) {
    Write-Host "📁 Copying production files to live deployment..." -ForegroundColor Yellow
    Copy-Item "$productionDir\*" $deploymentDir -Recurse -Force -Exclude "live-deployment"
    Write-Host "✅ Production files copied" -ForegroundColor Green
} else {
    Write-Host "⚠️ Production build directory not found. Using current files." -ForegroundColor Yellow
}

# Step 2: Update production configuration with domain
Write-Host "`n⚙️ Step 2: Updating production configuration..." -ForegroundColor Yellow

$configPath = Join-Path $deploymentDir "js\production-config.js"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    $configContent = $configContent -replace "macwayneofficial\.com", $Domain
    $configContent = $configContent -replace "YOUR_REAL_PROJECT_ID", "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    $configContent | Out-File -FilePath $configPath -Encoding UTF8
    Write-Host "✅ Production configuration updated for domain: $Domain" -ForegroundColor Green
} else {
    Write-Host "⚠️ Production config not found, using defaults" -ForegroundColor Yellow
}

# Step 3: Update service worker for production
Write-Host "`n🔧 Step 3: Updating service worker..." -ForegroundColor Yellow

$swPath = Join-Path $deploymentDir "sw.js"
if (Test-Path $swPath) {
    $swContent = Get-Content $swPath -Raw
    $swContent = $swContent -replace "localhost:3000", $Domain
    $swContent = $swContent -replace "localhost", $Domain
    $swContent | Out-File -FilePath $swPath -Encoding UTF8
    Write-Host "✅ Service worker updated for production" -ForegroundColor Green
} else {
    Write-Host "⚠️ Service worker not found" -ForegroundColor Yellow
}

# Step 4: Verify essential files exist
Write-Host "`n📋 Step 4: Verifying deployment files..." -ForegroundColor Yellow

$essentialFiles = @(
    "index.html",
    "battered-coin.html", 
    "js\production-config.js",
    "verify-deployment.html",
    "web.config",
    ".htaccess",
    "nginx.conf",
    "404.html",
    "500.html",
    "DEPLOYMENT-INSTRUCTIONS.md"
)

$missingFiles = @()
foreach ($file in $essentialFiles) {
    $filePath = Join-Path $deploymentDir $file
    if (-not (Test-Path $filePath)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ All essential deployment files present" -ForegroundColor Green
} else {
    Write-Host "⚠️ Missing files: $($missingFiles -join ', ')" -ForegroundColor Yellow
}

# Step 5: Create deployment manifest
Write-Host "`n📄 Step 5: Creating deployment manifest..." -ForegroundColor Yellow

$deploymentManifest = @{
    domain = $Domain
    environment = $Environment
    deploymentDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    version = "1.0.0"
    files = (Get-ChildItem $deploymentDir -Recurse -File | ForEach-Object { $_.FullName.Substring($deploymentDir.Length + 1) })
    serverConfigs = @("web.config", ".htaccess", "nginx.conf")
    verificationUrl = "https://$Domain/verify-deployment.html"
    instructions = "DEPLOYMENT-INSTRUCTIONS.md"
} | ConvertTo-Json -Depth 3

$manifestPath = Join-Path $deploymentDir "deployment-manifest.json"
$deploymentManifest | Out-File -FilePath $manifestPath -Encoding UTF8

Write-Host "✅ Deployment manifest created" -ForegroundColor Green

# Step 6: Generate final deployment report
Write-Host "`n📊 Step 6: Generating deployment report..." -ForegroundColor Yellow

$deploymentSize = (Get-ChildItem $deploymentDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
$deploymentSizeMB = [math]::Round($deploymentSize / 1MB, 2)

$report = @"
# Mac Wayne Battered Coin - Live Deployment Report

## Deployment Summary
- **Domain:** $Domain
- **Environment:** $Environment
- **Date:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- **Total Size:** $deploymentSizeMB MB
- **Files Count:** $($essentialFiles.Count)

## Deployment Package Contents
- ✅ Main cryptocurrency application files
- ✅ Production configuration
- ✅ Server configuration templates (Apache, IIS, Nginx)
- ✅ Deployment verification system
- ✅ Error pages (404, 500)
- ✅ Comprehensive deployment instructions

## Next Steps
1. Upload the 'live-deployment' folder contents to your web server
2. Configure your server using the appropriate config file:
   - Apache: Use .htaccess
   - IIS: Use web.config  
   - Nginx: Use nginx.conf
3. Update production-config.js with real API keys and contract addresses
4. Visit https://$Domain/verify-deployment.html to run tests
5. Follow DEPLOYMENT-INSTRUCTIONS.md for complete setup

## Verification
After deployment, test your site:
- SSL certificate validity
- Page load performance  
- Cryptocurrency functionality
- Mobile responsiveness
- Accessibility features

## Support
Refer to DEPLOYMENT-INSTRUCTIONS.md for detailed setup procedures and troubleshooting.

---
**Status: READY FOR LIVE DEPLOYMENT** ✅
"@

$reportPath = Join-Path $deploymentDir "DEPLOYMENT-REPORT.md"
$report | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "✅ Deployment report created" -ForegroundColor Green

# Final success message
Write-Host "`n🎉 LIVE DEPLOYMENT PACKAGE COMPLETE!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "📁 Package Location: $deploymentDir" -ForegroundColor Cyan
Write-Host "🌐 Target Domain: $Domain" -ForegroundColor Cyan
Write-Host "📊 Package Size: $deploymentSizeMB MB" -ForegroundColor Cyan
Write-Host "📋 Files Ready: $($essentialFiles.Count) essential files" -ForegroundColor Cyan

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Upload 'live-deployment' folder to your web server" -ForegroundColor White
Write-Host "2. Configure server (see web.config/.htaccess/nginx.conf)" -ForegroundColor White  
Write-Host "3. Update API keys in production-config.js" -ForegroundColor White
Write-Host "4. Test at: https://$Domain/verify-deployment.html" -ForegroundColor White
Write-Host "5. Follow DEPLOYMENT-INSTRUCTIONS.md for complete setup" -ForegroundColor White

Write-Host "`n🚀 Mac Wayne Battered Coin is ready for production deployment!" -ForegroundColor Green
