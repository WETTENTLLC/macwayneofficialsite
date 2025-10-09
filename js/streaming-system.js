// Streaming System for Mac Wayne Site
class StreamingSystem {
    constructor() {
        this.hasStreamingAccess = this.checkStreamingAccess();
        this.init();
    }

    init() {
        this.setupStreamingButtons();
        this.updateUI();
        this.setupAudioPlayback();
    }

    checkStreamingAccess() {
        return localStorage.getItem('mac-wayne-streaming-access') === 'true' || 
               localStorage.getItem('mac-wayne-album-purchased') === 'true';
    }

    setupStreamingButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.purchase-streaming')) {
                e.preventDefault();
                this.showStreamingPurchase();
            }
        });
    }

    showStreamingPurchase() {
        const container = document.getElementById('paypal-streaming-container');
        if (container) {
            container.style.display = 'block';
            container.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateUI() {
        const streamingBtn = document.querySelector('.purchase-streaming');
        
        if (this.hasStreamingAccess) {
            if (streamingBtn) {
                streamingBtn.innerHTML = '✓ Streaming Active';
                streamingBtn.disabled = true;
                streamingBtn.style.background = '#28a745';
            }
            this.enableFullPlayback();
        }
    }

    enableFullPlayback() {
        // Update track status indicators
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            const trackStatus = item.querySelector('.track-status');
            const playBtn = item.querySelector('.mini-play-btn');
            
            if (trackStatus && trackStatus.textContent === 'Preview') {
                trackStatus.textContent = 'Full Track';
                trackStatus.className = 'track-status full';
            }
            
            if (playBtn) {
                playBtn.textContent = '▶ Play Full';
            }
        });

        // Update main player
        const previewIndicator = document.querySelector('.preview-indicator');
        if (previewIndicator) {
            previewIndicator.textContent = 'Full Album Access - Stream Anytime';
            previewIndicator.style.color = '#28a745';
        }
    }

    setupAudioPlayback() {
        // Enhanced audio playback for streaming users
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mini-play-btn') && this.hasStreamingAccess) {
                e.preventDefault();
                const trackItem = e.target.closest('.track-item');
                const trackSrc = trackItem.dataset.fullSrc || trackItem.dataset.src;
                this.playFullTrack(trackSrc);
            }
        });
    }

    playFullTrack(src) {
        // Create or update audio player for full track playback
        let audio = document.getElementById('streaming-audio-player');
        
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'streaming-audio-player';
            audio.controls = true;
            audio.style.width = '100%';
            audio.style.marginTop = '10px';
            
            const playerContainer = document.querySelector('.featured-player');
            if (playerContainer) {
                playerContainer.appendChild(audio);
            }
        }
        
        audio.src = src;
        audio.play();
        
        // Update player info
        const trackItem = document.querySelector(`[data-src="${src}"], [data-full-src="${src}"]`);
        if (trackItem) {
            const trackName = trackItem.querySelector('.track-name').textContent;
            console.log(`Now playing: ${trackName}`);
        }
    }
}

// Initialize streaming system
document.addEventListener('DOMContentLoaded', () => {
    window.streamingSystem = new StreamingSystem();
});

// Make streaming access available globally
window.enableStreamingAccess = () => {
    localStorage.setItem('mac-wayne-streaming-access', 'true');
    if (window.streamingSystem) {
        window.streamingSystem.hasStreamingAccess = true;
        window.streamingSystem.updateUI();
    }
};