// Audio Fix Script
// This script ensures the audio player is properly initialized and working

document.addEventListener('DOMContentLoaded', function() {
    console.log('Audio fix script loaded');
    
    // Check if audio player is initialized
    setTimeout(() => {
        if (!window.audioPlayer) {
            console.log('Audio player not initialized, creating now');
            window.audioPlayer = new NewAudioPlayer();
        } else {
            console.log('Audio player already initialized');
        }
        
        // Verify track paths
        const tracks = document.querySelectorAll('.track-item');
        if (tracks.length === 0) {
            console.error('No tracks found on page');
        } else {
            console.log(`Found ${tracks.length} tracks`);
            
            // Check first track
            const firstTrack = tracks[0];
            const sampleSrc = firstTrack.dataset.src;
            const fullSrc = firstTrack.dataset.fullSrc;
            
            console.log('First track sample path:', sampleSrc);
            console.log('First track full path:', fullSrc);
            
            // Audio testing disabled due to GitHub Pages issues
            console.log('Audio testing disabled - files not accessible on GitHub Pages');
        }
    }, 1000);
    
    // Add click handler for mini play buttons if not already handled
    document.querySelectorAll('.mini-play-btn').forEach(btn => {
        if (!btn.hasClickHandler) {
            btn.hasClickHandler = true;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const trackItem = btn.closest('.track-item');
                if (trackItem && window.audioPlayer) {
                    const trackId = trackItem.dataset.id;
                    const sampleSrc = trackItem.dataset.src;
                    const fullSrc = trackItem.dataset.fullSrc;
                    const trackName = trackItem.querySelector('.track-name').textContent;
                    
                    console.log(`Playing track: ${trackName}`);
                    console.log(`Sample: ${sampleSrc}`);
                    console.log(`Full: ${fullSrc}`);
                    
                    // Create track data object
                    const trackData = {
                        id: trackId,
                        title: trackName,
                        sampleSrc: sampleSrc,
                        fullSrc: fullSrc,
                        element: trackItem
                    };
                    
                    // Show message instead of loading track
                    alert('Audio preview temporarily unavailable. Purchase track to download.');
                }
            });
        }
    });
});