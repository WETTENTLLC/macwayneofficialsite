// Favicon Generator Script
document.addEventListener('DOMContentLoaded', function() {
    // Create a simple favicon dynamically if the files don't exist
    const faviconCanvas = document.createElement('canvas');
    faviconCanvas.width = 32;
    faviconCanvas.height = 32;
    const ctx = faviconCanvas.getContext('2d');
    
    // Draw a green background
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, 32, 32);
    
    // Add text "LL"
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LL', 16, 16);
    
    // Create a favicon link element
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.href = faviconCanvas.toDataURL('image/png');
    document.head.appendChild(faviconLink);
    
    // Also add the manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'images/favicons/site.webmanifest';
    document.head.appendChild(manifestLink);
    
    // For browsers that support it, add apple-touch-icon with the same dynamic favicon
    const appleIconLink = document.createElement('link');
    appleIconLink.rel = 'apple-touch-icon';
    appleIconLink.href = faviconCanvas.toDataURL('image/png');
    document.head.appendChild(appleIconLink);
});
