# CSS Path Fix Script for Battered Coin Page
# This script checks and fixes CSS path references

Write-Host "Fixing CSS path references in Battered Coin page..." -ForegroundColor Cyan

# File path
$batteredCoinPath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\battered-coin.html"

# Verify the file exists
if (-not (Test-Path $batteredCoinPath)) {
    Write-Host "ERROR: File not found at: $batteredCoinPath" -ForegroundColor Red
    exit 1
}

# Read the content of the file
$content = Get-Content -Path $batteredCoinPath -Raw

# Check if CSS references are relative
$hasRelativePathsAlready = $content -match '<link rel="stylesheet" href="styles/'

# Fix CSS references if needed
if ($hasRelativePathsAlready) {
    Write-Host "CSS references are already using relative paths." -ForegroundColor Green
    
    # Also check if files exist
    $stylesDir = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\styles"
    $cssFiles = @("main.css", "components.css", "animations.css")
    
    foreach ($cssFile in $cssFiles) {
        $cssPath = Join-Path -Path $stylesDir -ChildPath $cssFile
        if (-not (Test-Path $cssPath)) {
            Write-Host "WARNING: CSS file not found: $cssPath" -ForegroundColor Yellow
        } else {
            Write-Host "CSS file exists: $cssPath" -ForegroundColor Green
        }
    }
} else {
    Write-Host "Fixing CSS references to use relative paths..." -ForegroundColor Yellow
    
    # Update CSS references to use relative paths
    $content = $content -replace '<link rel="stylesheet" href="/styles/', '<link rel="stylesheet" href="styles/'
    $content = $content -replace '<link rel="stylesheet" href="https://macwayneofficial.com/styles/', '<link rel="stylesheet" href="styles/'
    
    # Save the updated content
    Set-Content -Path $batteredCoinPath -Value $content
    Write-Host "CSS references updated in the file." -ForegroundColor Green
}

# Double-check GitHub Pages base path
if ($content -match '<base href="') {
    Write-Host "File contains <base> tag. Updating to correct GitHub Pages URL..." -ForegroundColor Yellow
    $content = $content -replace '<base href="[^"]*"', '<base href="https://wettentllc.github.io/macwayneofficialsite/"'
    Set-Content -Path $batteredCoinPath -Value $content
    Write-Host "Updated <base> tag to correct GitHub Pages URL." -ForegroundColor Green
} else {
    Write-Host "Adding <base> tag for GitHub Pages..." -ForegroundColor Yellow
    $content = $content -replace '<head>', '<head>
    <base href="https://wettentllc.github.io/macwayneofficialsite/">'
    Set-Content -Path $batteredCoinPath -Value $content
    Write-Host "Added <base> tag for GitHub Pages." -ForegroundColor Green
}

# Create inline CSS backup
Write-Host "Creating inline CSS backup version..." -ForegroundColor Yellow

# Read CSS files
$mainCssPath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\styles\main.css"
$componentsCssPath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\styles\components.css"
$animationsCssPath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\styles\animations.css"

$mainCss = ""
$componentsCss = ""
$animationsCss = ""

if (Test-Path $mainCssPath) {
    $mainCss = Get-Content -Path $mainCssPath -Raw
}
if (Test-Path $componentsCssPath) {
    $componentsCss = Get-Content -Path $componentsCssPath -Raw
}
if (Test-Path $animationsCssPath) {
    $animationsCss = Get-Content -Path $animationsCssPath -Raw
}

# Create backup file with inline CSS
$backupContent = $content -replace '</head>', "<style>
/* Main CSS */
$mainCss

/* Components CSS */
$componentsCss

/* Animations CSS */
$animationsCss
</style>
</head>"

$backupFilePath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\mac-wayne-official\battered-coin-inline-css.html"
Set-Content -Path $backupFilePath -Value $backupContent
Write-Host "Created backup file with inline CSS: $backupFilePath" -ForegroundColor Green

Write-Host "`nNow push these changes to GitHub with the following commands:" -ForegroundColor Yellow
Write-Host "git add ." -ForegroundColor White
Write-Host "git commit -m 'Fix CSS paths and add inline CSS backup for Battered Coin page'" -ForegroundColor White
Write-Host "git push origin master" -ForegroundColor White

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Run the above git commands to push the changes" -ForegroundColor White
Write-Host "2. Wait for GitHub Pages to rebuild (usually takes a few minutes)" -ForegroundColor White
Write-Host "3. Test these URLs:" -ForegroundColor White
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/battered-coin.html" -ForegroundColor White
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/battered-coin-inline-css.html" -ForegroundColor White
