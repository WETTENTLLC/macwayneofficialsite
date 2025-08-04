// Working Audio Player for GitHub Pages
class WorkingAudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = null;
        this.previewDuration = 30;
        this.init();
    }

    init() {
        // Setup mini play buttons
        document.querySelectorAll('.mini-play-btn').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const trackItem = btn.closest('.track-item');
                const trackId = trackItem.dataset.id;
                const trackName = trackItem.querySelector('.track-name').textContent;
                
                // Try to use local samples first, fallback to external
                const samplePath = trackItem.dataset.src;
                const audioUrl = samplePath || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
                
                this.playPreview(audioUrl, trackName);
            });
        });
    }

    playPreview(url, trackName) {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }

        this.audio.src = url;
        this.audio.currentTime = 0;
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            console.log(`Playing preview: ${trackName}`);
            
            // Stop after 30 seconds
            setTimeout(() => {
                if (this.isPlaying) {
                    this.audio.pause();
                    this.isPlaying = false;
                    alert(`Preview ended. Purchase "${trackName}" for full track.`);
                }
            }, this.previewDuration * 1000);
            
        }).catch(error => {
            console.error('Audio playback failed:', error);
            // Try fallback audio if local fails
            if (url !== 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav') {
                this.playPreview('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', trackName);
            } else {
                alert('Audio preview temporarily unavailable. Purchase to download full track.');
            }
        });
    }
}

// Initialize working audio player
document.addEventListener('DOMContentLoaded', () => {
    new WorkingAudioPlayer();
});