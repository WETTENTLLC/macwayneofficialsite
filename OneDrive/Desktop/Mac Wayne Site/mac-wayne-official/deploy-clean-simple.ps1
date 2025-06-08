# Clean GitHub Pages Deployment Script
# This script only adds essential files and avoids large directories

Write-Host "Preparing clean deployment for GitHub Pages..." -ForegroundColor Cyan

# Remove problematic directories from tracking
Remove-Item -Path "clean-deploy" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "deploy-battered-fix" -Recurse -Force -ErrorAction SilentlyContinue

# Convert paths for GitHub Pages deployment
Write-Host "Converting paths for GitHub Pages..." -ForegroundColor Yellow

$htmlFiles = @(
    "index.html",
    "battered-coin.html", 
    "live.html",
    "shop.html",
    "documentary.html",
    "batteredcoin.html",
    "battered-coin-redirect.html"
)

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "  Processing: $file" -ForegroundColor Gray
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Convert relative paths to GitHub Pages absolute paths
        $content = $content -replace 'href="styles/', 'href="/macwayneofficialsite/styles/'
        $content = $content -replace 'src="scripts/', 'src="/macwayneofficialsite/scripts/'
        $content = $content -replace 'src="js/', 'src="/macwayneofficialsite/js/'
        $content = $content -replace 'src="public/', 'src="/macwayneofficialsite/public/'
        $content = $content -replace 'href="public/', 'href="/macwayneofficialsite/public/'
        
        # Fix navigation links for GitHub Pages
        $content = $content -replace 'href="index\.html"', 'href="/macwayneofficialsite/index.html"'
        $content = $content -replace 'href="live\.html"', 'href="/macwayneofficialsite/live.html"'
        $content = $content -replace 'href="shop\.html"', 'href="/macwayneofficialsite/shop.html"'
        $content = $content -replace 'href="battered-coin\.html"', 'href="/macwayneofficialsite/battered-coin.html"'
        $content = $content -replace 'href="documentary\.html"', 'href="/macwayneofficialsite/documentary.html"'
        
        # Write back to file
        $content | Out-File -FilePath $file -Encoding UTF8 -NoNewline
    }
}

# Add only essential files
Write-Host "Adding essential files..." -ForegroundColor Yellow

git add *.html
git add styles/
git add public/
git add js/
git add CNAME
git add README.md

# Commit changes
$commitMessage = "Deploy Mac Wayne site with proper CSS styling and image centering - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Site will be available at: https://wettentllc.github.io/macwayneofficialsite/" -ForegroundColor Green
