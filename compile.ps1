Write-Host "Compiling MacWayneBatteredCoin.sol..." -ForegroundColor Cyan
$contractPath = Join-Path (Get-Location) "MacWayneBatteredCoin.sol"

# First compilation: Check for warnings
Write-Host "Checking for warnings..." -ForegroundColor Yellow
$output = npx solc --optimize --bin $contractPath 2>&1

# Check exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilation successful!" -ForegroundColor Green
    
    # Check for warnings
    if ($output -match "Warning") {
        Write-Host "Warnings found:" -ForegroundColor Yellow
        $output | Where-Object { $_ -match "Warning" } | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
    } else {
        Write-Host "No warnings detected." -ForegroundColor Green
    }
    
    # Second compilation: Check for gas optimization
    Write-Host "`nGenerating contract binary..." -ForegroundColor Cyan
    $binOutput = npx solc --optimize --bin $contractPath 2>&1
    
    # Show binary size
    Write-Host "Contract binary size (optimized):" -ForegroundColor Cyan
    $binOutput | Where-Object { $_ -match "^[0-9a-f]" } | ForEach-Object { 
        $binSize = $_.Length / 2
        Write-Host "Binary size: $binSize bytes" -ForegroundColor Cyan 
    }
    
    Write-Host "`nContract is ready for deployment!" -ForegroundColor Green
} else {
    Write-Host "Compilation failed with errors:" -ForegroundColor Red
    $output | ForEach-Object { Write-Host $_ -ForegroundColor Red }
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
