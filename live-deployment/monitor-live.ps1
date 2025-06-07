# Mac Wayne Battered Coin - Live Site Monitoring Script
# Monitor your live cryptocurrency platform after deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$false)]
    [int]$CheckInterval = 300,  # 5 minutes
    
    [Parameter(Mandatory=$false)]
    [switch]$ContinuousMode
)

Write-Host "🔍 Mac Wayne Battered Coin - Live Site Monitor" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Monitoring: https://$Domain" -ForegroundColor Yellow
Write-Host "Interval: $CheckInterval seconds" -ForegroundColor Yellow

# Performance tracking
$script:performanceLog = @()
$script:errorCount = 0
$script:successCount = 0

function Test-SiteHealth {
    param([string]$Domain)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $healthReport = @{
        Timestamp = $timestamp
        Domain = $Domain
        SSL = $false
        MainSite = $false
        CryptoPage = $false
        ApiResponse = $false
        LoadTime = 0
        Status = "Unknown"
        Errors = @()
    }
    
    Write-Host "`n[$timestamp] Running health check..." -ForegroundColor Cyan
    
    # Test SSL Certificate
    Write-Host "🔒 Checking SSL... " -NoNewline
    try {
        $sslTest = Invoke-WebRequest -Uri "https://$Domain" -Method Head -TimeoutSec 10
        $healthReport.SSL = $true
        Write-Host "✅" -ForegroundColor Green
    }
    catch {
        $healthReport.Errors += "SSL Error: $($_.Exception.Message)"
        Write-Host "❌" -ForegroundColor Red
    }
    
    # Test Main Site
    Write-Host "🏠 Checking main site... " -NoNewline
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $mainResponse = Invoke-WebRequest -Uri "https://$Domain" -TimeoutSec 15
        $stopwatch.Stop()
        
        $healthReport.LoadTime = [math]::Round($stopwatch.Elapsed.TotalSeconds, 2)
        $healthReport.MainSite = $mainResponse.StatusCode -eq 200
        
        if ($healthReport.MainSite) {
            Write-Host "✅ ($($healthReport.LoadTime)s)" -ForegroundColor Green
        }
    }
    catch {
        $healthReport.Errors += "Main Site Error: $($_.Exception.Message)"
        Write-Host "❌" -ForegroundColor Red
    }
    
    # Test Crypto Page
    Write-Host "₿ Checking crypto page... " -NoNewline
    try {
        $cryptoResponse = Invoke-WebRequest -Uri "https://$Domain/battered-coin.html" -TimeoutSec 15
        $healthReport.CryptoPage = $cryptoResponse.StatusCode -eq 200
        
        if ($healthReport.CryptoPage) {
            Write-Host "✅" -ForegroundColor Green
        }
    }
    catch {
        $healthReport.Errors += "Crypto Page Error: $($_.Exception.Message)"
        Write-Host "❌" -ForegroundColor Red
    }
    
    # Test API Response (check if JS config loads)
    Write-Host "🔧 Checking configuration... " -NoNewline
    try {
        $configResponse = Invoke-WebRequest -Uri "https://$Domain/js/production-config.js" -TimeoutSec 10
        $healthReport.ApiResponse = $configResponse.StatusCode -eq 200
        
        if ($healthReport.ApiResponse) {
            Write-Host "✅" -ForegroundColor Green
        }
    }
    catch {
        $healthReport.Errors += "Config Error: $($_.Exception.Message)"
        Write-Host "❌" -ForegroundColor Red
    }
    
    # Calculate overall status
    $successCount = @($healthReport.SSL, $healthReport.MainSite, $healthReport.CryptoPage, $healthReport.ApiResponse) | Where-Object { $_ } | Measure-Object | Select-Object -ExpandProperty Count
    
    if ($successCount -eq 4) {
        $healthReport.Status = "Healthy"
        $script:successCount++
        Write-Host "🎉 Site Status: HEALTHY" -ForegroundColor Green
    }
    elseif ($successCount -ge 2) {
        $healthReport.Status = "Degraded"
        Write-Host "⚠️  Site Status: DEGRADED" -ForegroundColor Yellow
    }
    else {
        $healthReport.Status = "Down"
        $script:errorCount++
        Write-Host "🚨 Site Status: DOWN" -ForegroundColor Red
    }
    
    # Performance analysis
    if ($healthReport.LoadTime -gt 0) {
        if ($healthReport.LoadTime -lt 2) {
            Write-Host "⚡ Performance: EXCELLENT ($($healthReport.LoadTime)s)" -ForegroundColor Green
        }
        elseif ($healthReport.LoadTime -lt 5) {
            Write-Host "👍 Performance: GOOD ($($healthReport.LoadTime)s)" -ForegroundColor Yellow
        }
        else {
            Write-Host "🐌 Performance: SLOW ($($healthReport.LoadTime)s)" -ForegroundColor Red
        }
    }
    
    # Log errors
    if ($healthReport.Errors.Count -gt 0) {
        Write-Host "🚨 Errors detected:" -ForegroundColor Red
        $healthReport.Errors | ForEach-Object {
            Write-Host "   - $_" -ForegroundColor Red
        }
    }
    
    $script:performanceLog += $healthReport
    return $healthReport
}

function Show-Statistics {
    $totalChecks = $script:performanceLog.Count
    if ($totalChecks -eq 0) { return }
    
    $avgLoadTime = ($script:performanceLog | Measure-Object -Property LoadTime -Average).Average
    $uptime = [math]::Round(($script:successCount / $totalChecks) * 100, 2)
    
    Write-Host "`n📊 PERFORMANCE STATISTICS" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host "Total Checks: $totalChecks" -ForegroundColor White
    Write-Host "Successful: $($script:successCount)" -ForegroundColor Green
    Write-Host "Failed: $($script:errorCount)" -ForegroundColor Red
    Write-Host "Uptime: $uptime%" -ForegroundColor $(if($uptime -gt 95){"Green"}elseif($uptime -gt 90){"Yellow"}else{"Red"})
    Write-Host "Avg Load Time: $([math]::Round($avgLoadTime, 2))s" -ForegroundColor White
}

function Export-HealthLog {
    $logPath = "health-log-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $script:performanceLog | ConvertTo-Json -Depth 3 | Out-File $logPath
    Write-Host "📝 Health log exported to: $logPath" -ForegroundColor Cyan
}

# Main monitoring loop
try {
    do {
        $healthResult = Test-SiteHealth -Domain $Domain
        
        if ($ContinuousMode) {
            Show-Statistics
            Write-Host "`n⏰ Next check in $CheckInterval seconds... (Ctrl+C to stop)" -ForegroundColor Gray
            Start-Sleep -Seconds $CheckInterval
        }
        
    } while ($ContinuousMode)
    
    if (-not $ContinuousMode) {
        Show-Statistics
        
        # Ask if user wants to export log
        $export = Read-Host "`nExport health log? (y/N)"
        if ($export -eq 'y' -or $export -eq 'Y') {
            Export-HealthLog
        }
    }
}
catch {
    Write-Host "`n🚨 Monitoring interrupted: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Write-Host "`n📊 Final Statistics:" -ForegroundColor Cyan
    Show-Statistics
    
    Write-Host "`n🔍 Monitoring session completed." -ForegroundColor Cyan
    Write-Host "Thank you for monitoring Mac Wayne Battered Coin! 🚀" -ForegroundColor Green
}
