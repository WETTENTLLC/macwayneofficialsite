// Simple Audio Player - Enhanced with Purchase Integration
class SimpleAudioPlayer {
    constructor(container) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
            
        if (!this.container) {
            console.error('Audio player container not found');
            return;
        }
        
        // Store instance reference in the container
        this.container.SimpleAudioPlayerInstance = this;
        
        this.audio = null;
        this.isPlaying = false;
        this.isPreviewMode = !this.isPurchased();
        this.previewDuration = 30; // 30 seconds
        this.previewWarningShown = false;
        this.purchaseModalShown = false;
        this.initErrors = 0; // Track initialization errors for retry logic
        
        console.log('SimpleAudioPlayer initializing...', {
            container: this.container,
            isPreviewMode: this.isPreviewMode,
            isPurchased: this.isPurchased()
        });
        
        // Ensure clean initialization
        this.cleanupExistingAudio();
        this.init();
    }
    
    // Clean up any existing audio elements
    cleanupExistingAudio() {
        // Remove existing audio elements to prevent duplicates
        const existingAudio = this.container.querySelector('audio');
        if (existingAudio) {
            existingAudio.pause();
            existingAudio.src = '';
            existingAudio.remove();
        }
        
        // Remove any error messages
        const errorMessage = this.container.querySelector('.audio-error-message, .player-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    isPurchased() {
        // Check multiple purchase sources
        const albumPurchased = localStorage.getItem('mac-wayne-album-purchased') === 'true';
        const trackPurchased = localStorage.getItem(`track-purchased-${this.getTrackId()}`) === 'true';
        return albumPurchased || trackPurchased || this.isPurchased === true;
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
        
        // Check if we can create audio elements
        try {
            const testAudio = new Audio();
            console.log('Audio element created successfully');
        } catch (error) {
            console.error('Cannot create Audio element:', error);
            this.showError('Browser cannot create audio elements. Please try a different browser.');
            return;
        }
        
        // Setup audio element
        if (!this.audioEl) {
            this.audioEl = document.createElement('audio');
            this.container.appendChild(this.audioEl);
        }
        
        this.audioEl.preload = 'metadata';
        
        // Add status indicator for player
        this.addStatusIndicator();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Update UI based on purchase status
        this.updatePreviewStatus();
        
        console.log('SimpleAudioPlayer initialized successfully');
    }
    
    addStatusIndicator() {
        // Remove existing indicator if present
        const existing = this.container.querySelector('.player-status-indicator');
        if (existing) existing.remove();
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'player-status-indicator';
        statusIndicator.style.position = 'absolute';
        statusIndicator.style.top = '-10px';
        statusIndicator.style.right = '-10px';
        statusIndicator.style.width = '10px';
        statusIndicator.style.height = '10px';
        statusIndicator.style.borderRadius = '50%';
        statusIndicator.style.backgroundColor = '#ccc';
        statusIndicator.style.transition = 'all 0.3s';
        statusIndicator.style.zIndex = '10';
        
        this.statusIndicator = statusIndicator;
        this.container.style.position = 'relative';
        this.container.appendChild(statusIndicator);
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
            
            // Add hover effect for better visibility
            this.playBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                this.style.backgroundColor = '#ee0000';
            });
            
            this.playBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                this.style.backgroundColor = '#cc0000';
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
                this.showError('Audio failed to load. Trying fallback...');
                this.tryFallbackAudio();
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
            // Update status indicator to show loading
            if (this.statusIndicator) {
                this.statusIndicator.style.backgroundColor = '#ffcc00'; // Yellow for loading
            }
            // Load audio if not loaded
            if (!this.audioEl.src || this.audioEl.src === '') {
                console.log('Loading audio source:', this.src);
                if (!this.src) {
                    throw new Error('No audio source provided');
                }
                await this.loadAudioSource();
            }
            // Wait for canplay before calling play
            await new Promise((resolve, reject) => {
                if (this.audioEl.readyState >= 3) { // HAVE_FUTURE_DATA
                    resolve();
                } else {
                    const onCanPlay = () => {
                        this.audioEl.removeEventListener('canplay', onCanPlay);
                        this.audioEl.removeEventListener('error', onError);
                        resolve();
                    };
                    const onError = (e) => {
                        this.audioEl.removeEventListener('canplay', onCanPlay);
                        this.audioEl.removeEventListener('error', onError);
                        reject(new Error('Audio failed to load'));
                    };
                    this.audioEl.addEventListener('canplay', onCanPlay);
                    this.audioEl.addEventListener('error', onError);
                }
            });
            // Play the audio
            await this.audioEl.play();
            this.isPlaying = true;
            this.updatePlayButton();
            if (this.statusIndicator) {
                this.statusIndicator.style.backgroundColor = '#00cc00'; // Green for playing
            }
            console.log('Audio playing successfully');
        } catch (error) {
            console.error('Play failed:', error);
            this.showError(`Unable to play audio: ${error.message || 'Unknown error'}`);
            this.container.classList.remove('loading');
            const spinner = this.container.querySelector('.loading-spinner');
            if (spinner) spinner.remove();
            if (this.statusIndicator) {
                this.statusIndicator.style.backgroundColor = '#cc0000'; // Red for error
            }
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }
    
    async loadAudioSource() {
        // Map of fallback CDN audio sources
        const fallbackAudios = {
            'track1.mp3': 'audio/track1.mp3',
            'track2.mp3': 'audio/track2.mp3',
            'track3.mp3': 'audio/track3.mp3',
            'sample-preview.mp3': 'audio/sample-preview.mp3'
        };
        
        // Try to determine if we need to use a fallback
        const filename = this.src.split('/').pop();
        const hasFileSize = await this.checkFileSize(this.src);
        
        if ((filename in fallbackAudios) && (!hasFileSize || hasFileSize < 1000)) {
            console.log(`Local file ${filename} is missing or corrupt (${hasFileSize} bytes), using fallback`);
            this.src = fallbackAudios[filename];
        }
        
        this.audioEl.src = this.src;
        
        // Add loading indicator
        this.showLoadingIndicator();
        
        // Wait for audio to be loaded with timeout
        try {
            await Promise.race([
                this.waitForAudioLoad(),
                this.createTimeout(10000, 'Audio loading timeout')
            ]);
        } catch (error) {
            console.error('Audio loading failed:', error);
            
            // Try using fallback directly as a last resort
            if (filename in fallbackAudios && this.src !== fallbackAudios[filename]) {
                console.log('Trying CDN fallback as last resort');
                this.src = fallbackAudios[filename];
                this.audioEl.src = this.src;
                
                // Wait again for the fallback to load
                await Promise.race([
                    this.waitForAudioLoad(),
                    this.createTimeout(10000, 'Fallback audio loading timeout')
                ]);
            } else {
                throw error; // Re-throw if we can't use fallback
            }
        }
        
        // Remove loading indicator
        this.hideLoadingIndicator();
    }
    
    waitForAudioLoad() {
        return new Promise((resolve, reject) => {
            const onCanPlay = () => {
                console.log('Audio loaded successfully:', this.src);
                this.audioEl.removeEventListener('error', onError);
                resolve();
            };
            
            const onError = (e) => {
                console.error('Error loading audio:', e);
                this.audioEl.removeEventListener('canplay', onCanPlay);
                reject(new Error(`Failed to load audio: ${e.message || 'Unknown error'}`));
            };
            
            this.audioEl.addEventListener('canplay', onCanPlay, { once: true });
            this.audioEl.addEventListener('error', onError, { once: true });
        });
    }
    
    createTimeout(ms, message) {
        return new Promise((_, reject) => 
            setTimeout(() => reject(new Error(message)), ms)
        );
    }
    
    showLoadingIndicator() {
        this.container.classList.add('loading');
        let loadingSpinner = this.container.querySelector('.loading-spinner');
        if (!loadingSpinner) {
            loadingSpinner = document.createElement('div');
            loadingSpinner.className = 'loading-spinner';
            loadingSpinner.innerHTML = '<div class="spinner"></div>';
            
            // Style the loading spinner
            loadingSpinner.style.position = 'absolute';
            loadingSpinner.style.top = '0';
            loadingSpinner.style.left = '0';
            loadingSpinner.style.right = '0';
            loadingSpinner.style.bottom = '0';
            loadingSpinner.style.display = 'flex';
            loadingSpinner.style.alignItems = 'center';
            loadingSpinner.style.justifyContent = 'center';
            loadingSpinner.style.background = 'rgba(0, 0, 0, 0.5)';
            loadingSpinner.style.borderRadius = '8px';
            loadingSpinner.style.zIndex = '10';
            
            const spinnerInner = loadingSpinner.querySelector('.spinner');
            if (spinnerInner) {
                spinnerInner.style.width = '30px';
                spinnerInner.style.height = '30px';
                spinnerInner.style.border = '3px solid rgba(255,255,255,0.3)';
                spinnerInner.style.borderRadius = '50%';
                spinnerInner.style.borderTopColor = '#fff';
                spinnerInner.style.animation = 'spin 1s linear infinite';
            }
            
            this.container.appendChild(loadingSpinner);
            
            // Add keyframe animation for spinner if it doesn't exist
            if (!document.querySelector('#spinner-keyframes')) {
                const style = document.createElement('style');
                style.id = 'spinner-keyframes';
                style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }
        }
    }
    
    hideLoadingIndicator() {
        this.container.classList.remove('loading');
        const spinner = this.container.querySelector('.loading-spinner');
        if (spinner) spinner.remove();
    }
    
    // Method to check file size before loading
    async checkFileSize(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) return false;
            
            const contentLength = response.headers.get('content-length');
            return contentLength ? parseInt(contentLength, 10) : false;
        } catch (error) {
            console.warn('Error checking file size:', error);
            return false;
        }
    }
    
    pause() {
        console.log('pause() called');
        
        if (this.audioEl) {
            this.audioEl.pause();
        }
        this.isPlaying = false;
        this.updatePlayButton();
        
        // Update status indicator
        if (this.statusIndicator) {
            this.statusIndicator.style.backgroundColor = '#ccc'; // Gray for paused
        }
        
        console.log('Audio paused');
    }
    
    seek(percent) {
        if (this.audioEl && this.audioEl.duration) {
            let targetTime = this.audioEl.duration * percent;
            
            // In preview mode, don't allow seeking past the preview duration
            if (this.isPreviewMode && !this.isPurchased()) {
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
        
        // Check preview limit - strictly enforce 30 seconds
        if (this.isPreviewMode && !this.isPurchased() && currentTime >= this.previewDuration) {
            console.log('Preview limit reached, pausing at exactly:', this.previewDuration, 'seconds');
            // Force the current time to exactly the preview duration
            this.audioEl.currentTime = this.previewDuration;
            this.audioEl.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.showPreviewMessage();
            return;
        }
        
        // Update progress bar
        if (this.progressFill && duration > 0) {
            const percent = (currentTime / duration) * 100;
            this.progressFill.style.width = `${percent}%`;
            
            // Add preview limit marker
            if (this.isPreviewMode && !this.isPurchased()) {
                const previewPercent = (this.previewDuration / duration) * 100;
                let previewMarker = this.progressBar.querySelector('.preview-marker');
                
                if (!previewMarker) {
                    previewMarker = document.createElement('div');
                    previewMarker.className = 'preview-marker';
                    previewMarker.style.position = 'absolute';
                    previewMarker.style.top = '0';
                    previewMarker.style.bottom = '0';
                    previewMarker.style.width = '2px';
                    previewMarker.style.backgroundColor = 'red';
                    previewMarker.style.zIndex = '10';
                    this.progressBar.appendChild(previewMarker);
                }
                
                previewMarker.style.left = `${previewPercent}%`;
            }
        }
        
        // Update time displays
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(currentTime);
        }
        
        if (this.durationEl) {
            // In preview mode, show the preview duration instead of full track duration
            const displayDuration = this.isPreviewMode && !this.isPurchased() ? 
                Math.min(this.previewDuration, duration) : duration;
            this.durationEl.textContent = this.formatTime(displayDuration);
        }
    }
    
    updatePlayButton() {
        if (!this.playBtn) return;
        
        const playIcon = this.playBtn.querySelector('.play-icon');
        const pauseIcon = this.playBtn.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            if (playIcon) {
                playIcon.classList.add('hidden');
                playIcon.style.display = 'none';
            }
            if (pauseIcon) {
                pauseIcon.classList.remove('hidden');
                pauseIcon.style.display = 'block';
            }
            this.playBtn.setAttribute('aria-label', 'Pause');
            this.playBtn.classList.add('playing');
        } else {
            if (playIcon) {
                playIcon.classList.remove('hidden');
                playIcon.style.display = 'block';
            }
            if (pauseIcon) {
                pauseIcon.classList.add('hidden');
                pauseIcon.style.display = 'none';
            }
            this.playBtn.setAttribute('aria-label', 'Play');
            this.playBtn.classList.remove('playing');
        }
        
        // Make sure play button is always visible with clear hover state
        this.playBtn.style.opacity = '1';
        
        console.log('Play button updated, isPlaying:', this.isPlaying);
    }
    
    updatePreviewStatus() {
        const previewIndicator = this.container.querySelector('.preview-indicator');
        
        if (this.isPurchased()) {
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
            isPurchased: this.isPurchased()
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
        
        const messageHTML = '<div class="preview-message">' +
            '<h3>30-Second Preview Ended</h3>' +
            '<p>You have listened to the 30-second preview. Purchase the full album to hear complete tracks!</p>' +
            '<div class="preview-message-actions">' +
                '<button class="purchase-now-btn">' +
                    '<i class="fas fa-shopping-cart"></i> Purchase Album - $9.99' +
                '</button>' +
                '<button class="close-btn">' +
                    '<i class="fas fa-times"></i> Close' +
                '</button>' +
            '</div>' +
            '<div class="purchase-benefits">' +
                '<p><i class="fas fa-check"></i> Full-length tracks</p>' +
                '<p><i class="fas fa-check"></i> Offline listening</p>' +
                '<p><i class="fas fa-check"></i> Support Mac Wayne</p>' +
            '</div>' +
        '</div>';
        
        overlay.innerHTML = messageHTML;
        
        // Style the overlay
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(0, 0, 0, 0.85)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10000';
        overlay.style.animation = 'fadeIn 0.3s ease';
        
        const message = overlay.querySelector('.preview-message');
        message.style.background = '#1a1a1a';
        message.style.color = 'white';
        message.style.padding = '30px';
        message.style.borderRadius = '15px';
        message.style.textAlign = 'center';
        message.style.maxWidth = '450px';
        message.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        message.style.border = '2px solid #cc0000';
        message.style.animation = 'scaleIn 0.3s ease';
        
        const purchaseBtn = overlay.querySelector('.purchase-now-btn');
        purchaseBtn.style.background = '#cc0000';
        purchaseBtn.style.color = 'white';
        purchaseBtn.style.border = 'none';
        purchaseBtn.style.padding = '12px 25px';
        purchaseBtn.style.borderRadius = '25px';
        purchaseBtn.style.fontWeight = 'bold';
        purchaseBtn.style.cursor = 'pointer';
        purchaseBtn.style.margin = '10px 5px';
        purchaseBtn.style.display = 'inline-flex';
        purchaseBtn.style.alignItems = 'center';
        purchaseBtn.style.gap = '8px';
        purchaseBtn.style.transition = 'all 0.2s ease';
        
        const closeBtn = overlay.querySelector('.close-btn');
        closeBtn.style.background = '#333';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.padding = '12px 25px';
        closeBtn.style.borderRadius = '25px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.margin = '10px 5px';
        closeBtn.style.display = 'inline-flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.gap = '8px';
        closeBtn.style.transition = 'all 0.2s ease';
        
        const benefits = overlay.querySelector('.purchase-benefits');
        benefits.style.marginTop = '20px';
        benefits.style.textAlign = 'left';
        benefits.style.fontSize = '14px';
        benefits.style.background = 'rgba(255, 255, 255, 0.05)';
        benefits.style.padding = '15px';
        benefits.style.borderRadius = '10px';
        
        benefits.querySelectorAll('p').forEach(p => {
            p.style.margin = '8px 0';
            const icon = p.querySelector('i');
            if (icon) {
                icon.style.color = '#cc0000';
                icon.style.marginRight = '8px';
            }
        });
        
        // Add event listeners
        purchaseBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
        
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });
        
        document.body.appendChild(overlay);
        
        console.log('Preview message displayed');
    }
    
    onEnded() {
        this.isPlaying = false;
        this.updatePlayButton();
        
        // Update status indicator
        if (this.statusIndicator) {
            this.statusIndicator.style.backgroundColor = '#ccc'; // Gray for ended
        }
        
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
        
        // Create an error element if it doesn't exist
        let errorEl = this.container.querySelector('.player-error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'player-error-message';
            
            // Style the error message
            errorEl.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
            errorEl.style.color = '#dc3545';
            errorEl.style.padding = '8px 12px';
            errorEl.style.borderRadius = '4px';
            errorEl.style.marginTop = '10px';
            errorEl.style.fontSize = '14px';
            errorEl.style.display = 'flex';
            errorEl.style.alignItems = 'center';
            errorEl.style.border = '1px solid rgba(220, 53, 69, 0.3)';
            
            // Add an icon
            const icon = document.createElement('span');
            icon.innerHTML = '⚠️';
            icon.style.marginRight = '8px';
            errorEl.appendChild(icon);
            
            // Add message container
            const messageEl = document.createElement('span');
            errorEl.appendChild(messageEl);
            
            // Add a retry button
            const retryBtn = document.createElement('button');
            retryBtn.textContent = 'Try Again';
            retryBtn.style.marginLeft = 'auto';
            retryBtn.style.backgroundColor = '#dc3545';
            retryBtn.style.color = 'white';
            retryBtn.style.border = 'none';
            retryBtn.style.padding = '4px 8px';
            retryBtn.style.borderRadius = '4px';
            retryBtn.style.cursor = 'pointer';
            retryBtn.style.fontSize = '12px';
            
            retryBtn.addEventListener('click', () => {
                errorEl.remove();
                this.tryFallbackAudio();
            });
            
            errorEl.appendChild(retryBtn);
            this.container.appendChild(errorEl);
        }
        
        // Update the message
        const messageEl = errorEl.querySelector('span:nth-child(2)');
        if (messageEl) {
            messageEl.textContent = message;
        }
    }
    
    // Try fallback audio sources
    tryFallbackAudio() {
        if (this._triedFallback) {
            this.showError('All audio sources failed. Please try again later.');
            return;
        }
        this._triedFallback = true;
        console.log('Trying fallback audio sources');
        const fallbackAudios = {
            'track1.mp3': 'audio/track1.mp3',
            'track2.mp3': 'audio/track2.mp3',
            'track3.mp3': 'audio/track3.mp3',
            'sample-preview.mp3': 'audio/sample-preview.mp3'
        };
        let fallbackSrc = null;
        if (this.src) {
            const filename = this.src.split('/').pop();
            if (fallbackAudios[filename]) {
                fallbackSrc = fallbackAudios[filename];
            } else {
                fallbackSrc = fallbackAudios['sample-preview.mp3'];
            }
        } else {
            fallbackSrc = fallbackAudios['sample-preview.mp3'];
        }
        console.log('Using fallback audio:', fallbackSrc);
        this.src = fallbackSrc;
        if (this.audioEl) {
            this.audioEl.src = this.src;
            // Only call play if not already in fallback mode
            if (!this._fallbackTriedOnce) {
                this._fallbackTriedOnce = true;
                this.play();
            }
        }
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
        // Add hover effect for better visibility
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            this.style.backgroundColor = '#ee0000';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            this.style.backgroundColor = '#cc0000';
        });
        
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
                
                // Provide visual feedback
                document.querySelectorAll('.track-item').forEach(item => {
                    item.style.backgroundColor = '';
                });
                trackItem.style.backgroundColor = 'rgba(204, 0, 0, 0.15)';
                
                // Scroll to the featured player if it's not visible
                const featuredPlayer = document.querySelector('.featured-player');
                if (featuredPlayer) {
                    featuredPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
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
            isPurchased: window.simpleAudioPlayer.isPurchased()
        });
    } else {
        console.log('No audio player found');
    }
};
