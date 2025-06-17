// Audio Player functionality for Mac Wayne Official website

class AudioPlayer {
    constructor(container) {
        this.container = container;
        this.audio = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.tracks = [];
        this.currentTrackIndex = 0;
        
        // Preview mode settings
        this.previewMode = true; // Enable preview mode by default
        this.previewDuration = 30; // 30 seconds
        this.previewEnded = false;
        this.isPurchased = false; // Track purchase status
        
        this.init();
    }
      init() {
        this.setupTracks();
        this.setupEventListeners();
        this.setupProgressBar();
        console.log('AudioPlayer initialized:', {
            previewMode: this.previewMode,
            previewDuration: this.previewDuration,
            tracksCount: this.tracks.length
        });
    }
      setupTracks() {
        const trackElements = this.container.querySelectorAll('.track-item');
        this.tracks = Array.from(trackElements).map((element, index) => ({
            index,
            element,
            title: element.querySelector('.track-title')?.textContent || element.dataset.title || `Track ${index + 1}`,
            duration: element.querySelector('.track-duration')?.textContent || element.dataset.duration || '0:00',
            src: element.dataset.src || '', // Audio file URL
            preview: element.dataset.preview === 'true', // Preview mode flag
            previewDuration: parseInt(element.dataset.previewDuration) || 30 // Custom preview duration
        }));
        
        // Also check if the main audio player has preview settings
        const mainPlayer = this.container.querySelector('.audio-player');
        if (mainPlayer && mainPlayer.dataset.preview === 'true') {
            this.previewMode = true;
        }
    }
    
    setupEventListeners() {
        // Play/pause button
        const playPauseBtn = this.container.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        // Previous/next buttons
        const prevBtn = this.container.querySelector('.prev-btn');
        const nextBtn = this.container.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousTrack());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Track items
        this.tracks.forEach((track, index) => {
            track.element.addEventListener('click', () => this.selectTrack(index));
        });
        
