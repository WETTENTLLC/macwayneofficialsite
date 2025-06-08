# Copy static files to _site directory
$sourcePath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\deploy-clean"
$destinationPath = "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\deploy-clean\_site"

# Create _site directory if it doesn't exist
if (-not (Test-Path $destinationPath)) {
    New-Item -ItemType Directory -Path $destinationPath | Out-Null
    Write-Host "Created _site directory at $destinationPath"
}

# Copy HTML files
Get-ChildItem -Path $sourcePath -Filter "*.html" | ForEach-Object {
    Copy-Item $_.FullName -Destination $destinationPath
    Write-Host "Copied $($_.Name) to _site directory"
}

# Copy CNAME file
if (Test-Path "$sourcePath\CNAME") {
    Copy-Item "$sourcePath\CNAME" -Destination $destinationPath
    Write-Host "Copied CNAME to _site directory"
}

# Copy asset directories
$assetDirs = @("js", "css", "images", "styles", "public")
foreach ($dir in $assetDirs) {
    if (Test-Path "$sourcePath\$dir") {
        Copy-Item "$sourcePath\$dir" -Destination $destinationPath -Recurse
        Write-Host "Copied $dir directory to _site directory"
    }
}

# Create an index.html file if one doesn't exist
if (-not (Test-Path "$destinationPath\index.html")) {
    Set-Content -Path "$destinationPath\index.html" -Value "<html><body><h1>Mac Wayne Official</h1><p>Welcome to the official site</p></body></html>"
    Write-Host "Created fallback index.html in _site directory"
}

Write-Host "Deployment preparation complete! Files ready in _site directory"
