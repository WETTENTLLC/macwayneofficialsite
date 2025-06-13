# Deployment Script for Mac Wayne Official Site with PayPal Integration
# This script sets up the production-ready audio player with real PayPal payments

Write-Host "🎵 Mac Wayne Official Site - Production Deployment Setup" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Step 1: Install required dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Replace the basic server with the enhanced server
Write-Host "🔧 Setting up enhanced server..." -ForegroundColor Yellow
if (Test-Path "server.js") {
    Copy-Item "server.js" "server-backup.js"
    Write-Host "✓ Backed up original server.js" -ForegroundColor Green
}

Copy-Item "server-enhanced.js" "server.js"
Write-Host "✓ Enhanced server with PayPal integration is now active" -ForegroundColor Green

# Step 3: Create sample audio files (if not already created)
Write-Host "🎼 Checking for sample audio files..." -ForegroundColor Yellow
$samplesDir = "deploy-clean/public/audio/Blind and Battered [Explicit]/samples"

if (!(Test-Path $samplesDir)) {
    Write-Host "📁 Creating samples directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $samplesDir -Force
}

$sampleFiles = Get-ChildItem -Path $samplesDir -Filter "*.mp3" | Measure-Object
if ($sampleFiles.Count -eq 0) {
    Write-Host "⚠️  No sample files found. You have several options:" -ForegroundColor Red
    Write-Host "   1. Run .\create-samples.ps1 to auto-generate 30-second samples" -ForegroundColor Yellow
    Write-Host "   2. Manually create 30-second samples and place them in:" -ForegroundColor Yellow
    Write-Host "      $samplesDir" -ForegroundColor Yellow
    Write-Host "   3. Continue with current setup (uses full tracks with 30-sec limit)" -ForegroundColor Yellow
    
    $choice = Read-Host "Choose option (1/2/3)"
    switch ($choice) {
        "1" { 
            if (Get-Command ffmpeg -ErrorAction SilentlyContinue) {
                .\create-samples.ps1
            } else {
                Write-Host "❌ FFmpeg not found. Please install FFmpeg first." -ForegroundColor Red
                Write-Host "   Download from: https://ffmpeg.org/download.html" -ForegroundColor Yellow
            }
        }
        "2" { 
            Write-Host "👍 Please create your sample files manually." -ForegroundColor Green
        }
        "3" { 
            Write-Host "👍 Continuing with full tracks (30-second preview limit)." -ForegroundColor Green
        }
        default { 
            Write-Host "👍 Continuing with current setup." -ForegroundColor Green
        }
    }
} else {
    Write-Host "✓ Found $($sampleFiles.Count) sample files" -ForegroundColor Green
}

# Step 4: Environment variables setup
Write-Host "🔐 Setting up environment variables..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: You need to configure these environment variables for production:" -ForegroundColor Red
Write-Host "1. PAYPAL_CLIENT_ID - Your PayPal application Client ID" -ForegroundColor Yellow
Write-Host "2. PAYPAL_CLIENT_SECRET - Your PayPal application Client Secret" -ForegroundColor Yellow
Write-Host "3. PAYPAL_SANDBOX_MODE - Set to 'false' for production" -ForegroundColor Yellow
Write-Host "4. EMAIL_USER - Gmail address for sending download links" -ForegroundColor Yellow
Write-Host "5. EMAIL_PASS - Gmail app password for authentication" -ForegroundColor Yellow
Write-Host "6. SITE_URL - Your production domain (e.g., https://macwayneofficial.com)" -ForegroundColor Yellow
Write-Host ""

# Step 5: Create environment file template
$envTemplate = @"
# Mac Wayne Official Site - Environment Variables
# Copy this to .env and fill in your actual values

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_SANDBOX_MODE=true

# Email Configuration (for download delivery)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Site Configuration
SITE_URL=https://macwayneofficial.com
PORT=3000
"@

$envTemplate | Out-File -FilePath ".env.template" -Encoding UTF8
Write-Host "✓ Created .env.template file" -ForegroundColor Green

# Step 6: Test server startup
Write-Host "🚀 Testing server startup..." -ForegroundColor Yellow
Write-Host "Starting server in test mode..." -ForegroundColor Gray

$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 3

if ($serverProcess -and !$serverProcess.HasExited) {
    Write-Host "✓ Server started successfully on http://localhost:3000" -ForegroundColor Green
    Write-Host "🌐 Open http://localhost:3000 in your browser to test" -ForegroundColor Cyan
    
    # Stop the test server
    $serverProcess.Kill()
    Write-Host "✓ Test server stopped" -ForegroundColor Green
} else {
    Write-Host "❌ Server failed to start. Check for errors above." -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 DEPLOYMENT SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Configure your PayPal Developer Account:" -ForegroundColor White
Write-Host "   - Go to https://developer.paypal.com/" -ForegroundColor Gray
Write-Host "   - Create an application" -ForegroundColor Gray
Write-Host "   - Get your Client ID and Client Secret" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Set up Gmail for download delivery:" -ForegroundColor White
Write-Host "   - Enable 2-factor authentication" -ForegroundColor Gray
Write-Host "   - Generate an App Password" -ForegroundColor Gray
Write-Host "   - Use the App Password as EMAIL_PASS" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Configure environment variables:" -ForegroundColor White
Write-Host "   - Copy .env.template to .env" -ForegroundColor Gray
Write-Host "   - Fill in your actual values" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the production server:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Test the complete payment flow:" -ForegroundColor White
Write-Host "   - Try purchasing a track" -ForegroundColor Gray
Write-Host "   - Verify email delivery" -ForegroundColor Gray
Write-Host "   - Test download functionality" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Features now available:" -ForegroundColor Cyan
Write-Host "✓ Real PayPal payments" -ForegroundColor Green
Write-Host "✓ Email delivery of download links" -ForegroundColor Green
Write-Host "✓ Secure download system" -ForegroundColor Green
Write-Host "✓ Purchase persistence across sessions" -ForegroundColor Green
Write-Host "✓ Individual track and full album purchases" -ForegroundColor Green
Write-Host "✓ 30-second previews for unpurchased tracks" -ForegroundColor Green
Write-Host ""
