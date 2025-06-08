# Battered Coin Page Fix Script
# This script creates case-insensitive versions of the battered-coin.html file

Write-Host "Creating case-insensitive versions of battered-coin.html..." -ForegroundColor Cyan

# Original file path
$originalFile = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\battered-coin.html"

# Verify the original file exists
if (-not (Test-Path $originalFile)) {
    Write-Host "ERROR: Original file not found at: $originalFile" -ForegroundColor Red
    exit 1
}

# Create all possible case variations
$variations = @(
    "battered-coin.html",
    "Battered-coin.html",
    "Battered-Coin.html",
    "BATTERED-COIN.html",
    "batteredcoin.html",
    "BatteredCoin.html"
)

foreach ($variation in $variations) {
    $targetPath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\$variation"
    if ($variation -ne "battered-coin.html") {
        Copy-Item -Path $originalFile -Destination $targetPath -Force
        Write-Host "Created variant: $variation" -ForegroundColor Green
    }
}

# Create a redirect index file in the root
$redirectHtml = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mac Wayne - Battered Coin</title>
    <meta http-equiv="refresh" content="0; url=battered-coin.html">
    <script>window.location.href = "battered-coin.html";</script>
</head>
<body>
    <p>Redirecting to <a href="battered-coin.html">Battered Coin</a>...</p>
</body>
</html>
"@

Set-Content -Path "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\battered-coin-redirect.html" -Value $redirectHtml
Write-Host "Created redirect file: battered-coin-redirect.html" -ForegroundColor Green

Write-Host "`nNow push these files to GitHub with the following commands:" -ForegroundColor Yellow
Write-Host "git add ." -ForegroundColor White
Write-Host "git commit -m 'Add case-insensitive variants of battered-coin.html'" -ForegroundColor White
Write-Host "git push origin master" -ForegroundColor White

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Run the above git commands to push the changes" -ForegroundColor White
Write-Host "2. Wait for GitHub Pages to rebuild (usually takes a few minutes)" -ForegroundColor White
Write-Host "3. Test all these URLs:" -ForegroundColor White
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/battered-coin.html" -ForegroundColor White
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/Battered-Coin.html" -ForegroundColor White
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/battered-coin-redirect.html" -ForegroundColor White
