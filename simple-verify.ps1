# Mac Wayne Website Accessibility Verification Script

Write-Host "Mac Wayne Website - Accessibility Verification" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$sourceDir = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\deploy-clean"

# Function to check for accessibility features
function Test-AccessibilityFeatures {
    param (
        [string]$filePath,
        [string]$fileName
    )
    
    Write-Host "Checking $fileName..." -ForegroundColor Yellow
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        $features = @(
            @{Name = "Skip link"; Present = $content -match 'class="skip-link"'},
            @{Name = "Main content area"; Present = $content -match 'id="main-content"'},
            @{Name = "Semantic HTML"; Present = $content -match '<main'},
            @{Name = "ARIA attributes"; Present = $content -match 'aria-'},
            @{Name = "Accessible CSS"; Present = $content -match 'main-corrected.css' -or $content -match 'styles/main.css'}
        )
        
        $passed = 0
        foreach ($feature in $features) {
            $result = if ($feature.Present) { "✓" } else { "✗" }
            $color = if ($feature.Present) { "Green" } else { "Red" }
            Write-Host "  $result $($feature.Name)" -ForegroundColor $color
            
            if ($feature.Present) {
                $passed++
            }
        }
        
        $percentage = [math]::Round(($passed / $features.Count) * 100)
        $resultColor = if ($percentage -ge 80) { "Green" } elseif ($percentage -ge 60) { "Yellow" } else { "Red" }
        
        Write-Host "  Score: $passed/$($features.Count) ($percentage%)" -ForegroundColor $resultColor
        Write-Host ""
        
        return $percentage
    } else {
        Write-Host "  ✗ File not found!" -ForegroundColor Red
        Write-Host ""
        return 0
    }
}

# Test main pages
$files = @(
    @{Path = "$sourceDir\styles\main.css"; Name = "Main CSS"},
    @{Path = "$sourceDir\shop.html"; Name = "Shop page"},
    @{Path = "$sourceDir\live.html"; Name = "Live page"},
    @{Path = "$sourceDir\documentary.html"; Name = "Documentary page"},
    @{Path = "$sourceDir\battered-coin.html"; Name = "Battered Coin page"}
)

# Check index.html in _site folder or root
$indexPath = "$sourceDir\_site\index.html"
if (Test-Path $indexPath) {
    $files += @{Path = $indexPath; Name = "Index page (_site)"}
} else {
    $indexPath = "$sourceDir\index.html"
    if (Test-Path $indexPath) {
        $files += @{Path = $indexPath; Name = "Index page (root)"}
    }
}

$totalScore = 0
$fileCount = 0

foreach ($file in $files) {
    $score = Test-AccessibilityFeatures -filePath $file.Path -fileName $file.Name
    if ($score -gt 0) {
        $totalScore += $score
        $fileCount++
    }
}

if ($fileCount -gt 0) {
    $averageScore = [math]::Round($totalScore / $fileCount)
    
    Write-Host "Accessibility Verification Summary" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host "Overall Accessibility Score: $averageScore%" -ForegroundColor $(if ($averageScore -ge 80) { "Green" } elseif ($averageScore -ge 60) { "Yellow" } else { "Red" })
    
    if ($averageScore -ge 80) {
        Write-Host "✓ Accessibility implementation is successful!" -ForegroundColor Green
    } elseif ($averageScore -ge 60) {
        Write-Host "⚠️ Some accessibility features may be missing." -ForegroundColor Yellow
    } else {
        Write-Host "✗ Critical accessibility issues found." -ForegroundColor Red
    }
} else {
    Write-Host "No files were successfully verified." -ForegroundColor Red
}