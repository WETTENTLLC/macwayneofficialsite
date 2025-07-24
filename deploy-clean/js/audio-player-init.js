// Audio Player Initialization Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Audio player initialization script loaded');
    
    // Initialize audio player
    setTimeout(() => {
        if (!window.audioPlayer) {
            console.log('Creating new audio player instance');
            window.audioPlayer = new NewAudioPlayer();
        } else {
            console.log('Audio player already initialized');
        }
    }, 500);
    
    // Update track items to use correct paths
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach(track => {
        // Check if track already has the correct data attributes
        if (!track.dataset.fullSrc && track.dataset.src) {
            const trackSrc = track.dataset.src;
            const trackName = track.querySelector('.track-name')?.textContent.trim() || '';
            
            // Extract track number and name
            let trackNumber = '01';
            if (trackName.match(/^\d+\./)) {
                trackNumber = trackName.split('.')[0].padStart(2, '0');
            }
            
            // Create sample path
            const samplePath = `public/audio/Blind and Battered [Explicit]/samples/${trackNumber}-sample.mp3`;
            
            // Set data attributes
            track.dataset.src = samplePath;
            track.dataset.fullSrc = trackSrc;
            track.dataset.id = `track-${trackNumber}`;
            
            console.log(`Updated track: ${trackName}`);
            console.log(`Sample: ${samplePath}`);
            console.log(`Full: ${trackSrc}`);
        }
    });
    
    // Add audio player if not present
    const albumSection = document.querySelector('.album-tracks-section');
    if (albumSection && !document.querySelector('.audio-player')) {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'audio-player';
        playerDiv.innerHTML = `
            <div class="track-info">
                <h3 class="track-title">Select a track to play</h3>
                <p class="track-artist">Mac Wayne</p>
                <span class="track-status preview">Preview</span>
            </div>
            
            <div class="player-controls">
                <button class="play-btn" aria-label="Play">
                    <i class="fas fa-play"></i>
                </button>
                
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="time-display">
                        <span class="current-time">0:00</span>
                        <span>/</span>
                        <span class="duration">0:00</span>
                    </div>
                </div>
            </div>
            
            <audio id="audio-element" preload="metadata"></audio>
        `;
        albumSection.insertBefore(playerDiv, albumSection.firstChild);
    }
});