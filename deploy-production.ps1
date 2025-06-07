# Mac Wayne Crypto System - Production Deployment Script

Write-Host "Mac Wayne Crypto System - Production Deployment Preparation" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan

$sourceDir = Get-Location
$outputDir = Join-Path $sourceDir "production-build"

# Create production build directory
if (Test-Path $outputDir) {
    Remove-Item $outputDir -Recurse -Force
}
New-Item -ItemType Directory -Path $outputDir | Out-Null

Write-Host "Created production build directory: $outputDir" -ForegroundColor Green

# Copy essential files for crypto system
Write-Host "Copying essential files..." -ForegroundColor Yellow

# Core HTML files
Copy-Item "battered-coin.html" $outputDir
if (Test-Path "index.html") { Copy-Item "index.html" $outputDir }
if (Test-Path "sw.js") { Copy-Item "sw.js" $outputDir }

# Create optimized JavaScript directory
$jsDir = Join-Path $outputDir "js"
New-Item -ItemType Directory -Path $jsDir | Out-Null

# Copy core cryptocurrency JavaScript files
$cryptoFiles = @(
    "js/wallet-integration.js",
    "js/market-data.js", 
    "js/smart-contracts.js",
    "js/marketplace-integration.js",
    "js/value-generation.js",
    "js/user-experience.js",
    "js/crypto-optimizer.js",
    "js/crypto-testing.js",
    "js/crypto-master.js",
    "js/animations.js",
    "js/main.js",
    "js/battered-coin.js"
)

foreach ($file in $cryptoFiles) {
    if (Test-Path $file) {
        Copy-Item $file $jsDir
        Write-Host "Copied: $file" -ForegroundColor Green
    } else {
        Write-Host "Warning: $file not found" -ForegroundColor Yellow
    }
}

# Copy styles directory
if (Test-Path "styles") {
    $stylesDir = Join-Path $outputDir "styles"
    Copy-Item "styles" $stylesDir -Recurse
    Write-Host "Copied styles directory" -ForegroundColor Green
}

# Copy public directory (images, audio, etc.)
if (Test-Path "public") {
    $publicDir = Join-Path $outputDir "public"
    Copy-Item "public" $publicDir -Recurse
    Write-Host "Copied public directory" -ForegroundColor Green
}

# Create production configuration
Write-Host "Creating production configuration..." -ForegroundColor Yellow

$prodConfig = @'
/* Mac Wayne Crypto System - Production Configuration */
window.CRYPTO_CONFIG = {
    environment: 'production',
    apiBaseUrl: 'https://api.macwayneofficial.com/crypto/',
    walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    infuraProjectId: 'YOUR_INFURA_PROJECT_ID',
    contractAddresses: {
        mwbToken: '0x...',
        stakingPool: '0x...',
        nftMarketplace: '0x...'
    },
    networkConfig: {
        chainId: 1,
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
        blockExplorerUrls: ['https://etherscan.io']
    },
    features: {
        enableTestingUI: false,
        enableDebugMode: false,
        enableAnalytics: true,
        enableErrorReporting: true
    }
};
'@

$prodConfig | Out-File -FilePath (Join-Path $jsDir "production-config.js") -Encoding UTF8

# Create deployment checklist
Write-Host "Creating deployment checklist..." -ForegroundColor Yellow

$checklist = @'
# Mac Wayne Crypto System - Production Deployment Checklist

## Pre-Deployment Requirements
- [ ] Smart contracts deployed to mainnet
- [ ] Contract addresses updated in production-config.js
- [ ] Infura/Alchemy API keys configured
- [ ] WalletConnect project ID obtained and configured
- [ ] SSL certificate installed on domain
- [ ] CDN configured for static assets
- [ ] Error monitoring service configured

## Security Checklist
- [ ] All API keys are environment variables (not hardcoded)
- [ ] Smart contracts audited by security firm
- [ ] Frontend code audited for vulnerabilities
- [ ] CORS policies properly configured
- [ ] Content Security Policy headers implemented
- [ ] Rate limiting implemented on API endpoints

## Performance Optimization
- [ ] JavaScript files minified
- [ ] CSS files minified
- [ ] Images optimized and compressed
- [ ] Service worker configured for caching
- [ ] CDN configured for global delivery
- [ ] Browser caching headers configured

## Accessibility Compliance
- [ ] WCAG 2.1 AA compliance verified
- [ ] Screen reader testing completed
- [ ] Keyboard navigation testing completed
- [ ] High contrast mode tested
- [ ] Mobile accessibility tested

## Testing Completed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] End-to-end tests passing
- [ ] Cross-browser testing completed
- [ ] Mobile device testing completed
- [ ] Accessibility testing completed
- [ ] Performance testing completed
- [ ] Security testing completed

## Launch Strategy
- [ ] Staging environment tested
- [ ] Rollback plan prepared
- [ ] Support team trained
- [ ] Marketing materials prepared
- [ ] Community announcements prepared
'@

$checklist | Out-File -FilePath (Join-Path $outputDir "DEPLOYMENT-CHECKLIST.md") -Encoding UTF8

# Create production README
$readme = @'
# Mac Wayne Battered Coin - Production Build

This directory contains the production-ready build of the Mac Wayne cryptocurrency system.

## Quick Start

1. Upload all files to your web server
2. Configure your web server to serve battered-coin.html as the main page
3. Update the configuration in js/production-config.js with your actual:
   - Smart contract addresses
   - API keys
   - Network configuration

## File Structure

- battered-coin.html - Main cryptocurrency interface
- js/ - All JavaScript modules for crypto functionality
- styles/ - CSS styling for the application
- public/ - Static assets (images, audio, etc.)
- sw.js - Service worker for offline functionality

## Configuration

Edit js/production-config.js to configure:
- Smart contract addresses (after deployment)
- API endpoints
- Wallet integration settings
- Network configuration

## SSL Required

This application requires HTTPS to function properly due to:
- Web3 wallet integration requirements
- Service worker functionality
- Security best practices for financial applications

## Features Included

- Wallet Integration (MetaMask, WalletConnect, Coinbase)
- Real-time Market Data
- Smart Contract Interactions
- NFT Marketplace
- Staking & Yield Farming
- Trading Interface
- Accessibility-First Design
- Mobile Optimization
- Offline Support
- Performance Optimization
'@

$readme | Out-File -FilePath (Join-Path $outputDir "README.md") -Encoding UTF8

# Generate build info
$buildInfo = @{
    buildDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
    version = "1.0.0"
    commit = "production-build"
    features = @(
        "wallet-integration",
        "market-data",
        "smart-contracts", 
        "marketplace",
        "value-generation",
        "accessibility",
        "performance-optimization"
    )
}

$buildInfo | ConvertTo-Json -Depth 3 | Out-File -FilePath (Join-Path $outputDir "build-info.json") -Encoding UTF8

Write-Host "Production build complete!" -ForegroundColor Green
Write-Host "Build location: $outputDir" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Review DEPLOYMENT-CHECKLIST.md" -ForegroundColor Yellow
Write-Host "   2. Update production-config.js with your settings" -ForegroundColor Yellow
Write-Host "   3. Test in staging environment" -ForegroundColor Yellow
Write-Host "   4. Deploy to production server" -ForegroundColor Yellow

# Display file sizes
Write-Host "Production Build Summary:" -ForegroundColor Cyan
Get-ChildItem $outputDir -Recurse -File | Sort-Object Length -Descending | Select-Object Name, @{Name="Size (KB)"; Expression={[math]::Round($_.Length/1KB, 2)}} -First 10 | Format-Table -AutoSize
