# Clear Browser Cache for Battered Coin Page Testing
Write-Host "🚀 Clearing browser cache for Battered Coin page..." -ForegroundColor Cyan

# Add timestamp to CSS files to force reload
$timestamp = [int][double]::Parse((Get-Date -UFormat %s))

Write-Host "Adding cache-busting timestamp: $timestamp" -ForegroundColor Yellow

# Update the battered-coin.html file to include timestamp in CSS links
$batteredCoinPath = "battered-coin.html"

if (Test-Path $batteredCoinPath) {
    $content = Get-Content $batteredCoinPath -Raw
    
    # Update CSS links with timestamp
    $content = $content -replace 'href="css/cyber-theme\.css"', "href=`"css/cyber-theme.css?v=$timestamp`""
    $content = $content -replace 'href="styles/main\.css"', "href=`"styles/main.css?v=$timestamp`""
    $content = $content -replace 'href="css/macwayne-audio-player\.css"', "href=`"css/macwayne-audio-player.css?v=$timestamp`""
    
    Set-Content $batteredCoinPath -Value $content -NoNewline
    
    Write-Host "✅ Updated battered-coin.html with cache-busting timestamps" -ForegroundColor Green
} else {
    Write-Host "❌ battered-coin.html not found" -ForegroundColor Red
}

Write-Host "`n📋 To see the cyber theme changes:" -ForegroundColor White
Write-Host "1. Close your browser completely" -ForegroundColor Yellow
Write-Host "2. Reopen browser" -ForegroundColor Yellow
Write-Host "3. Press Ctrl+Shift+R (hard refresh) on the Battered Coin page" -ForegroundColor Yellow
Write-Host "4. Or try opening in an incognito/private window" -ForegroundColor Yellow

Write-Host "`n🎯 The cyber theme includes:" -ForegroundColor Cyan
Write-Host "- Animated matrix rain background" -ForegroundColor White
Write-Host "- Glowing cyan/purple grid patterns" -ForegroundColor White
Write-Host "- Orbitron sci-fi font" -ForegroundColor White
Write-Host "- Glitch text effects on headings" -ForegroundColor White
Write-Host "- Neon cyber buttons with hover effects" -ForegroundColor White
Write-Host "- Floating card animations" -ForegroundColor White
Write-Host "- Holographic color gradients" -ForegroundColor White

Write-Host "`n🔧 If you still don't see changes, the issue might be:" -ForegroundColor Magenta
Write-Host "- Browser cache (try incognito mode)" -ForegroundColor White
Write-Host "- CSS file not loading (check Developer Tools > Network tab)" -ForegroundColor White
Write-Host "- JavaScript console errors (check Developer Tools > Console)" -ForegroundColor White
