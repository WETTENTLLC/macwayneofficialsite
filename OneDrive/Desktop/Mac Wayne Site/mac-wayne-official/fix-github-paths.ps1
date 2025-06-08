# CSS and JavaScript Path Fix Script for GitHub Pages
# This script ensures all CSS and JavaScript paths use absolute URLs for GitHub Pages

Write-Host "Starting CSS and JavaScript Path Fix Script..." -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Base directory
$baseDir = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official"
$repoName = "macwayneofficialsite" # GitHub repository name

# Function to fix paths in HTML files
function Fix-Paths {
    param (
        [string]$filePath,
        [string]$repoName
    )
    
    Write-Host "Processing: $filePath" -ForegroundColor Yellow
    
    # Get the file content
    $content = Get-Content -Path $filePath -Raw
    
    # Store original content to check if changes were made
    $originalContent = $content
    
    # Remove any existing base tags
    $content = $content -replace '<base\s+href="[^"]+"\s*>', ''
    
    # Fix CSS paths
    $content = $content -replace 'href="styles/', "href=`"/$repoName/styles/"
    
    # Fix JavaScript paths
    $content = $content -replace 'src="js/', "src=`"/$repoName/js/"
    
    # Fix image paths
    $content = $content -replace 'src="public/Images/', "src=`"/$repoName/public/Images/"
    $content = $content -replace 'src="public/images/', "src=`"/$repoName/public/images/"
    $content = $content -replace 'src="images/', "src=`"/$repoName/images/"
    
    # Fix favicon paths
    $content = $content -replace 'href="favicon.ico"', "href=`"/$repoName/favicon.ico`""
    
    # Fix navigation paths - but not for anchor links
    $content = $content -replace 'href="([^#"][^"]+.html[^"]*)"', "href=`"/$repoName/`$1`""
      # Fix background image URLs in inline styles (if any)
    $content = $content -replace 'url\([''"]?public/', "url(/$repoName/public/"
    $content = $content -replace 'url\([''"]?images/', "url(/$repoName/images/"
    
    # Write the content back to the file if changes were made
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content -Force
        Write-Host "   ✅ Paths fixed" -ForegroundColor Green
        return $true
    } else {
        Write-Host "   ⏩ No path changes needed" -ForegroundColor Gray
        return $false
    }
}

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $baseDir -Filter "*.html" -File -Recurse

# Counter for changed files
$changedFiles = 0

# Process each HTML file
foreach ($file in $htmlFiles) {
    $wasChanged = Fix-Paths -filePath $file.FullName -repoName $repoName
    if ($wasChanged) {
        $changedFiles++
    }
}

Write-Host "`nPath Fix Summary:" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Total HTML files processed: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Files with paths fixed: $changedFiles" -ForegroundColor Green

Write-Host "`nInstructions for GitHub Pages Deployment:" -ForegroundColor Yellow
Write-Host "1. Commit these changes:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Fix CSS and JavaScript paths for GitHub Pages'" -ForegroundColor Gray
Write-Host "2. Push to GitHub:" -ForegroundColor White
Write-Host "   git push origin master" -ForegroundColor Gray
Write-Host "3. Wait for GitHub Pages to rebuild (usually 1-2 minutes)" -ForegroundColor White
Write-Host "4. Test the site at: https://wettentllc.github.io/macwayneofficialsite/" -ForegroundColor White

Write-Host "`nScript completed!" -ForegroundColor Green
