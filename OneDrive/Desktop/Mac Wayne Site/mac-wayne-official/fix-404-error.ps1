# 404 Error Fix for Battered Coin Page

This script will help fix the 404 error when accessing the Battered Coin page.

Write-Host "Starting 404 Error Fix Process..." -ForegroundColor Cyan

# Variables
$repoUrl = "https://github.com/WETTENTLLC/macwayneofficialsite.git"
$branchName = "master"
$cleanDirName = "fix-404-deploy"

# Create a fresh deployment directory
Write-Host "1. Creating fresh deployment directory..." -ForegroundColor Green
$fixDeployPath = Join-Path -Path (Get-Location).Path -ChildPath $cleanDirName

if (Test-Path $fixDeployPath) {
    Write-Host "   Directory already exists. Removing it..." -ForegroundColor Yellow
    Remove-Item -Path $fixDeployPath -Recurse -Force
}

New-Item -Path $fixDeployPath -ItemType Directory | Out-Null
Write-Host "   Fresh deployment directory created at: $fixDeployPath" -ForegroundColor Green

# Copy only necessary files
Write-Host "2. Copying essential files..." -ForegroundColor Green

# Create .gitignore file first
$gitignoreContent = @"
# Dependency directories
node_modules/
**/node_modules/
**/.next/
**/out/
**/dist/

# Large files
*.node
*.exe
*.dll
*.so
*.dylib
*.zip
*.rar
*.tar.gz
*.7z
*.mp4
*.mov
*.avi
*.webm
*.psd
*.ai
*.large

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
/build
/dist
/.next/
/out/

# IDE and editor files
.idea/
.vscode/
*.swp
*.swo
"@

Set-Content -Path (Join-Path -Path $fixDeployPath -ChildPath ".gitignore") -Value $gitignoreContent
Write-Host "   Created .gitignore file to exclude large files" -ForegroundColor Green

# Copy essential web files
$essentialPatterns = @(
    "*.html", 
    "*.css", 
    "*.js", 
    "*.json", 
    "*.md", 
    "*.txt", 
    "*.svg", 
    "*.png", 
    "*.jpg", 
    "*.jpeg", 
    "*.gif", 
    "*.ico",
    "CNAME"
)

foreach ($pattern in $essentialPatterns) {
    Copy-Item -Path $pattern -Destination $fixDeployPath -Recurse -ErrorAction SilentlyContinue
}

# Copy specific directories, excluding node_modules
$directoriesToCopy = @(
    "js",
    "css",
    "images",
    "styles",
    "public",
    "assets"
)

foreach ($dir in $directoriesToCopy) {
    if (Test-Path $dir) {
        $targetDir = Join-Path -Path $fixDeployPath -ChildPath $dir
        New-Item -Path $targetDir -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
        
        # Copy all files from the directory except those in node_modules
        Get-ChildItem -Path $dir -Recurse | Where-Object {
            $_.FullName -notlike "*node_modules*" -and
            $_.FullName -notlike "*.next*" -and
            $_.Length -lt 90000000  # Less than 90MB to be safe
        } | ForEach-Object {
            $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
            $targetPath = Join-Path -Path $fixDeployPath -ChildPath $relativePath
            $targetDir = Split-Path -Path $targetPath -Parent
            
            if (!(Test-Path $targetDir)) {
                New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
            }
            
            Copy-Item -Path $_.FullName -Destination $targetPath -Force
        }
    }
}

# Ensure CNAME file exists with correct content
Write-Host "   Creating CNAME file..." -ForegroundColor Yellow
Set-Content -Path (Join-Path -Path $fixDeployPath -ChildPath "CNAME") -Value "macwayneofficial.com"

# Create a duplicate of battered-coin.html with lowercase name (in case of case sensitivity issues)
Write-Host "   Creating case variations of battered-coin.html..." -ForegroundColor Yellow
$batteredCoinPath = Join-Path -Path (Get-Location).Path -ChildPath "battered-coin.html"

