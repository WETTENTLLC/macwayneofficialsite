# Mac Wayne Website Accessibility Deployment Script
# This script replaces original files with accessibility-corrected versions

Write-Host "Mac Wayne Website - Accessibility Deployment" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Create backup directory
$sourceDir = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\deploy-clean"
$backupDir = "$sourceDir\original-backup"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "Created backup directory: $backupDir" -ForegroundColor Green
}

# 1. Replace CSS
$originalCss = "$sourceDir\styles\main.css"
$correctedCss = "$sourceDir\styles\main-corrected.css"

if (Test-Path $originalCss) {
    Copy-Item $originalCss "$backupDir\main.css.bak"
    Copy-Item $correctedCss $originalCss -Force
    Write-Host "✓ Replaced CSS file" -ForegroundColor Green
} else {
    Write-Host "✗ CSS file not found at $originalCss" -ForegroundColor Red
}

# 2. Replace HTML files
$htmlFiles = @(
    @{Original = "shop.html"; Corrected = "shop-corrected.html"},
    @{Original = "live.html"; Corrected = "live-corrected.html"},
    @{Original = "documentary.html"; Corrected = "documentary-corrected.html"},
    @{Original = "battered-coin.html"; Corrected = "battered-coin-corrected.html"}
)

foreach ($file in $htmlFiles) {
    $originalPath = "$sourceDir\$($file.Original)"
    $correctedPath = "$sourceDir\$($file.Corrected)"
    
    if (Test-Path $originalPath) {
        Copy-Item $originalPath "$backupDir\$($file.Original).bak"
        Copy-Item $correctedPath $originalPath -Force
        Write-Host "✓ Replaced $($file.Original)" -ForegroundColor Green
    } else {
        Write-Host "✗ Original file not found at $originalPath" -ForegroundColor Red
    }
}

# 3. Handle index.html
$indexOriginal = "$sourceDir\_site\index.html" 
$indexCorrected = "$sourceDir\index-corrected.html"

if (Test-Path $indexOriginal) {
    Copy-Item $indexOriginal "$backupDir\index.html.bak"
    Copy-Item $indexCorrected $indexOriginal -Force
    Write-Host "✓ Replaced index.html in _site folder" -ForegroundColor Green
} else {
    $indexOriginal = "$sourceDir\index.html"
    if (Test-Path $indexOriginal) {
        Copy-Item $indexOriginal "$backupDir\index.html.bak"
        Copy-Item $indexCorrected $indexOriginal -Force
        Write-Host "✓ Replaced index.html in root folder" -ForegroundColor Green
    } else {
        Write-Host "✗ Index file not found in expected locations" -ForegroundColor Red
    }
}

# 4. Also copy files to _site folder
$siteFolder = "$sourceDir\_site"
if (Test-Path $siteFolder) {
    foreach ($file in $htmlFiles) {
        $correctedPath = "$sourceDir\$($file.Corrected)"
        $sitePath = "$siteFolder\$($file.Original)"
        
        if (Test-Path $sitePath) {
            Copy-Item $correctedPath $sitePath -Force
            Write-Host "✓ Copied $($file.Original) to _site folder" -ForegroundColor Green
        }
    }
    
    # Copy CSS to _site folder
    $siteStylesDir = "$siteFolder\styles"
    if (-not (Test-Path $siteStylesDir)) {
        New-Item -ItemType Directory -Path $siteStylesDir | Out-Null
    }
    Copy-Item $correctedCss "$siteStylesDir\main.css" -Force
    Write-Host "✓ Copied corrected CSS to _site folder" -ForegroundColor Green
}

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Cyan