        // Volume control
        const volumeSlider = this.container.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        }
    }
    
    setupProgressBar() {
        const progressBar = this.container.querySelector('.progress-bar');
        const progressFill = this.container.querySelector('.progress-fill');
        
        if (progressBar && progressFill) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.seekTo(percent);
            });
        }
    }
    
    async selectTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentTrackIndex = index;
        this.currentTrack = this.tracks[index];
        
        // Update UI
        this.updateTrackDisplay();
        
        // Load audio if not already loaded or different track
        if (!this.audio || this.audio.src !== this.currentTrack.src) {
            await this.loadTrack();
        }
        
        // Auto-play if a track was already playing
        if (this.isPlaying) {
            this.play();
        }
    }
    
    // Load a new track into the player
    async loadNewTrack(trackData) {
        console.log('Loading new track:', trackData);
        
        // Update the audio element's data attributes
        if (this.container.dataset) {
            this.container.dataset.src = trackData.src;
            this.container.dataset.title = trackData.title;
            this.container.dataset.duration = trackData.duration;
        }
        
        // Update track info in the UI
        const trackTitleEl = this.container.querySelector('.track-title');
        if (trackTitleEl) {
            trackTitleEl.textContent = trackData.title;
        }
        
        // Stop current audio if playing
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        
        // Load the new track
        await this.loadTrack(trackData.src);
        
        // Update UI
        this.updateTrackDisplay();
        
        // Auto-play the new track
        if (!this.previewEnded) {
            await this.play();
        }
    }
    
    // Enhanced loadTrack method to accept direct src
    async loadTrack(src = null) {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        
        const audioSrc = src || this.container.dataset.src;
        if (!audioSrc) {
            console.warn('No audio source available');
            return;
        }
        
        console.log('Loading audio from:', audioSrc);
        this.audio = new Audio(audioSrc);
        
        // Audio event listeners
        this.audio.addEventListener('loadstart', () => this.showLoading(true));
        this.audio.addEventListener('canplaythrough', () => this.showLoading(false));
        this.audio.addEventListener('timeupdate', () => this.handleTimeUpdate());
        this.audio.addEventListener('ended', () => this.onTrackEnded());
        this.audio.addEventListener('error', (e) => this.onAudioError(e));
        
        // Set volume
        const volumeSlider = this.container.querySelector('.volume-slider');
        if (volumeSlider) {
            this.audio.volume = volumeSlider.value / 100;
        } else {
            this.audio.volume = 0.7; // Default volume
        }
    }
    
    async togglePlayPause() {
        if (!this.currentTrack) {
            // Select first track if none selected
            await this.selectTrack(0);
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
      async play() {
        if (!this.audio) {
            await this.loadTrack();
        }
        
        // Reset preview ended state when playing again
        if (this.previewEnded) {
            this.audio.currentTime = 0;
            this.previewEnded = false;
            this.hidePreviewEndedMessage();
        }
        
        try {
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayPauseButton();
            this.updateTrackDisplay();
        } catch (error) {
            console.error('Error playing audio:', error);
            this.showError('Unable to play audio. Please try again.');
        }
    }
    
    pause() {
        if (this.audio) {
            this.audio.pause();
        }
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.updateTrackDisplay();
    }
    
    async previousTrack() {
        const prevIndex = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : this.tracks.length - 1;
        await this.selectTrack(prevIndex);
    }
    
    async nextTrack() {
        const nextIndex = this.currentTrackIndex < this.tracks.length - 1 ? this.currentTrackIndex + 1 : 0;
        await this.selectTrack(nextIndex);
    }
    
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }
      seekTo(percent) {
        if (this.audio && this.audio.duration) {
            let targetTime = this.audio.duration * percent;
            
            // In preview mode, don't allow seeking past the preview duration
            if (this.previewMode && !this.isPurchased) {
                targetTime = Math.min(targetTime, this.previewDuration);
            }
            
            this.audio.currentTime = targetTime;
        }
    }    handleTimeUpdate() {
        if (!this.audio) return;
        
        const currentTime = this.audio.currentTime;
        
        // Handle preview mode time limit
        if (this.previewMode && !this.isPurchased && currentTime >= this.previewDuration) {
            console.log('AudioPlayer: Preview limit reached', currentTime, 'seconds');
            this.audio.pause();
            this.isPlaying = false;
            this.previewEnded = true;
            this.updatePlayPauseButton();
            this.showPreviewEndedMessage();
            return;
        }
        
        this.updateProgress();
    }
    
    updateProgress() {
        if (!this.audio) return;
        
        const progressFill = this.container.querySelector('.progress-fill');
        const currentTimeDisplay = this.container.querySelector('.current-time');
        const durationDisplay = this.container.querySelector('.duration');
        const previewIndicator = this.container.querySelector('.preview-indicator');
        
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        
        if (progressFill && duration) {
            let maxTime = duration;
            if (this.previewMode && !this.isPurchased) {
                maxTime = Math.min(this.previewDuration, duration);
            }
            
            const percent = (currentTime / duration) * 100;
            const maxPercent = (maxTime / duration) * 100;
            
            progressFill.style.width = `${percent}%`;
            
            // Add preview limit indicator
            const progressBar = this.container.querySelector('.progress-bar');
            if (progressBar && this.previewMode && !this.isPurchased) {
                let previewLine = progressBar.querySelector('.preview-line');
                if (!previewLine) {
                    previewLine = document.createElement('div');
                    previewLine.className = 'preview-line';
                    progressBar.appendChild(previewLine);
                }
                previewLine.style.left = `${maxPercent}%`;
                previewLine.style.display = 'block';
            }
        }
        
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = this.formatTime(currentTime);
        }
        
        if (durationDisplay) {
            if (this.previewMode && !this.isPurchased) {
                durationDisplay.textContent = this.formatTime(this.previewDuration);
            } else {
                durationDisplay.textContent = this.formatTime(duration || 0);
            }
        }
        
        // Update preview indicator
        if (previewIndicator) {
            previewIndicator.style.display = (this.previewMode && !this.isPurchased) ? 'block' : 'none';
        }
    }
    
    updatePlayPauseButton() {
        const playPauseBtn = this.container.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            const icon = playPauseBtn.querySelector('i') || playPauseBtn;
            if (this.isPlaying) {
                icon.className = 'fas fa-pause';
                playPauseBtn.setAttribute('aria-label', 'Pause');
            } else {
                icon.className = 'fas fa-play';
                playPauseBtn.setAttribute('aria-label', 'Play');
            }
        }
    }
    
    updateTrackDisplay() {
        // Update current track info
        const currentTrackTitle = this.container.querySelector('.current-track-title');
        const currentTrackArtist = this.container.querySelector('.current-track-artist');
        
        if (currentTrackTitle && this.currentTrack) {
            currentTrackTitle.textContent = this.currentTrack.title;
        }
        
        if (currentTrackArtist) {
            currentTrackArtist.textContent = 'Mac Wayne';
        }
        
        // Update track list
        this.tracks.forEach((track, index) => {
            const element = track.element;
            element.classList.toggle('active', index === this.currentTrackIndex);
            element.classList.toggle('playing', index === this.currentTrackIndex && this.isPlaying);
        });
    }
      showPreviewEndedMessage() {
        // Remove any existing message
        this.hidePreviewEndedMessage();
        
        const messageContainer = document.createElement('div');
        messageContainer.className = 'preview-ended-message';
        messageContainer.innerHTML = `
            <div class="preview-message-content">
                <p class="preview-title">Preview Ended</p>
                <p class="preview-text">Purchase the full track to listen to the complete song</p>
                <button class="purchase-btn">Purchase Now</button>
            </div>
        `;
        
        // Add click listener to purchase button
        const purchaseBtn = messageContainer.querySelector('.purchase-btn');
        purchaseBtn.addEventListener('click', () => this.handlePurchaseClick());
        
        this.container.appendChild(messageContainer);
    }
    
    hidePreviewEndedMessage() {
        const existingMessage = this.container.querySelector('.preview-ended-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    handlePurchaseClick() {
        // Redirect to shop page or show purchase modal
        if (window.location.pathname !== '/shop.html') {
            window.location.href = '/shop.html';
        } else {
            // Show purchase modal or highlight purchase options
            this.showPurchaseModal();
        }
    }
    
    showPurchaseModal() {
        alert('Purchase functionality will be implemented here. Redirecting to shop...');
        window.location.href = '/shop.html';
    }
      // Method to unlock full tracks (for testing or after purchase)
    unlockFullTracks() {
        this.isPurchased = true;
        this.previewMode = false;
        this.hidePreviewEndedMessage();
        this.updateProgress();
        console.log('AudioPlayer: Full tracks unlocked');
    }
    
    // Debug method to check preview mode status
    getPreviewStatus() {
        return {
            previewMode: this.previewMode,
            isPurchased: this.isPurchased,
            previewDuration: this.previewDuration,
            previewEnded: this.previewEnded
        };
    }

    showLoading(show) {
        const loadingIndicator = this.container.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'block' : 'none';
        }
        
        // Add loading class to container
        this.container.classList.toggle('loading', show);
    }
    
    showError(message) {
        if (window.MacWayneUtils && window.MacWayneUtils.showNotification) {
            window.MacWayneUtils.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
    
    onTrackEnded() {
        // Auto-play next track
        this.nextTrack();
    }
    
    onAudioError(error) {
        console.error('Audio error:', error);
        this.showError('Error loading audio file');
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Public methods for external control
    getCurrentTrack() {
        return this.currentTrack;
    }
    
    getIsPlaying() {
        return this.isPlaying;
    }
    
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
    }
}

// Initialize all audio players on page load
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayerContainers = document.querySelectorAll('.audio-player');
    const audioPlayers = [];
    
    audioPlayerContainers.forEach(container => {
        const player = new AudioPlayer(container);
        audioPlayers.push(player);
    });
    
    // Store players globally for debugging
    window.audioPlayers = audioPlayers;
    
    // Global helper functions for testing
    window.testPreviewMode = function() {
        if (audioPlayers.length > 0) {
            console.log('Preview Status:', audioPlayers[0].getPreviewStatus());
            return audioPlayers[0].getPreviewStatus();
        }
    };
    
    window.unlockTracks = function() {
        audioPlayers.forEach(player => player.unlockFullTracks());
        console.log('All tracks unlocked');
    };
    
    console.log('AudioPlayer system initialized with', audioPlayers.length, 'players');
});