if (Test-Path $batteredCoinPath) {
    # Create lowercase variant
    Copy-Item -Path $batteredCoinPath -Destination (Join-Path -Path $fixDeployPath -ChildPath "battered-coin.html") -Force
    # Create alternate case variants to ensure one matches
    Copy-Item -Path $batteredCoinPath -Destination (Join-Path -Path $fixDeployPath -ChildPath "BatteredCoin.html") -Force
    Copy-Item -Path $batteredCoinPath -Destination (Join-Path -Path $fixDeployPath -ChildPath "batteredcoin.html") -Force
    Copy-Item -Path $batteredCoinPath -Destination (Join-Path -Path $fixDeployPath -ChildPath "BATTERED-COIN.html") -Force
}

# Create an index file in the root that redirects to the correct file
$redirectHtml = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Redirecting to Battered Coin</title>
    <meta http-equiv="refresh" content="0; url=battered-coin.html">
    <script>window.location.href = "battered-coin.html";</script>
</head>
<body>
    <p>Redirecting to <a href="battered-coin.html">Battered Coin</a>...</p>
</body>
</html>
"@

Set-Content -Path (Join-Path -Path $fixDeployPath -ChildPath "battered-coin-redirect.html") -Value $redirectHtml

Write-Host "   Files copied to directory." -ForegroundColor Green

# Navigate to deployment directory
Set-Location -Path $fixDeployPath

# Initialize git repository
Write-Host "3. Initializing git repository..." -ForegroundColor Green
git init
Write-Host "   Git repository initialized." -ForegroundColor Green

# Add all files
Write-Host "4. Adding all files to git..." -ForegroundColor Green
git add .
Write-Host "   All files added." -ForegroundColor Green

# Commit changes
Write-Host "5. Committing changes..." -ForegroundColor Green
$commitMessage = "Fix 404 error for Battered Coin page"
git commit -m $commitMessage
Write-Host "   Changes committed with message: $commitMessage" -ForegroundColor Green

# Add remote
Write-Host "6. Configuring remote repository..." -ForegroundColor Green
git remote add origin $repoUrl
Write-Host "   Remote 'origin' added: $repoUrl" -ForegroundColor Green

# Create branch and force push to GitHub
Write-Host "7. Creating and pushing to GitHub..." -ForegroundColor Green
git branch -M $branchName
Write-Host "   Created branch: $branchName" -ForegroundColor Green

$confirmForce = Read-Host "Do you want to force push? This will overwrite remote repository. (y/n)"
if ($confirmForce -eq "y") {
    $pushCommand = "git push -f -u origin $branchName"
    Write-Host "   Running: $pushCommand" -ForegroundColor Gray
    Invoke-Expression $pushCommand
} else {
    Write-Host "   Force push cancelled. Trying normal push..." -ForegroundColor Yellow
    $pushCommand = "git push -u origin $branchName"
    Write-Host "   Running: $pushCommand" -ForegroundColor Gray
    Invoke-Expression $pushCommand
}

# Return to original directory
Set-Location -Path (Split-Path -Parent $fixDeployPath)

Write-Host "`nNEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Go to your GitHub repository: $repoUrl" -ForegroundColor White
Write-Host "2. Click on 'Settings' tab" -ForegroundColor White
Write-Host "3. In the left sidebar, click on 'Pages'" -ForegroundColor White
Write-Host "4. Verify your settings:" -ForegroundColor White
Write-Host "   - Source: Deploy from a branch" -ForegroundColor Yellow
Write-Host "   - Branch: $branchName / (root)" -ForegroundColor Yellow
Write-Host "   - Custom domain: macwayneofficial.com" -ForegroundColor Yellow
Write-Host "   - Enforce HTTPS: Checked (if available)" -ForegroundColor Yellow
Write-Host "5. Wait a few minutes for the deployment to complete" -ForegroundColor White
Write-Host "6. Try accessing these URLs:" -ForegroundColor White
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/battered-coin.html" -ForegroundColor Yellow
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/BatteredCoin.html" -ForegroundColor Yellow
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/batteredcoin.html" -ForegroundColor Yellow
Write-Host "   - https://wettentllc.github.io/macwayneofficialsite/battered-coin-redirect.html" -ForegroundColor Yellow
Write-Host "   - https://macwayneofficial.com/battered-coin.html" -ForegroundColor Yellow

Write-Host "`nScript completed successfully!" -ForegroundColor Green
