# PowerShell script to create 30-second samples from full tracks
# Requires FFmpeg to be installed and in PATH

$inputDir = "public/audio/Blind and Battered [Explicit]"
$outputDir = "public/audio/Blind and Battered [Explicit]/samples"

# Create samples directory if it doesn't exist
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir
}

# List of full track files
$tracks = @(
    "01 - Gotta Split [Explicit].mp3",
    "02 - I Think [Explicit].mp3",
    "03 - Keep Your Mouth Shut (Skit) [Explicit].mp3",
    "04 - Just a Player [Explicit].mp3",
    "05 - Ziplocks [Explicit].mp3",
    "06 - Where You Been (Skit) [Explicit].mp3",
    "07 - Cant Tell Me [Explicit].mp3",
    "08 - Just a Gimmick [Explicit].mp3",
    "09 - Wish I Knew Then [Explicit].mp3",
    "10 - Blind and Battered [Explicit].mp3",
    "11 - Smoother Than Woodgrain [Explicit].mp3",
    "12 - Touch You [Explicit].mp3",
    "13 - Life of Magic [Explicit].mp3",
    "14 - Its Going Down [Explicit].mp3",
    "15 - One Way In [Explicit].mp3",
    "16 - Crispy Game [Explicit].mp3",
    "17 - The End of the World [Explicit].mp3",
    "18 - Smell of Victory [Explicit].mp3",
    "19 - Do the I'm the Shit [Explicit].mp3",
    "20 - Hatin On a Blind Man [Explicit].mp3"
)

Write-Host "Creating 30-second samples..." -ForegroundColor Green

for ($i = 0; $i -lt $tracks.Length; $i++) {
    $trackNum = ($i + 1).ToString("00")
    $inputFile = Join-Path $inputDir $tracks[$i]
    $outputFile = Join-Path $outputDir "$trackNum-sample.mp3"
    
    if (Test-Path $inputFile) {
        Write-Host "Processing track $trackNum..." -ForegroundColor Yellow
        
        # Use FFmpeg to extract first 30 seconds with fade-out in last 2 seconds
        ffmpeg -i "$inputFile" -t 30 -af "afade=out:st=28:d=2" -y "$outputFile"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Created: $outputFile" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create: $outputFile" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ Input file not found: $inputFile" -ForegroundColor Red
    }
}

Write-Host "Sample creation complete!" -ForegroundColor Green
Write-Host "Generated samples are in: $outputDir" -ForegroundColor Cyan
