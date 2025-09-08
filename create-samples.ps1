# Create 30-second samples from full tracks
$fullTracksPath = "audio\Blind and Battered [Explicit]"
$samplesPath = "samples"

# Get all full track files
$fullTracks = Get-ChildItem "$fullTracksPath\*.mp3" | Sort-Object Name

Write-Host "Creating 30-second samples from full tracks..." -ForegroundColor Green

for ($i = 0; $i -lt $fullTracks.Count; $i++) {
    $trackNum = ($i + 1).ToString("00")
    $fullTrack = $fullTracks[$i]
    $sampleFile = "$samplesPath\$trackNum-sample.mp3"
    
    Write-Host "Processing: $($fullTrack.Name) -> $trackNum-sample.mp3" -ForegroundColor Yellow
    
    # Copy first 30 seconds using ffmpeg (if available) or just copy full file for now
    try {
        # Try to use ffmpeg to extract 30 seconds
        $ffmpegCmd = "ffmpeg -i `"$($fullTrack.FullName)`" -t 30 -acodec copy `"$sampleFile`" -y"
        Invoke-Expression $ffmpegCmd
        Write-Host "  Created 30-second sample" -ForegroundColor Green
    }
    catch {
        # If ffmpeg not available, copy full file (will be limited by audio player)
        Copy-Item $fullTrack.FullName $sampleFile -Force
        Write-Host "  Copied full file (will be limited to 30s by player)" -ForegroundColor Cyan
    }
}

Write-Host "`nSample creation complete!" -ForegroundColor Green