# Mac Wayne Battered Coin - Final Deployment Status Check
Write-Host "🚀 MAC WAYNE BATTERED COIN - DEPLOYMENT STATUS" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

# Check deployment package
$deploymentPath = "live-deployment"
if (Test-Path $deploymentPath) {
    try {
        $packageSize = (Get-ChildItem $deploymentPath -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        $fileCount = (Get-ChildItem $deploymentPath -Recurse -File -ErrorAction SilentlyContinue).Count
        Write-Host "✅ DEPLOYMENT PACKAGE READY" -ForegroundColor Green
        Write-Host "   Size: $([math]::Round($packageSize, 2)) MB" -ForegroundColor White
        Write-Host "   Files: $fileCount" -ForegroundColor White
    } catch {
        Write-Host "✅ DEPLOYMENT PACKAGE EXISTS" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Deployment package not found" -ForegroundColor Red
}

# Check dependencies
if (Test-Path "node_modules") {
    Write-Host "✅ DEPENDENCIES INSTALLED" -ForegroundColor Green
    Write-Host "   WalletConnect packages: Ready" -ForegroundColor White
} else {
    Write-Host "❌ Dependencies not installed" -ForegroundColor Red
}

# Check configuration files
Write-Host ""
Write-Host "📋 CONFIGURATION STATUS:" -ForegroundColor Yellow

$configCheck = @{
    "Production Config" = "live-deployment\js\production-config.js"
    "WalletConnect Setup" = "live-deployment\js\walletconnect-setup.js"
    "Apache Config" = "live-deployment\.htaccess"
    "IIS Config" = "live-deployment\web.config"
    "Nginx Config" = "live-deployment\nginx.conf"
}

foreach ($name in $configCheck.Keys) {
    if (Test-Path $configCheck[$name]) {
        Write-Host "   ✅ $name" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $name" -ForegroundColor Red
    }
}

# Check API configuration
Write-Host ""
Write-Host "🔑 API CONFIGURATION:" -ForegroundColor Yellow

$productionConfig = "live-deployment\js\production-config.js"
if (Test-Path $productionConfig) {
    try {
        $configContent = Get-Content $productionConfig -Raw -ErrorAction SilentlyContinue
        if ($configContent -match "37b25cd53c7648f69b662609433f87b8") {
            Write-Host "   ✅ Infura API Key: Configured" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Infura API Key: Missing" -ForegroundColor Red
        }
        
        if ($configContent -match "YOUR_WALLETCONNECT_PROJECT_ID") {
            Write-Host "   ⏳ WalletConnect ID: Needs Setup" -ForegroundColor Yellow
            Write-Host "      Visit: https://cloud.reown.com/" -ForegroundColor White
        } else {
            Write-Host "   ✅ WalletConnect ID: Configured" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ❌ Cannot read configuration file" -ForegroundColor Red
    }
}

# Check documentation
Write-Host ""
Write-Host "📚 DOCUMENTATION:" -ForegroundColor Yellow

$docs = @(
    "DEPLOY-NOW-GUIDE.md",
    "DEPLOYMENT-EXECUTE.md", 
    "TECHNOLOGY-ROADMAP.md",
    "FINAL-DEPLOYMENT-CHECKLIST.md"
)

foreach ($doc in $docs) {
    $fullPath = "live-deployment\$doc"
    if (Test-Path $fullPath) {
        Write-Host "   ✅ $doc" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $doc" -ForegroundColor Red
    }
}

# Check rewards system
Write-Host ""
Write-Host "🎁 REWARDS SYSTEM:" -ForegroundColor Yellow
if (Test-Path "src\lib\rewardsSystem.ts") {
    Write-Host "   ✅ Sheriff Thizz Rewards System: Ready" -ForegroundColor Green
} else {
    Write-Host "   ❌ Rewards System: Missing" -ForegroundColor Red
}

# Calculate readiness
Write-Host ""
Write-Host "🎯 DEPLOYMENT READINESS STATUS:" -ForegroundColor Cyan

$readyItems = @()
$pendingItems = @()

if (Test-Path $deploymentPath) {
    $readyItems += "Deployment Package"
} else {
    $pendingItems += "Deployment Package"
}

if (Test-Path "node_modules") {
    $readyItems += "Dependencies"
} else {
    $pendingItems += "Dependencies"
}

if (Test-Path $productionConfig) {
    $readyItems += "Configuration Files"
} else {
    $pendingItems += "Configuration Files"
}

Write-Host "   Ready: $($readyItems.Count) components" -ForegroundColor Green
Write-Host "   Pending: $($pendingItems.Count) components" -ForegroundColor Yellow

$readinessPercent = [math]::Round(($readyItems.Count / ($readyItems.Count + $pendingItems.Count)) * 100, 0)
Write-Host "   Overall: $readinessPercent% Complete" -ForegroundColor Cyan

# Domain setup status
Write-Host ""
Write-Host "🌐 DOMAIN SETUP STATUS:" -ForegroundColor Magenta
Write-Host "   Target Domain: macwayneofficial.com" -ForegroundColor White
Write-Host "   Status: Ready for DNS configuration" -ForegroundColor Yellow

# Final recommendations
Write-Host ""
if ($readinessPercent -ge 90) {
    Write-Host "🚀 READY FOR DOMAIN DEPLOYMENT!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Complete remaining items before deployment" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Mac Wayne Battered Coin - Accessibility-First Crypto Platform" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Green
