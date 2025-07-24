# Mac Wayne Battered Coin - Quick Deployment Verification Script (PowerShell)
# Run this script after uploading to verify everything is working

Write-Host "🚀 Mac Wayne Battered Coin - Deployment Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Get domain from user
$Domain = Read-Host "Enter your domain (e.g., macwayneofficial.com)"

if ([string]::IsNullOrEmpty($Domain)) {
    Write-Host "❌ Domain is required" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔍 Testing domain: $Domain`n" -ForegroundColor Yellow

# Function to test URL
function Test-Url {
    param(
        [string]$Url,
        [string]$Name
    )
    
    Write-Host "Testing $Name... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri "https://$Url" -Method Head -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -in @(200, 301, 302)) {
            Write-Host "✅ PASS" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ FAIL" -ForegroundColor Red
        return $false
    }
}

# Function to test SSL
function Test-SSL {
    param([string]$Domain)
    
    Write-Host "Testing SSL certificate... " -NoNewline
    
    try {
        $request = [System.Net.WebRequest]::Create("https://$Domain")
        $request.Timeout = 10000
        $response = $request.GetResponse()
        $response.Close()
        Write-Host "✅ VALID" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ INVALID" -ForegroundColor Red
        return $false
    }
}

# Run tests
Write-Host "🔍 Running Basic Connectivity Tests:" -ForegroundColor Cyan
Test-Url "$Domain" "Main Site"
Test-Url "$Domain/battered-coin.html" "Battered Coin Page"
Test-Url "$Domain/verify-deployment.html" "Verification Page"

Write-Host "`n🔒 Testing SSL/HTTPS:" -ForegroundColor Cyan
Test-SSL $Domain

Write-Host "`n📱 Testing Response Headers:" -ForegroundColor Cyan
try {
    $headers = (Invoke-WebRequest -Uri "https://$Domain" -Method Head -TimeoutSec 10).Headers
    
    Write-Host "Checking HSTS header... " -NoNewline
    if ($headers.ContainsKey('Strict-Transport-Security')) {
        Write-Host "✅ PRESENT" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MISSING" -ForegroundColor Yellow
    }
    
    Write-Host "Checking Content-Security-Policy... " -NoNewline
    if ($headers.ContainsKey('Content-Security-Policy')) {
        Write-Host "✅ PRESENT" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MISSING" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Could not check headers" -ForegroundColor Red
}

Write-Host "`n🎯 JavaScript/API Tests:" -ForegroundColor Cyan
Write-Host "Testing JavaScript execution... " -NoNewline
try {
    $content = Invoke-WebRequest -Uri "https://$Domain" -TimeoutSec 10
    if ($content.Content -match "production-config.js") {
        Write-Host "✅ CONFIG LOADED" -ForegroundColor Green
    } else {
        Write-Host "❌ CONFIG MISSING" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ FAILED TO LOAD" -ForegroundColor Red
}

Write-Host "`n📊 Performance Quick Check:" -ForegroundColor Cyan
Write-Host "Measuring page load time... " -NoNewline
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri "https://$Domain" -TimeoutSec 10
    $stopwatch.Stop()
    $loadTime = [math]::Round($stopwatch.Elapsed.TotalSeconds, 2)
    
    Write-Host "$loadTime`s" -ForegroundColor Green
    
    if ($loadTime -lt 3.0) {
        Write-Host "✅ Load time acceptable (<3s)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Load time slow (>3s)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
}

Write-Host "`n🎉 DEPLOYMENT VERIFICATION COMPLETE!" -ForegroundColor Cyan
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit https://$Domain/verify-deployment.html for detailed testing"
Write-Host "2. Update production-config.js with real API keys"
Write-Host "3. Test wallet connectivity and cryptocurrency features"
Write-Host "4. Run full Lighthouse audit"
Write-Host "`n🚀 Ready for launch when all tests pass!" -ForegroundColor Green

# Pause to keep window open
Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
