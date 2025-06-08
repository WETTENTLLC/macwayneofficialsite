# Deployment Verification Script
# This script checks if the website is properly deployed and accessible

Write-Host "Mac Wayne Website Deployment Verification" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host

# Function to test URL accessibility
function Test-URL {
    param (
        [string]$URL,
        [string]$Description
    )
    
    Write-Host "Testing: $Description" -ForegroundColor White
    Write-Host "URL: $URL" -ForegroundColor Gray
    
    try {
        $request = [System.Net.WebRequest]::Create($URL)
        $request.Method = "HEAD"
        $request.Timeout = 5000
        
        $response = $request.GetResponse()
        $status = [int]$response.StatusCode
        $response.Close()
        
        if ($status -eq 200) {
            Write-Host "Status: OK (200)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Status: $status" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to print separator
function Print-Separator {
    Write-Host "==========================================" -ForegroundColor Gray
}

# Test GitHub Pages URLs
Write-Host "TESTING GITHUB PAGES DEPLOYMENT" -ForegroundColor Magenta
Print-Separator

$githubSuccess = 0
$githubTotal = 0

# Main page
$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/" -Description "Main Page (GitHub Pages)") {
    $githubSuccess++
}

# Battered Coin page (multiple variants)
$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/battered-coin.html" -Description "Battered Coin Page (lowercase)") {
    $githubSuccess++
}

$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/Battered-Coin.html" -Description "Battered Coin Page (titlecase)") {
    $githubSuccess++
}

$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/battered-coin-inline-css.html" -Description "Battered Coin Page (inline CSS)") {
    $githubSuccess++
}

$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/battered-coin-redirect.html" -Description "Battered Coin Redirect Page") {
    $githubSuccess++
}

# Test style files
$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/styles/main.css" -Description "Main CSS File") {
    $githubSuccess++
}

$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/styles/components.css" -Description "Components CSS File") {
    $githubSuccess++
}

$githubTotal++
if (Test-URL -URL "https://wettentllc.github.io/macwayneofficialsite/styles/animations.css" -Description "Animations CSS File") {
    $githubSuccess++
}

# Test Custom Domain URLs (if applicable)
Write-Host "`nTESTING CUSTOM DOMAIN" -ForegroundColor Magenta
Print-Separator

$domainSuccess = 0
$domainTotal = 0

# Main page
$domainTotal++
if (Test-URL -URL "https://macwayneofficial.com/" -Description "Main Page (Custom Domain)") {
    $domainSuccess++
}

# WWW subdomain
$domainTotal++
if (Test-URL -URL "https://www.macwayneofficial.com/" -Description "Main Page (WWW Subdomain)") {
    $domainSuccess++
}

# Battered Coin page
$domainTotal++
if (Test-URL -URL "https://macwayneofficial.com/battered-coin.html" -Description "Battered Coin Page (Custom Domain)") {
    $domainSuccess++
}

# Results
Write-Host "`nRESULTS" -ForegroundColor Magenta
Print-Separator

$githubPercentage = [math]::Round(($githubSuccess / $githubTotal) * 100)
$domainPercentage = if ($domainTotal -gt 0) { [math]::Round(($domainSuccess / $domainTotal) * 100) } else { 0 }

Write-Host "GitHub Pages Deployment: $githubSuccess/$githubTotal tests passed ($githubPercentage%)" -ForegroundColor $(if ($githubPercentage -eq 100) { "Green" } elseif ($githubPercentage -ge 80) { "Yellow" } else { "Red" })
Write-Host "Custom Domain: $domainSuccess/$domainTotal tests passed ($domainPercentage%)" -ForegroundColor $(if ($domainPercentage -eq 100) { "Green" } elseif ($domainPercentage -ge 80) { "Yellow" } else { "Red" })

# Recommendations
Write-Host "`nRECOMMENDATIONS" -ForegroundColor Magenta
Print-Separator

if ($githubPercentage -lt 100) {
    Write-Host "GitHub Pages issues detected. Try these fixes:" -ForegroundColor Yellow
    Write-Host "1. Run the battered-coin-fix.ps1 script to create case variants" -ForegroundColor White
    Write-Host "2. Run the css-path-fix.ps1 script to fix CSS path issues" -ForegroundColor White
    Write-Host "3. Make sure all CSS files are properly pushed to GitHub" -ForegroundColor White
    Write-Host "4. Check that the repository is properly configured for GitHub Pages" -ForegroundColor White
}

if ($domainPercentage -lt 100) {
    Write-Host "Custom domain issues detected. Try these fixes:" -ForegroundColor Yellow
    Write-Host "1. Follow the steps in NAMECHEAP-DOMAIN-CONFIGURATION.md" -ForegroundColor White
    Write-Host "2. Make sure the CNAME file exists in the repository root" -ForegroundColor White
    Write-Host "3. Verify custom domain settings in GitHub Pages" -ForegroundColor White
    Write-Host "4. Wait 24-48 hours for DNS propagation" -ForegroundColor White
    Write-Host "5. Clear your DNS cache with 'ipconfig /flushdns'" -ForegroundColor White
}

if ($githubPercentage -eq 100 -and $domainPercentage -eq 100) {
    Write-Host "All tests passed! Your deployment appears to be working correctly." -ForegroundColor Green
}

Write-Host "`nVerification completed!" -ForegroundColor Cyan
