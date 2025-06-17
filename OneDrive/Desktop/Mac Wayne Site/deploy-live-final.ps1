# Mac Wayne Battered Coin - Live Deployment Script
param(
    [string]$Domain = "macwayneofficial.com",
    [string]$Environment = "production"
)

Write-Host "Mac Wayne Battered Coin - Live Deployment" -ForegroundColor Cyan
Write-Host "Target Domain: $Domain" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Green

$sourceDir = Get-Location
$deploymentDir = Join-Path $sourceDir "live-deployment"
$productionDir = Join-Path $sourceDir "production-build"

Write-Host "Verifying deployment environment..." -ForegroundColor Yellow

if (-not (Test-Path $deploymentDir)) {
    New-Item -ItemType Directory -Path $deploymentDir | Out-Null
    Write-Host "Live deployment directory created" -ForegroundColor Green
}

if (Test-Path $productionDir) {
    Write-Host "Copying production files..." -ForegroundColor Yellow
    Get-ChildItem $productionDir | ForEach-Object {
        if ($_.Name -ne "live-deployment") {
            Copy-Item $_.FullName $deploymentDir -Recurse -Force
        }
    }
    Write-Host "Production files copied" -ForegroundColor Green
}

Write-Host "Updating production configuration..." -ForegroundColor Yellow

$configPath = Join-Path $deploymentDir "js\production-config.js"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    $configContent = $configContent -replace "macwayneofficial\.com", $Domain
    $configContent | Out-File -FilePath $configPath -Encoding UTF8
    Write-Host "Configuration updated for $Domain" -ForegroundColor Green
}

Write-Host "Updating service worker..." -ForegroundColor Yellow

$swPath = Join-Path $deploymentDir "sw.js"
if (Test-Path $swPath) {
    $swContent = Get-Content $swPath -Raw
    $swContent = $swContent -replace "localhost", $Domain
    $swContent | Out-File -FilePath $swPath -Encoding UTF8
    Write-Host "Service worker updated" -ForegroundColor Green
}

Write-Host "Verifying deployment files..." -ForegroundColor Yellow

$essentialFiles = @(
    "verify-deployment.html",
    "web.config", 
    ".htaccess",
    "nginx.conf",
    "404.html",
    "500.html",
    "DEPLOYMENT-INSTRUCTIONS.md"
)

$allPresent = $true
foreach ($file in $essentialFiles) {
    $filePath = Join-Path $deploymentDir $file
    if (Test-Path $filePath) {
        Write-Host "$file" -ForegroundColor Green
    } else {
        Write-Host "$file" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host "Creating deployment report..." -ForegroundColor Yellow

$deploymentSize = (Get-ChildItem $deploymentDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
$deploymentSizeMB = [math]::Round($deploymentSize / 1MB, 2)

$report = @"
# Mac Wayne Battered Coin - Live Deployment Report

## Deployment Summary
- Domain: $Domain
- Environment: $Environment  
- Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Size: $deploymentSizeMB MB

## Next Steps
1. Upload 'live-deployment' folder to your web server
2. Configure server using appropriate config file
3. Update API keys in production-config.js
4. Test at https://$Domain/verify-deployment.html

## Status: READY FOR DEPLOYMENT
"@

$reportPath = Join-Path $deploymentDir "DEPLOYMENT-REPORT.md"
$report | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "DEPLOYMENT PACKAGE COMPLETE!" -ForegroundColor Green
Write-Host "Location: $deploymentDir" -ForegroundColor Cyan
Write-Host "Size: $deploymentSizeMB MB" -ForegroundColor Cyan
Write-Host "Domain: $Domain" -ForegroundColor Cyan

Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Upload live-deployment folder to web server" -ForegroundColor White
Write-Host "2. Configure server (web.config/.htaccess/nginx.conf)" -ForegroundColor White
Write-Host "3. Update API keys in production-config.js" -ForegroundColor White
Write-Host "4. Test at https://$Domain/verify-deployment.html" -ForegroundColor White

Write-Host "Ready for production deployment!" -ForegroundColor Green
