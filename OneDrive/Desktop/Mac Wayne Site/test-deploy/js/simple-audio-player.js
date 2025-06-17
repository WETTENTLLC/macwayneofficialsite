// Simple Audio Player - Enhanced with Purchase Integration
class SimpleAudioPlayer {
    constructor(container) {
        this.container = container;
        this.audio = null;
        this.isPlaying = false;
        this.isPreviewMode = !this.isPurchased();
        this.previewDuration = 30; // 30 seconds
        this.previewWarningShown = false;
        this.purchaseModalShown = false;
        
        console.log('SimpleAudioPlayer initializing...', {
            container: this.container,
            isPreviewMode: this.isPreviewMode,
            isPurchased: this.isPurchased()
        });
        
        this.init();
    }
    
    isPurchased() {
        // Check multiple purchase sources
        const albumPurchased = localStorage.getItem('mac-wayne-album-purchased') === 'true';
        const trackPurchased = localStorage.getItem(`track-purchased-${this.getTrackId()}`) === 'true';
        return albumPurchased || trackPurchased;
    }
    
    getTrackId() {
        return this.container.dataset.title ? 
            this.container.dataset.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 
            'unknown-track';
    }
    
    init() {
        // Get track data from container
        this.src = this.container.dataset.src;
        this.title = this.container.dataset.title;
        this.duration = this.container.dataset.duration;
        
        console.log('Track data:', { src: this.src, title: this.title, duration: this.duration });
        
        // Find elements
        this.playBtn = this.container.querySelector('.play-btn');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.progressFill = this.container.querySelector('.progress-fill');
        this.currentTimeEl = this.container.querySelector('.current-time');
        this.durationEl = this.container.querySelector('.duration');
        this.audioEl = this.container.querySelector('audio');
        
        console.log('Elements found:', {
            playBtn: !!this.playBtn,
            progressBar: !!this.progressBar,
            audioEl: !!this.audioEl
        });
        
        // Setup audio element
        if (!this.audioEl) {
            this.audioEl = document.createElement('audio');
            this.container.appendChild(this.audioEl);
        }
        
        this.audioEl.preload = 'metadata';
        
        // Add event listeners
        this.setupEventListeners();
        
        // Update UI based on purchase status
        this.updatePreviewStatus();
        
        console.log('SimpleAudioPlayer initialized successfully');
    }
    
