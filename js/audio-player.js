// Audio Player functionality for Mac Wayne Official website

class AudioPlayer {    constructor(container) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
            
        if (!this.container) {
            console.error('Audio player container not found');
            return;
        }
        
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
    }    setupTracks() {
        const trackElements = this.container.querySelectorAll('.track-item') || [];
        this.tracks = Array.from(trackElements).map((element, index) => ({
            index,
            element,
            title: element.querySelector('.track-title')?.textContent || element.dataset.title || `Track ${index + 1}`,
            duration: element.querySelector('.track-duration')?.textContent || element.dataset.duration || '0:00',
            src: element.dataset.src || '', // Audio file URL
            preview: element.dataset.preview === 'true', // Preview mode flag
            previewDuration: parseInt(element.dataset.previewDuration) || 30, // Custom preview duration
            onError: (e) => {
                console.error('Failed to load audio file:', e);
                this.showAudioLoadError();
            }
        }));
        
        // Also check if the main audio player has preview settings
        const mainPlayer = this.container.querySelector('.audio-player');
        if (mainPlayer && mainPlayer.dataset.preview === 'true') {
            this.previewMode = true;
        }
        
        console.log('Tracks setup complete:', this.tracks.length, 'tracks found');
    }
      setupEventListeners() {
        // Store event handlers for cleanup
        this.eventHandlers = new Map();
        
        // Play/pause button
        const playPauseBtn = this.container.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            // Remove any existing listeners to prevent duplicates
            if (this.playPauseListener) {
                playPauseBtn.removeEventListener('click', this.playPauseListener);
            }
            
            // Create a reference to the listener for later removal
            this.playPauseListener = () => this.togglePlayPause();
            playPauseBtn.addEventListener('click', this.playPauseListener);
            this.eventHandlers.set('playPause', this.playPauseListener);
        }
        
        // Previous/next buttons
        const prevBtn = this.container.querySelector('.prev-btn');
        const nextBtn = this.container.querySelector('.next-btn');
        
        if (prevBtn) {
            this.prevListener = () => this.previousTrack();
            prevBtn.addEventListener('click', this.prevListener);
            this.eventHandlers.set('prev', this.prevListener);
        }
        
        if (nextBtn) {
            this.nextListener = () => this.nextTrack();
            nextBtn.addEventListener('click', this.nextListener);
            this.eventHandlers.set('next', this.nextListener);
        }
        
        // Track items
        this.tracks.forEach((track, index) => {
            if (track.element) {
                const trackListener = () => this.selectTrack(index);
                track.element.addEventListener('click', trackListener);
                this.eventHandlers.set(`track-${index}`, trackListener);
            }
        });
        
        // Volume control
        const volumeSlider = this.container.querySelector('.volume-slider');
        if (volumeSlider) {
            this.volumeListener = (e) => this.setVolume(e.target.value / 100);
            volumeSlider.addEventListener('input', this.volumeListener);
            this.eventHandlers.set('volume', this.volumeListener);
        }
        
        console.log('Event listeners setup complete');
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
        
        // Handle preview mode time limit - strictly enforce 30 seconds
        if (this.previewMode && !this.isPurchased() && currentTime >= this.previewDuration) {
            console.log('AudioPlayer: Preview limit reached', currentTime, 'seconds');
            // Force the time to exactly the preview duration
            this.audio.currentTime = this.previewDuration;
            this.audio.pause();
            this.isPlaying = false;
            this.previewEnded = true;
            this.updatePlayPauseButton();
            this.showPreviewEndedMessage();
            
            // Log for debugging
            console.log('Preview ended at exactly:', this.previewDuration, 'seconds');
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
    }    // Method to unlock full tracks (for testing or after purchase)
    unlockFullTracks() {
        this.isPurchased = true;
        this.previewMode = false;
        this.hidePreviewEndedMessage();
        this.updateProgress();
        console.log('AudioPlayer: Full tracks unlocked');
    }
      showPreviewEndedMessage() {
        // Remove any existing message
        this.hidePreviewEndedMessage();
        
        const messageContainer = document.createElement('div');
        messageContainer.className = 'preview-ended-message';
        messageContainer.innerHTML = `
            <div class="preview-message-content">
                <p class="preview-title">30-Second Preview Ended</p>
                <p class="preview-text">Purchase the full album to listen to the complete song</p>
                <div class="preview-message-actions">
                    <button class="purchase-btn">
                        <i class="fas fa-shopping-cart"></i> Purchase Now
                    </button>
                    <button class="close-btn">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
                <div class="purchase-benefits">
                    <p><i class="fas fa-check"></i> Full-length tracks</p>
                    <p><i class="fas fa-check"></i> Offline listening</p>
                    <p><i class="fas fa-check"></i> Support Mac Wayne</p>
                </div>
            </div>
        `;
        
        // Add styles
        messageContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            border-radius: 8px;
        `;
        
        const messageContent = messageContainer.querySelector('.preview-message-content');
        messageContent.style.cssText = `
            background: #222;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #cc0000;
            max-width: 90%;
        `;
        
        // Add click listener to purchase button
        const purchaseBtn = messageContainer.querySelector('.purchase-btn');
        purchaseBtn.addEventListener('click', () => this.handlePurchaseClick());
        
        // Add click listener to close button
        const closeBtn = messageContainer.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.hidePreviewEndedMessage());
        
        // Style buttons
        purchaseBtn.style.cssText = `
            background: #cc0000;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin: 10px 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        
        closeBtn.style.cssText = `
            background: #444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin: 10px 5px;
            cursor: pointer;
        `;
        
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
        if (!window.location.pathname.includes('shop.html')) {
            window.location.href = 'shop.html';
        } else {
            // Show purchase modal or highlight purchase options
            this.showPurchaseModal();
        }
    }// Debug method to check preview mode status
    getPreviewStatus() {
        return {
            previewMode: this.previewMode,
            isPurchased: this.isPurchased(),
            previewDuration: this.previewDuration,
            previewEnded: this.previewEnded
        };
    }
      // Method to check if track is purchased
    isPurchased() {
        return localStorage.getItem('mac-wayne-album-purchased') === 'true' || this.isPurchased === true;
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
    
    // Method to show audio load error specifically
    showAudioLoadError() {
        const message = 'Unable to load audio. Please check your connection or try again later.';
        this.showError(message);
        
        // Add a visual indicator to the player
        this.container.classList.add('audio-error');
        
        // Add error message inside player if needed
        const playerControls = this.container.querySelector('.player-controls');
        if (playerControls) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'audio-error-message';
            errorMsg.textContent = 'Audio failed to load';
            playerControls.appendChild(errorMsg);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                errorMsg.remove();
                this.container.classList.remove('audio-error');
            }, 5000);
        }
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
            this.audio.src = '';
            this.audio = null;
        }
        
        // Clean up event listeners
        if (this.eventHandlers) {
            this.eventHandlers.forEach((handler, key) => {
                const elementType = key.split('-')[0];
                let element;
                
                if (elementType === 'playPause') {
                    element = this.container.querySelector('.play-pause-btn');
                } else if (elementType === 'prev') {
                    element = this.container.querySelector('.prev-btn');
                } else if (elementType === 'next') {
                    element = this.container.querySelector('.next-btn');
                } else if (elementType === 'volume') {
                    element = this.container.querySelector('.volume-slider');
                } else if (elementType === 'track') {
                    const index = parseInt(key.split('-')[1]);
                    element = this.tracks[index]?.element;
                }
                
                if (element) {
                    element.removeEventListener('click', handler);
                }
            });
        }
        
        console.log('AudioPlayer destroyed and events cleaned up');
    }
    showPurchaseModal() {
        // Create a nice purchase modal
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'purchase-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'purchase-modal-content';
        modalContent.style.cssText = `
            background: #222;
            color: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            border: 2px solid #cc0000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        
        modalContent.innerHTML = `
            <h2 style="color: #cc0000; margin-top: 0;">Purchase Full Album</h2>
            <p>Get unlimited access to all 20 tracks from "Blind and Battered" by Mac Wayne.</p>
            
            <div class="album-info" style="display: flex; align-items: center; margin: 20px 0;">
                <div class="album-cover" style="width: 100px; height: 100px; background: #000; margin-right: 15px; flex-shrink: 0; border: 1px solid #cc0000;"></div>
                <div>
                    <h3 style="margin-top: 0;">Blind and Battered</h3>
                    <p>Mac Wayne</p>
                    <p>20 Tracks • 65 minutes</p>
                    <p style="font-weight: bold; color: #cc0000;">$9.99</p>
                </div>
            </div>
            
            <div class="purchase-options" style="margin-top: 20px;">
                <button class="purchase-album-btn" style="background: #cc0000; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">
                    PURCHASE NOW - $9.99
                </button>
                
                <div style="margin-top: 15px; text-align: center;">
                    <button class="close-modal-btn" style="background: transparent; color: #aaa; border: 1px solid #aaa; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                        CANCEL
                    </button>
                </div>
            </div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Add event listeners
        const purchaseBtn = modalContent.querySelector('.purchase-album-btn');
        const closeBtn = modalContent.querySelector('.close-modal-btn');
        
        purchaseBtn.addEventListener('click', () => {
            // Simulate purchase
            if (confirm('Confirm purchase of "Blind and Battered" for $9.99?')) {
                // Mark as purchased
                localStorage.setItem('mac-wayne-album-purchased', 'true');
                localStorage.setItem('mac-wayne-purchase-date', new Date().toISOString());
                
                // Show success message
                alert('Purchase successful! Full album unlocked.');
                
                // Unlock tracks
                if (window.unlockTracks && typeof window.unlockTracks === 'function') {
                    window.unlockTracks();
                } else {
                    this.unlockFullTracks();
                    this.updateProgress();
                }
                
                // Close modal
                modalOverlay.remove();
            }
        });
        
        closeBtn.addEventListener('click', () => {
            modalOverlay.remove();
        });
    }
}

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
