# Cleanup Script for Next.js to Static Conversion
# This script removes Next.js specific files after conversion

Write-Host "🧹 Cleaning up Next.js files..." -ForegroundColor Yellow

# Remove Next.js specific files
$nextjsFiles = @(
    "next.config.js",
    "next-env.d.ts", 
    "tsconfig.json",
    "eslint.config.mjs",
    "postcss.config.mjs",
    "package.json",
    "package-lock.json"
)

foreach ($file in $nextjsFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "❌ Removed: $file" -ForegroundColor Red
    }
}

# Remove Next.js directories
$nextjsDirs = @(
    ".next",
    "node_modules", 
    "out",
    "src"
)

foreach ($dir in $nextjsDirs) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "📁❌ Removed directory: $dir" -ForegroundColor Red
    }
}

# Remove old preview files
$previewFiles = @(
    "preview.html",
    "preview-controls.html", 
    "updated-preview.html"
)

foreach ($file in $previewFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "❌ Removed preview file: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Cleanup complete! Static site is ready." -ForegroundColor Green
Write-Host ""
Write-Host "📁 Remaining files:" -ForegroundColor Cyan
Get-ChildItem -Name | Where-Object { $_ -notlike ".*" } | Sort-Object

Write-Host ""
Write-Host "🚀 Your static site is now ready for deployment!" -ForegroundColor Green
Write-Host "📋 Main pages: index.html, shop.html, documentary.html" -ForegroundColor Cyan
