# PowerShell script to create 30-second samples using ffmpeg
# Requires ffmpeg to be installed

$sourceDir = ".\public\audio\Blind and Battered [Explicit]"
$samplesDir = "$sourceDir\samples"

# Create samples directory if it doesn't exist
if (!(Test-Path $samplesDir)) {
    New-Item -ItemType Directory -Path $samplesDir
}

# Get all MP3 files in the source directory
Get-ChildItem -Path $sourceDir -Filter "*.mp3" | Where-Object { $_.Name -notlike "*sample*" } | ForEach-Object {
    $sampleName = $_.BaseName -replace "^\d+ - ", ""
    $sampleName = "{0:D2}-sample.mp3" -f [int]($_.Name.Split(' ')[0])
    $outputPath = Join-Path $samplesDir $sampleName
    
    Write-Host "Creating sample for: $($_.Name)"
    Write-Host "Output: $sampleName"
    
    # Create 30-second sample using ffmpeg
    ffmpeg -i $_.FullName -t 30 -acodec libmp3lame -q:a 2 $outputPath -y
}

Write-Host "Sample creation complete!"
