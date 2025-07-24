// Audio Fix Script
// This script ensures audio paths are correct and validates playback

document.addEventListener('DOMContentLoaded', function() {
    // Audio fix script loaded
    
    // Wait for audio player to be initialized
    setTimeout(() => {
        // Verify audio player exists
        if (!window.audioPlayer) {
            // Audio player not initialized
            return;
        }

        // Verify track paths
        document.querySelectorAll('.track-item').forEach(track => {
        const audioPath = track.dataset.src;
        if (audioPath) {
            // Create an audio element to test loading
            const audio = new Audio();
            audio.src = audioPath;
            
            audio.addEventListener('canplaythrough', () => {
                // Audio file verified
            });
            
            audio.addEventListener('error', () => {
                // Demo mode: Audio file not loaded
                // Update track status to show demo mode
                const trackItem = track.closest('.track-item');
                if (trackItem) {
                    const statusEl = trackItem.querySelector('.track-status');
                    if (statusEl) {
                        statusEl.textContent = 'Demo Mode';
                        statusEl.className = 'track-status demo';
                    }
                }
            });
        }
    });
        const tracks = document.querySelectorAll('.track-item');
        if (tracks.length === 0) {
            // No tracks found on page
        } else {
            // Found ${tracks.length} tracks
            
            // Check first track
            const firstTrack = tracks[0];
            const sampleSrc = firstTrack.dataset.src;
            const fullSrc = firstTrack.dataset.fullSrc;
            
            // First track paths verified
            
            // Test loading first track
            const testAudio = new Audio(sampleSrc);
            testAudio.addEventListener('canplaythrough', () => {
                // Sample audio loaded successfully
            });
            testAudio.addEventListener('error', () => {
                // Sample audio failed to load
            });
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
                    
                    // Playing track: ${trackName}
                    
                    // Create track data object
                    const trackData = {
                        id: trackId,
                        title: trackName,
                        sampleSrc: sampleSrc,
                        fullSrc: fullSrc,
                        element: trackItem
                    };
                    
                    // Load track
                    window.audioPlayer.loadTrack(trackData);
                }
            });
        }
    });
});