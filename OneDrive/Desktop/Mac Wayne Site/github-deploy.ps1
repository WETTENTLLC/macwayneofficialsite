# GitHub Repository Push Script for Mac Wayne Official Site
# This script helps push the site to GitHub for GitHub Pages deployment

Write-Host "Starting GitHub Repository Push Process..." -ForegroundColor Cyan

# Variables - UPDATE THESE WITH YOUR ACTUAL VALUES
$repoUrl = "https://github.com/WETTENTLLC/macwayneofficialsite.git"
$branchName = "main"

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git first." -ForegroundColor Red
    Exit
}

# Check if we're in the right directory
$currentDir = Split-Path -Path (Get-Location) -Leaf
if ($currentDir -ne "mac-wayne-official") {
    Write-Host "You might not be in the correct directory. Make sure you're in the mac-wayne-official folder." -ForegroundColor Yellow
    $proceed = Read-Host "Do you want to proceed anyway? (y/n)"
    if ($proceed -ne "y") {
        Exit
    }
}

# Step 1: Initialize git if not already
Write-Host "1. Initializing git repository..." -ForegroundColor Green
if (!(Test-Path .git)) {
    git init
    Write-Host "   Git repository initialized." -ForegroundColor Green
} else {
    Write-Host "   Git repository already exists." -ForegroundColor Green
}

# Step 2: Add all files
Write-Host "2. Adding all files to git..." -ForegroundColor Green
git add .
Write-Host "   All files added." -ForegroundColor Green

# Step 3: Commit changes
Write-Host "3. Committing changes..." -ForegroundColor Green
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if (!$commitMessage) {
    $commitMessage = "Deploy Mac Wayne Battered Coin website with Sheriff Thizz Rewards System"
}
git commit -m $commitMessage
Write-Host "   Changes committed with message: $commitMessage" -ForegroundColor Green

# Step 4: Add remote if not already
Write-Host "4. Configuring remote repository..." -ForegroundColor Green
$remotes = git remote
if ($remotes -notcontains "origin") {
    git remote add origin $repoUrl
    Write-Host "   Remote 'origin' added: $repoUrl" -ForegroundColor Green
} else {
    Write-Host "   Remote 'origin' already exists." -ForegroundColor Green
    $currentRemote = git remote get-url origin
    if ($currentRemote -ne $repoUrl) {
        Write-Host "   Current remote URL: $currentRemote" -ForegroundColor Yellow
        Write-Host "   Expected remote URL: $repoUrl" -ForegroundColor Yellow
        $updateRemote = Read-Host "Do you want to update the remote URL? (y/n)"
        if ($updateRemote -eq "y") {
            git remote set-url origin $repoUrl
            Write-Host "   Remote URL updated." -ForegroundColor Green
        }
    }
}

# Step 5: Push to GitHub
Write-Host "5. Pushing to GitHub..." -ForegroundColor Green
$pushCommand = "git push -u origin $branchName"
Write-Host "   Running: $pushCommand" -ForegroundColor Gray
Invoke-Expression $pushCommand

# Step 6: Instructions for GitHub Pages setup
Write-Host "`nNEXT STEPS FOR GITHUB PAGES SETUP:" -ForegroundColor Cyan
Write-Host "1. Go to your GitHub repository: $repoUrl" -ForegroundColor White
Write-Host "2. Click on 'Settings' tab" -ForegroundColor White
Write-Host "3. In the left sidebar, click on 'Pages'" -ForegroundColor White
Write-Host "4. Under 'Source', select 'GitHub Actions'" -ForegroundColor White
Write-Host "5. This will use our existing workflow file" -ForegroundColor White
Write-Host "6. Your site will be available at: https://wettentllc.github.io/macwayneofficialsite/" -ForegroundColor White

# Step 7: Instructions for Namecheap domain setup
Write-Host "`nNAMECHEAP DOMAIN CONFIGURATION:" -ForegroundColor Cyan
Write-Host "1. Log in to your Namecheap account" -ForegroundColor White
Write-Host "2. Go to Domain List and select macwayneofficial.com" -ForegroundColor White
Write-Host "3. Click 'Manage' and then 'Advanced DNS'" -ForegroundColor White
Write-Host "4. Add these records:" -ForegroundColor White
Write-Host "   A Record: @ -> 185.199.108.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.109.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.110.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   A Record: @ -> 185.199.111.153 (GitHub Pages IP)" -ForegroundColor Yellow
Write-Host "   CNAME Record: www -> wettentllc.github.io" -ForegroundColor Yellow
Write-Host "5. Wait for DNS propagation (up to 48 hours)" -ForegroundColor White

# Step 8: Final verification steps
Write-Host "`nFINAL VERIFICATION CHECKLIST:" -ForegroundColor Cyan
Write-Host "□ GitHub Pages is enabled and deployed" -ForegroundColor White
Write-Host "□ Website loads at https://wettentllc.github.io/macwayneofficialsite/" -ForegroundColor White
Write-Host "□ Domain macwayneofficial.com points to GitHub Pages" -ForegroundColor White
Write-Host "□ Sheriff Thizz Rewards System is working" -ForegroundColor White
Write-Host "□ Battered Coin page is accessible from main navigation" -ForegroundColor White
Write-Host "□ WalletConnect functionality is working" -ForegroundColor White

Write-Host "`nScript completed successfully!" -ForegroundColor Green
