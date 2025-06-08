# Clean Deployment Script for GitHub Pages (Updated)
# This script handles the issue with large files by creating a clean deployment version

Write-Host "Starting Clean Deployment Process..." -ForegroundColor Cyan

# Variables - UPDATE THESE WITH YOUR ACTUAL VALUES
$repoUrl = "https://github.com/WETTENTLLC/macwayneofficialsite.git"
$branchName = "master" # Changed from main to master
$cleanDirName = "clean-deploy"

# Create clean deployment directory
Write-Host "1. Creating clean deployment directory..." -ForegroundColor Green
$cleanDeployPath = Join-Path -Path (Get-Location).Path -ChildPath $cleanDirName

if (Test-Path $cleanDeployPath) {
    Write-Host "   Clean directory already exists. Removing it..." -ForegroundColor Yellow
    Remove-Item -Path $cleanDeployPath -Recurse -Force
}

New-Item -Path $cleanDeployPath -ItemType Directory | Out-Null
Write-Host "   Clean deployment directory created at: $cleanDeployPath" -ForegroundColor Green

# Copy only necessary files, excluding large files and node_modules
Write-Host "2. Copying essential files to clean directory..." -ForegroundColor Green

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

Set-Content -Path (Join-Path -Path $cleanDeployPath -ChildPath ".gitignore") -Value $gitignoreContent
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
    Copy-Item -Path $pattern -Destination $cleanDeployPath -Recurse -ErrorAction SilentlyContinue
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
        $targetDir = Join-Path -Path $cleanDeployPath -ChildPath $dir
        New-Item -Path $targetDir -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
        
        # Copy all files from the directory except those in node_modules
        Get-ChildItem -Path $dir -Recurse | Where-Object {
            $_.FullName -notlike "*node_modules*" -and
            $_.FullName -notlike "*.next*" -and
            $_.Length -lt 90000000  # Less than 90MB to be safe
        } | ForEach-Object {
            $relativePath = $_.FullName.Substring((Get-Location).Path.Length + 1)
            $targetPath = Join-Path -Path $cleanDeployPath -ChildPath $relativePath
            $targetDir = Split-Path -Path $targetPath -Parent
            
            if (!(Test-Path $targetDir)) {
                New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
            }
            
            Copy-Item -Path $_.FullName -Destination $targetPath -Force
        }
    }
}

# Make sure CNAME file exists
if (-not (Test-Path (Join-Path -Path $cleanDeployPath -ChildPath "CNAME"))) {
    Write-Host "   Creating CNAME file..." -ForegroundColor Yellow
    Set-Content -Path (Join-Path -Path $cleanDeployPath -ChildPath "CNAME") -Value "macwayneofficial.com"
}

Write-Host "   Files copied to clean directory." -ForegroundColor Green

# Navigate to clean directory
Set-Location -Path $cleanDeployPath

# Initialize git repository
Write-Host "3. Initializing git repository in clean directory..." -ForegroundColor Green
git init
Write-Host "   Git repository initialized." -ForegroundColor Green

# Add all files
Write-Host "4. Adding all files to git..." -ForegroundColor Green
git add .
Write-Host "   All files added." -ForegroundColor Green

# Commit changes
Write-Host "5. Committing changes..." -ForegroundColor Green
$commitMessage = "Deploy Mac Wayne Battered Coin website with Sheriff Thizz Rewards System (clean version)"
git commit -m $commitMessage
Write-Host "   Changes committed with message: $commitMessage" -ForegroundColor Green

# Add remote
Write-Host "6. Configuring remote repository..." -ForegroundColor Green
git remote add origin $repoUrl
Write-Host "   Remote 'origin' added: $repoUrl" -ForegroundColor Green

# Create branch and push to GitHub
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
Set-Location -Path (Split-Path -Parent $cleanDeployPath)

# Instructions for GitHub Pages setup
Write-Host "`nNEXT STEPS FOR GITHUB PAGES SETUP:" -ForegroundColor Cyan
Write-Host "1. Go to your GitHub repository: $repoUrl" -ForegroundColor White
Write-Host "2. Click on 'Settings' tab" -ForegroundColor White
Write-Host "3. In the left sidebar, click on 'Pages'" -ForegroundColor White
Write-Host "4. Under 'Source', select 'Deploy from a branch'" -ForegroundColor White
Write-Host "5. Select branch '$branchName' and folder '/ (root)'" -ForegroundColor White
Write-Host "6. Click 'Save'" -ForegroundColor White
Write-Host "7. Your site will be available at: https://wettentllc.github.io/macwayneofficialsite/" -ForegroundColor White

# Instructions for Namecheap domain setup
Write-Host "`nNAMECHEAP DOMAIN CONFIGURATION:" -ForegroundColor Cyan
Write-Host "1. Verify your current Namecheap DNS settings:" -ForegroundColor White
Write-Host "   A Record: @ -> 185.199.108.153" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.109.153" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.110.153" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.111.153" -ForegroundColor Yellow
Write-Host "   CNAME Record: www -> wettentllc.github.io" -ForegroundColor Yellow
Write-Host "2. Remove any other conflicting DNS records" -ForegroundColor White
Write-Host "3. In GitHub repository settings, verify custom domain is set to macwayneofficial.com" -ForegroundColor White

# Final verification steps
Write-Host "`nFINAL VERIFICATION CHECKLIST:" -ForegroundColor Cyan
Write-Host "□ GitHub Pages is enabled and deployed" -ForegroundColor White
Write-Host "□ Website loads at https://wettentllc.github.io/macwayneofficialsite/" -ForegroundColor White
Write-Host "□ Domain macwayneofficial.com points to GitHub Pages" -ForegroundColor White
Write-Host "□ Sheriff Thizz Rewards System is working" -ForegroundColor White
Write-Host "□ Battered Coin page is accessible from main navigation" -ForegroundColor White
Write-Host "□ WalletConnect functionality is working" -ForegroundColor White

Write-Host "`nScript completed successfully!" -ForegroundColor Green