// Shop page integration and purchase functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize purchase buttons on shop page
    const purchaseButtons = document.querySelectorAll('.purchase-album');
    purchaseButtons.forEach(button => {
        button.addEventListener('click', handleAlbumPurchase);
    });
    
    // Check if user already purchased (from localStorage)
    const isPurchased = localStorage.getItem('mac-wayne-album-purchased') === 'true';
    if (isPurchased) {
        unlockAllTracks();
    }
});

function handleAlbumPurchase(event) {
    const albumId = event.target.dataset.album || 'blind-battered';
    
    // Simulate purchase process
    if (confirm(`Purchase "${albumId === 'blind-battered' ? 'Blind and Battered' : 'Album'}" for $9.99?\n\nThis will unlock full versions of all 20 tracks!`)) {
        // Simulate payment processing
        setTimeout(() => {
            // Mark as purchased
            localStorage.setItem('mac-wayne-album-purchased', 'true');
            localStorage.setItem('mac-wayne-purchase-date', new Date().toISOString());
            localStorage.setItem('mac-wayne-purchased-album', albumId);
            
            // Show success message
            alert('Purchase successful! All tracks are now unlocked. Enjoy the full album!');
            
            // Unlock tracks
            unlockAllTracks();
            
            // Update UI
            updatePurchaseUI();
        }, 1000);
    }
}

