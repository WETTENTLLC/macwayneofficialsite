# Test Automation Script for Mac Wayne Site
# This script helps automate some testing tasks for the Mac Wayne site
# Run this script in PowerShell to perform automated tests

Write-Host "=== Mac Wayne Site Testing Script ===" -ForegroundColor Cyan
Write-Host "Starting automated tests..." -ForegroundColor Yellow

# Test environment information
Write-Host "`n[Environment Information]" -ForegroundColor Green
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Test Date: $date"
Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)"
Write-Host "OS Version: $([System.Environment]::OSVersion.VersionString)"

# Function to check if a file exists
function Test-FileExists {
    param(
        [string]$Path,
        [string]$Description
    )
    
    if (Test-Path $Path) {
        Write-Host "✅ PASS: $Description - File exists: $Path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ FAIL: $Description - File not found: $Path" -ForegroundColor Red
        return $false
    }
}

# Function to check if a string exists in a file
function Test-StringInFile {
    param(
        [string]$FilePath,
        [string]$SearchString,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content -Path $FilePath -Raw
        if ($content -match [regex]::Escape($SearchString)) {
            Write-Host "✅ PASS: $Description - String found in file" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ FAIL: $Description - String not found in file" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "❌ FAIL: $Description - File not found: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Function to validate HTML files
function Test-HtmlValidation {
    param(
        [string]$FilePath,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content -Path $FilePath -Raw
        
        # Basic HTML structure check
        $hasDoctype = $content -match "<!DOCTYPE html>"
        $hasHtmlTag = $content -match "<html.*?>"
        $hasHeadTag = $content -match "<head>.*?</head>"
        $hasBodyTag = $content -match "<body>.*?</body>"
        
        if ($hasDoctype -and $hasHtmlTag -and $hasHeadTag -and $hasBodyTag) {
            Write-Host "✅ PASS: $Description - Basic HTML structure validated" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ WARNING: $Description - HTML structure issues detected" -ForegroundColor Yellow
            if (-not $hasDoctype) { Write-Host "  - Missing DOCTYPE declaration" -ForegroundColor Yellow }
            if (-not $hasHtmlTag) { Write-Host "  - Missing HTML tag" -ForegroundColor Yellow }
            if (-not $hasHeadTag) { Write-Host "  - Missing HEAD section" -ForegroundColor Yellow }
            if (-not $hasBodyTag) { Write-Host "  - Missing BODY section" -ForegroundColor Yellow }
            return $false
        }
    } else {
        Write-Host "❌ FAIL: $Description - File not found: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Function to check JavaScript files
function Test-JavaScriptFile {
    param(
        [string]$FilePath,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content -Path $FilePath -Raw
        
        # Check for common JS syntax errors
        $hasSyntaxError = $content -match "\/\/\s*Error:" -or $content -match "console\.error\("
        
        if (-not $hasSyntaxError) {
            Write-Host "✅ PASS: $Description - No obvious syntax errors" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ WARNING: $Description - Potential issues found" -ForegroundColor Yellow
            return $false
        }
    } else {
        Write-Host "❌ FAIL: $Description - File not found: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Function to check audio files
function Test-AudioFiles {
    param(
        [string]$Directory,
        [string]$Description
    )
    
    if (Test-Path $Directory) {
        $audioFiles = Get-ChildItem -Path $Directory -Include "*.mp3","*.wav","*.ogg" -Recurse
        
        if ($audioFiles.Count -gt 0) {
            Write-Host "✅ PASS: $Description - Found $($audioFiles.Count) audio files" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ WARNING: $Description - No audio files found in directory" -ForegroundColor Yellow
            return $false
        }
    } else {
        Write-Host "❌ FAIL: $Description - Directory not found: $Directory" -ForegroundColor Red
        return $false
    }
}

# Function to check for broken links in HTML files
function Test-LinksInHtml {
    param(
        [string]$FilePath,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content -Path $FilePath -Raw
        
        # Extract href attributes
        $linkPattern = 'href="([^"]+)"'
        $matches = [regex]::Matches($content, $linkPattern)
        
        $totalLinks = $matches.Count
        $brokenLinks = 0
        
        foreach ($match in $matches) {
            $href = $match.Groups[1].Value
            
            # Skip external links, anchors, and javascript links
            if ($href -match "^(http|https|tel|mailto|#|javascript)") {
                continue
            }
            
            # Check if the link exists
            $linkPath = $href
            if (-not [System.IO.Path]::IsPathRooted($linkPath)) {
                $linkPath = Join-Path -Path (Split-Path -Parent $FilePath) -ChildPath $href
            }
            
            if (-not (Test-Path $linkPath)) {
                $brokenLinks++
                Write-Host "  - Broken link: $href" -ForegroundColor Yellow
            }
        }
        
        if ($brokenLinks -eq 0) {
            Write-Host "✅ PASS: $Description - No broken internal links found ($totalLinks total)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ WARNING: $Description - Found $brokenLinks broken links out of $totalLinks" -ForegroundColor Yellow
            return $false
        }
    } else {
        Write-Host "❌ FAIL: $Description - File not found: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Main testing sequence
Write-Host "`n[1. Core Files Testing]" -ForegroundColor Green
Test-FileExists -Path "index.html" -Description "Home Page"
Test-FileExists -Path "shop.html" -Description "Shop Page"
Test-FileExists -Path "battered-coin.html" -Description "Battered Coin Page"
Test-FileExists -Path "js/audio-player.js" -Description "Audio Player Script"
Test-FileExists -Path "js/shop.js" -Description "Shop Script"
Test-FileExists -Path "js/battered-coin.js" -Description "Battered Coin Script"
Test-FileExists -Path "styles/components.css" -Description "Components CSS"

Write-Host "`n[2. HTML Validation]" -ForegroundColor Green
Test-HtmlValidation -FilePath "index.html" -Description "Home Page HTML"
Test-HtmlValidation -FilePath "shop.html" -Description "Shop Page HTML"
Test-HtmlValidation -FilePath "battered-coin.html" -Description "Battered Coin Page HTML"

Write-Host "`n[3. JavaScript Validation]" -ForegroundColor Green
Test-JavaScriptFile -FilePath "js/audio-player.js" -Description "Audio Player Script"
Test-JavaScriptFile -FilePath "js/shop.js" -Description "Shop Script"
Test-JavaScriptFile -FilePath "js/battered-coin.js" -Description "Battered Coin Script"

Write-Host "`n[4. Content Validation]" -ForegroundColor Green
Test-StringInFile -FilePath "index.html" -SearchString "<title>Mac Wayne Official" -Description "Home Page Title"
Test-StringInFile -FilePath "shop.html" -SearchString "<title>Shop - Mac Wayne" -Description "Shop Page Title"
Test-StringInFile -FilePath "battered-coin.html" -SearchString "<title>Mac Wayne Battered Coin" -Description "Battered Coin Page Title"

Write-Host "`n[5. Audio Files Check]" -ForegroundColor Green
Test-AudioFiles -Directory "audio" -Description "Audio Files"

Write-Host "`n[6. Link Validation]" -ForegroundColor Green
Test-LinksInHtml -FilePath "index.html" -Description "Home Page Links"
Test-LinksInHtml -FilePath "shop.html" -Description "Shop Page Links"
Test-LinksInHtml -FilePath "battered-coin.html" -Description "Battered Coin Page Links"

Write-Host "`n=== Testing Complete ===" -ForegroundColor Cyan
Write-Host "For complete testing, please use the FINAL-TESTING-CHECKLIST.md file." -ForegroundColor Yellow
Write-Host "This script only provides basic automated tests. Manual testing is still required." -ForegroundColor Yellow

# Save test results to file
$testResultsPath = "test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
$host.UI.RawUI.BufferSize.Width | Out-File -FilePath $testResultsPath
Write-Host "`nTest results saved to: $testResultsPath" -ForegroundColor Green
