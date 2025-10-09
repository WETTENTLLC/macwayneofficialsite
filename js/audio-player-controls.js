// Audio Player Controls with Play/Pause functionality
class AudioPlayerControls {
    constructor() {
        this.currentAudio = null;
        this.currentButton = null;
        this.init();
    }

    init() {
        this.setupPlayButtons();
    }

    setupPlayButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mini-play-btn')) {
                e.preventDefault();
                this.handlePlayPause(e.target);
            }
        });
    }

    handlePlayPause(button) {
        // Ensure audio exclusivity across all systems
        if (window.systemCoordinator) {
            window.systemCoordinator.enforceAudioExclusivity();
        }

        const trackItem = button.closest('.track-item');
        const trackSrc = trackItem.dataset.src;
        const fullSrc = trackItem.dataset.fullSrc;
        const trackName = trackItem.querySelector('.track-name').textContent;

        // Determine which source to use based on access level
        let audioSrc = trackSrc; // Default to sample
        
        if (window.paymentDeliverySystem) {
            if (window.paymentDeliverySystem.hasAlbumAccess() || 
                window.paymentDeliverySystem.hasStreamingAccess()) {
                audioSrc = fullSrc || trackSrc;
            }
        }

        // If clicking the same button and audio is playing, pause it
        if (this.currentButton === button && this.currentAudio && !this.currentAudio.paused) {
            this.pauseAudio();
            return;
        }

        // Stop any currently playing audio
        this.stopCurrentAudio();

        // Start new audio
        this.playAudio(audioSrc, button, trackName);
    }

    playAudio(src, button, trackName) {
        // Create new audio element
        this.currentAudio = new Audio(src);
        this.currentButton = button;

        // Update button to show pause state
        button.textContent = '⏸ Pause';
        button.classList.add('playing');

        // Set up event listeners
        this.currentAudio.addEventListener('ended', () => {
            this.resetButton(button);
        });

        this.currentAudio.addEventListener('error', () => {
            this.resetButton(button);
            console.error('Audio playback error');
        });

        // Play the audio
        this.currentAudio.play().catch(error => {
            console.error('Playback failed:', error);
            this.resetButton(button);
        });

        // Update main player display if it exists
        this.updateMainPlayerDisplay(trackName, src);
    }

    pauseAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.resetButton(this.currentButton);
        }
    }

    stopCurrentAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.resetButton(this.currentButton);
        }
    }

    resetButton(button) {
        if (button) {
            button.textContent = '▶ Play';
            button.classList.remove('playing');
        }
        this.currentAudio = null;
        this.currentButton = null;
    }

    updateMainPlayerDisplay(trackName, src) {
        // Update the main player if it exists
        let mainPlayer = document.getElementById('main-audio-player');
        if (!mainPlayer) {
            mainPlayer = document.createElement('audio');
            mainPlayer.id = 'main-audio-player';
            mainPlayer.controls = true;
            mainPlayer.style.width = '100%';
            mainPlayer.style.marginTop = '10px';
            
            const playerContainer = document.querySelector('.featured-player');
            if (playerContainer) {
                playerContainer.appendChild(mainPlayer);
            }
        }

        // Sync main player with current audio
        if (this.currentAudio) {
            mainPlayer.src = src;
            mainPlayer.currentTime = this.currentAudio.currentTime;
            
            // Sync play/pause states
            mainPlayer.addEventListener('play', () => {
                if (this.currentAudio && this.currentAudio.paused) {
                    this.currentAudio.play();
                }
            });

            mainPlayer.addEventListener('pause', () => {
                if (this.currentAudio && !this.currentAudio.paused) {
                    this.pauseAudio();
                }
            });
        }

        // Update track info display
        const trackInfo = document.querySelector('.track-info .track-title');
        if (trackInfo) {
            trackInfo.textContent = trackName;
        }
    }
}

// Initialize audio controls
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayerControls = new AudioPlayerControls();
});