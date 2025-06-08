Write-Host "Updating CSS and JS paths in all battered-coin variants..." -ForegroundColor Cyan

# List of all battered-coin variants
$variants = @(
    "battered-coin.html",
    "Battered-coin.html",
    "Battered-Coin.html",
    "BATTERED-COIN.html",
    "batteredcoin.html",
    "BatteredCoin.html"
)

# Base directory
$baseDir = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official"

# Original file content (source of truth)
$sourceFile = Join-Path -Path $baseDir -ChildPath "battered-coin.html"
$content = Get-Content -Path $sourceFile -Raw

# Copy the fixed content to all variants
foreach ($variant in $variants) {
    $targetPath = Join-Path -Path $baseDir -ChildPath $variant
    
    if ($variant -ne "battered-coin.html" -and (Test-Path $targetPath)) {
        Set-Content -Path $targetPath -Value $content -Force
        Write-Host "Updated paths in variant: $variant" -ForegroundColor Green
    }
}

Write-Host "`nAll variants have been updated with proper CSS and JS paths." -ForegroundColor Green
Write-Host "Now push these changes to GitHub with the following commands:" -ForegroundColor Yellow
Write-Host "git add ." -ForegroundColor White
Write-Host "git commit -m 'Fix paths in all battered-coin variants'" -ForegroundColor White
Write-Host "git push origin master" -ForegroundColor White
