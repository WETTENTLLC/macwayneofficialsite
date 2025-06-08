# Battered Coin Page Verification Script
# This script verifies if the Battered Coin page is loading correctly with proper CSS

Write-Host "Battered Coin Page Verification" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$batteredCoinUrl = "https://wettentllc.github.io/macwayneofficialsite/battered-coin.html"
$cssUrl1 = "https://wettentllc.github.io/macwayneofficialsite/styles/main.css"
$cssUrl2 = "https://wettentllc.github.io/macwayneofficialsite/styles/components.css"
$cssUrl3 = "https://wettentllc.github.io/macwayneofficialsite/styles/animations.css"
$jsUrl1 = "https://wettentllc.github.io/macwayneofficialsite/js/sheriff-thizz-rewards.js"

# Function to check if a URL is accessible
function Test-Url {
    param (
        [string]$url,
        [string]$description
    )
    
    try {
        $request = [System.Net.WebRequest]::Create($url)
        $request.Method = "HEAD"
        $request.Timeout = 5000 # 5 seconds timeout
        
        $response = $request.GetResponse()
        $statusCode = [int]$response.StatusCode
        $response.Close()
        
        if ($statusCode -eq 200) {
            Write-Host "✅ $description is accessible ($url)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $description returned status code: $statusCode ($url)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error accessing $description: $($_.Exception.Message) ($url)" -ForegroundColor Red
        return $false
    }
}

# Test main page
$mainPageOk = Test-Url -url $batteredCoinUrl -description "Battered Coin page"

# If main page loads, test CSS and JS files
if ($mainPageOk) {
    Write-Host "`nChecking CSS and JavaScript resources..." -ForegroundColor Yellow
    $css1Ok = Test-Url -url $cssUrl1 -description "Main CSS file"
    $css2Ok = Test-Url -url $cssUrl2 -description "Components CSS file"
    $css3Ok = Test-Url -url $cssUrl3 -description "Animations CSS file"
    $js1Ok = Test-Url -url $jsUrl1 -description "Sheriff Thizz Rewards JS file"
    
    # Calculate overall status
    $totalResources = 4
    $workingResources = 0
    if ($css1Ok) { $workingResources++ }
    if ($css2Ok) { $workingResources++ }
    if ($css3Ok) { $workingResources++ }
    if ($js1Ok) { $workingResources++ }
    
    $percentWorking = [math]::Round(($workingResources / $totalResources) * 100)
    
    Write-Host "`nVerification Results:" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    Write-Host "Main page accessible: $mainPageOk" -ForegroundColor $(if ($mainPageOk) { "Green" } else { "Red" })
    Write-Host "Resources working: $workingResources/$totalResources ($percentWorking%)" -ForegroundColor $(if ($percentWorking -eq 100) { "Green" } elseif ($percentWorking -ge 50) { "Yellow" } else { "Red" })
    
    # Provide recommendation based on results
    Write-Host "`nRecommendation:" -ForegroundColor Yellow
    if ($percentWorking -eq 100) {
        Write-Host "All resources are working correctly. The Battered Coin page should display properly." -ForegroundColor Green
    } elseif ($percentWorking -ge 50) {
        Write-Host "Some resources are missing. The Battered Coin page might display with partial styling." -ForegroundColor Yellow
        Write-Host "Run the fix-github-paths.ps1 script to fix the paths and redeploy." -ForegroundColor Yellow
    } else {
        Write-Host "Most resources are missing. The Battered Coin page will likely display without styling." -ForegroundColor Red
        Write-Host "Run the fix-github-paths.ps1 script and ensure all files are properly pushed to GitHub." -ForegroundColor Red
    }
    
    # Check domain configuration
    Write-Host "`nDomain Configuration Check:" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    Write-Host "For the domain to work correctly with GitHub Pages, verify these settings in Namecheap:" -ForegroundColor White
    Write-Host "1. Remove ALL existing DNS records first" -ForegroundColor Yellow
    Write-Host "2. Add these A Records:" -ForegroundColor White
    Write-Host "   @ -> 185.199.108.153" -ForegroundColor Gray
    Write-Host "   @ -> 185.199.109.153" -ForegroundColor Gray
    Write-Host "   @ -> 185.199.110.153" -ForegroundColor Gray
    Write-Host "   @ -> 185.199.111.153" -ForegroundColor Gray
    Write-Host "3. Add this CNAME Record:" -ForegroundColor White
    Write-Host "   www -> wettentllc.github.io" -ForegroundColor Gray
    Write-Host "4. In GitHub repo settings, ensure custom domain is set to: macwayneofficial.com" -ForegroundColor White
    
} else {
    Write-Host "`nCannot verify resources because the main page is not accessible." -ForegroundColor Red
    Write-Host "Please check if the repository is deployed to GitHub Pages correctly." -ForegroundColor Yellow
    Write-Host "Verify at: https://github.com/WETTENTLLC/macwayneofficialsite/settings/pages" -ForegroundColor White
}

Write-Host "`nScript completed!" -ForegroundColor Green