function unlockAllTracks() {
    // Update all audio players on the page
    if (window.audioPlayer) {
        window.audioPlayer.unlockFullTracks();
    }
    
    // Remove preview indicators from track list
    document.querySelectorAll('.preview-indicator').forEach(indicator => {
        indicator.style.display = 'none';
    });
    
    // Update track data attributes
    document.querySelectorAll('[data-preview="true"]').forEach(track => {
        track.setAttribute('data-preview', 'false');
        track.classList.add('purchased');
    });
    
    console.log('All tracks unlocked for user');
}

function updatePurchaseUI() {
    // Update purchase buttons to show "Downloaded" state
    document.querySelectorAll('.purchase-album').forEach(button => {
        button.textContent = 'Downloaded ✓';
        button.disabled = true;
        button.classList.add('purchased');
    });
    
    // Show purchase success indicator
    const successIndicator = document.createElement('div');
    successIndicator.className = 'purchase-success';
    successIndicator.innerHTML = `
        <div class="success-message">
            <h3>✓ Album Purchased</h3>
            <p>Thank you for supporting Mac Wayne! All tracks are now unlocked.</p>
        </div>
    `;
    
    // Add to the page
    const container = document.querySelector('.album-section') || document.querySelector('.products-section');
    if (container) {
        container.prepend(successIndicator);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successIndicator.style.opacity = '0';
            setTimeout(() => successIndicator.remove(), 500);
        }, 5000);
    }
}

// Global functions for testing
window.testPreviewMode = function() {
    console.log('Testing preview mode...');
    if (window.audioPlayer) {
        console.log('Preview status:', window.audioPlayer.getPreviewStatus());
    }
    
    // Test preview limit
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        if (audio.currentTime > 0) {
            console.log(`Audio currentTime: ${audio.currentTime}s`);
        }
    });
};

window.unlockTracks = function() {
    console.log('Unlocking all tracks...');
    localStorage.setItem('mac-wayne-album-purchased', 'true');
    unlockAllTracks();
    updatePurchaseUI();
};

window.resetPurchase = function() {
    console.log('Resetting purchase status...');
    localStorage.removeItem('mac-wayne-album-purchased');
    localStorage.removeItem('mac-wayne-purchase-date');
    location.reload();
};