    setupEventListeners() {
        // Play button
        if (this.playBtn) {
            this.playBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Play button clicked');
                this.togglePlayPause();
            });
        }
        
        // Progress bar
        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => {
                e.preventDefault();
                const rect = this.progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.seek(percent);
            });
        }
        
        // Audio events
        if (this.audioEl) {
            this.audioEl.addEventListener('loadstart', () => console.log('Audio loading started'));
            this.audioEl.addEventListener('canplay', () => console.log('Audio can play'));
            this.audioEl.addEventListener('timeupdate', () => this.updateProgress());
            this.audioEl.addEventListener('ended', () => this.onEnded());
            this.audioEl.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                this.showError('Audio failed to load');
            });
        }
    }
    
    async togglePlayPause() {
        console.log('togglePlayPause called, isPlaying:', this.isPlaying);
        
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
    
    async play() {
        console.log('play() called');
        
        try {
            // Load audio if not loaded
            if (!this.audioEl.src || this.audioEl.src === '') {
                console.log('Loading audio source:', this.src);
                this.audioEl.src = this.src;
            }
            
            // Play the audio
            await this.audioEl.play();
            this.isPlaying = true;
            this.updatePlayButton();
            
            console.log('Audio playing successfully');
            
        } catch (error) {
            console.error('Play failed:', error);
            this.showError('Unable to play audio. Please try again.');
        }
    }
    
    pause() {
        console.log('pause() called');
        
        if (this.audioEl) {
            this.audioEl.pause();
        }
        this.isPlaying = false;
        this.updatePlayButton();
        
        console.log('Audio paused');
    }
    
    seek(percent) {
        if (this.audioEl && this.audioEl.duration) {
            let targetTime = this.audioEl.duration * percent;
            
            // Limit seeking in preview mode
            if (this.isPreviewMode && !this.isPurchased) {
                targetTime = Math.min(targetTime, this.previewDuration);
            }
            
            this.audioEl.currentTime = targetTime;
            console.log('Seeked to:', targetTime);
        }
    }
    
    updateProgress() {
        if (!this.audioEl) return;
        
        const currentTime = this.audioEl.currentTime;
        const duration = this.audioEl.duration || 0;
        
        // Check preview limit
        if (this.isPreviewMode && !this.isPurchased && currentTime >= this.previewDuration) {
            console.log('Preview limit reached, pausing');
            this.pause();
            this.showPreviewMessage();
            return;
        }
        
        // Update progress bar
        if (this.progressFill && duration > 0) {
            const percent = (currentTime / duration) * 100;
            this.progressFill.style.width = `${percent}%`;
        }
        
        // Update time displays
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(currentTime);
        }
        
        if (this.durationEl) {
            const displayDuration = this.isPreviewMode && !this.isPurchased ? this.previewDuration : duration;
            this.durationEl.textContent = this.formatTime(displayDuration);
        }
    }
    
    updatePlayButton() {
        if (!this.playBtn) return;
        
        const playIcon = this.playBtn.querySelector('.play-icon');
        const pauseIcon = this.playBtn.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        } else {
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
        
        console.log('Play button updated, isPlaying:', this.isPlaying);
    }
    
    updatePreviewStatus() {
        const previewIndicator = this.container.querySelector('.preview-indicator');
        
        if (this.isPurchased) {
            if (previewIndicator) {
                previewIndicator.style.display = 'none';
            }
            this.isPreviewMode = false;
        } else {
            if (previewIndicator) {
                previewIndicator.style.display = 'inline';
                previewIndicator.textContent = '30-Sec Preview';
            }
        }
        
        console.log('Preview status updated:', {
            isPreviewMode: this.isPreviewMode,
            isPurchased: this.isPurchased
        });
    }
    
    showPreviewMessage() {
        // Remove existing message
        const existingMessage = document.querySelector('.preview-message-overlay');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const overlay = document.createElement('div');
        overlay.className = 'preview-message-overlay';
        overlay.innerHTML = `
            <div class="preview-message">
                <h3>Preview Ended</h3>
                <p>Purchase the full album to hear complete tracks!</p>
                <button onclick="window.location.href='shop.html'" class="purchase-now-btn">
                    Purchase Now - $9.99
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">
                    Close
                </button>
            </div>
        `;
        
        // Add styles
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const message = overlay.querySelector('.preview-message');
        message.style.cssText = `
            background: white;
            color: black;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        
        const purchaseBtn = overlay.querySelector('.purchase-now-btn');
        purchaseBtn.style.cssText = `
            background: #cc0000;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            margin: 10px 5px;
        `;
        
        const closeBtn = overlay.querySelector('.close-btn');
        closeBtn.style.cssText = `
            background: #666;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            margin: 10px 5px;
        `;
        
        document.body.appendChild(overlay);
        
        console.log('Preview message displayed');
    }
    
    onEnded() {
        this.isPlaying = false;
        this.updatePlayButton();
        console.log('Audio ended');
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    showError(message) {
        console.error('Audio Player Error:', message);
        alert(message); // Simple error display
    }
      // Public method to load new track
    loadTrack(trackData) {
        console.log('Loading new track:', trackData);
        
        this.src = trackData.src;
        this.title = trackData.title;
        this.duration = trackData.duration;
        
        // Update UI
        const titleEl = this.container.querySelector('.track-title');
        if (titleEl) titleEl.textContent = this.title;
        
        // Reset audio
        if (this.audioEl) {
            this.audioEl.src = '';
            this.audioEl.currentTime = 0;
        }
        
        this.isPlaying = false;
        this.updatePlayButton();
        
        // Auto-play
        this.play();
    }
    
    // Alias for compatibility
    loadNewTrack(trackData) {
        return this.loadTrack(trackData);
    }
}

// Initialize simple audio players when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing simple audio players...');
    
    // Initialize featured player
    const featuredPlayer = document.querySelector('.featured-player .audio-player');
    if (featuredPlayer) {
        console.log('Initializing featured player...');
        window.simpleAudioPlayer = new SimpleAudioPlayer(featuredPlayer);
    } else {
        console.log('Featured player not found');
    }
    
    // Handle mini play buttons
    const miniPlayBtns = document.querySelectorAll('.mini-play-btn');
    console.log('Found mini play buttons:', miniPlayBtns.length);
    
    miniPlayBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Mini play button clicked:', index);
            
            const trackItem = this.closest('.track-item');
            if (trackItem && window.simpleAudioPlayer) {
                const trackData = {
                    src: trackItem.dataset.src,
                    title: trackItem.dataset.title,
                    duration: trackItem.dataset.duration
                };
                
                console.log('Loading track from mini button:', trackData);
                window.simpleAudioPlayer.loadTrack(trackData);
            }
        });
    });
    
    console.log('Simple audio player initialization complete');
});

// Global functions for testing
window.unlockTracks = function() {
    console.log('Unlocking tracks...');
    localStorage.setItem('mac-wayne-album-purchased', 'true');
    
    if (window.simpleAudioPlayer) {
        window.simpleAudioPlayer.isPurchased = true;
        window.simpleAudioPlayer.updatePreviewStatus();
    }
    
    // Update all preview indicators
    document.querySelectorAll('.preview-indicator').forEach(indicator => {
        indicator.style.display = 'none';
    });
    
    alert('All tracks unlocked! Preview mode disabled.');
};

window.resetPurchase = function() {
    console.log('Resetting purchase...');
    localStorage.removeItem('mac-wayne-album-purchased');
    location.reload();
};

window.testAudio = function() {
    console.log('Testing audio player...');
    if (window.simpleAudioPlayer) {
        console.log('Audio player state:', {
            isPlaying: window.simpleAudioPlayer.isPlaying,
            src: window.simpleAudioPlayer.src,
            isPurchased: window.simpleAudioPlayer.isPurchased
        });
    } else {
        console.log('No audio player found');
    }
};
