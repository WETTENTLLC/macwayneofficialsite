// Enhanced Audio Player with PayPal Integration
class NewAudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isPurchased = localStorage.getItem('purchased') === 'true';
        this.purchasedTracks = JSON.parse(localStorage.getItem('purchasedTracks') || '[]');
        this.currentTrack = null;
        this.previewDuration = 30; // 30 seconds preview
        this.albumPrice = 9.99;
        this.trackPrice = 1.99;
        this.tracks = [];
        this.init();
    }

    init() {
        // Setup player controls
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Setup track list and store track data
        const trackElements = document.querySelectorAll('.track-item');
        this.tracks = [];
        trackElements.forEach((track, index) => {
            // Ensure track id matches HTML markup (track-1, track-2, ... track-20)
            const trackId = track.dataset.id || `track-${index + 1}`;
            const trackData = {
                id: trackId,
                title: track.querySelector('.track-name')?.textContent || `Track ${index + 1}`,
                sampleSrc: track.dataset.src,
                fullSrc: track.dataset.fullSrc,
                element: track,
                index: index
            };
            this.tracks.push(trackData);

            // Setup play button handler (mini-play-btn)
            const miniBtn = track.querySelector('.mini-play-btn');
            if (miniBtn) {
                miniBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadTrack(trackData);
                    this.audio.load();  // Ensure audio is loaded
                    this.play();  // Start playback immediately
                });
            }

            // Setup purchase button handler
            const purchaseTrackBtn = track.querySelector('.purchase-track');
            if (purchaseTrackBtn) {
                purchaseTrackBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.purchaseTrack(trackData);
                });
            }
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audio.addEventListener('error', () => this.onError());

        // Purchase album button
        const purchaseBtn = document.querySelector('.purchase-album');
        if (purchaseBtn) {
            purchaseBtn.addEventListener('click', () => this.purchaseAlbum());
        }
        
        // Initialize PayPal
        this.initPayPal();

        this.updatePurchaseStatus();
    }

    loadTrack(trackData) {
        if (!trackData) {
            console.error('No track data provided');
            return;
        }
        
        console.log('Loading track:', trackData.title);
        console.log('Track data:', trackData);
        
        // Pause current playback first
        this.pause();
        
        // Remove previous active track
        document.querySelectorAll('.track-item').forEach(t => t.classList.remove('playing'));
        
        // Set current track as active
        if (trackData.element) {
            trackData.element.classList.add('playing');
            this.currentTrack = trackData;
        }
        
        // Determine if we should play full track or sample
        const isTrackPurchased = this.isPurchased || this.purchasedTracks.includes(trackData.id);
        const src = isTrackPurchased && trackData.fullSrc ? trackData.fullSrc : trackData.sampleSrc;
        
        console.log('Audio source:', src);
        console.log('Is purchased:', isTrackPurchased);
        
        if (!src) {
            console.error('No audio source available for track:', trackData.title);
            return;
        }
        
        try {
            // Set new source and update info
            this.audio.src = src;
            this.audio.preload = 'auto';  // Ensure audio is preloaded
            
            // Add error handler for loading
            this.audio.onerror = (e) => {
                console.error('Error loading audio:', e);
                console.error('Audio error code:', this.audio.error?.code);
                console.error('Audio error message:', this.audio.error?.message);
            };
            
            this.updateTrackInfo(trackData);
            
            // Load and play
            console.log('Loading audio...');
            this.audio.load();
            
            // Wait for load before playing
            this.audio.oncanplay = () => {
                console.log('Audio loaded, starting playback...');
                this.play();
            };
        } catch (error) {
            console.error('Error in loadTrack:', error);
        }
    }

    updateTrackInfo(trackData) {
        const titleEl = document.querySelector('.track-title');
        const artistEl = document.querySelector('.track-artist');
        
        if (titleEl && trackData) {
            titleEl.textContent = trackData.title || 'Unknown Track';
        }
        if (artistEl) {
            artistEl.textContent = 'Mac Wayne';
        }
        
        // Update track status (preview/full)
        const isTrackPurchased = this.isPurchased || this.purchasedTracks.includes(trackData.id);
        const statusEl = document.querySelector('.track-status');
        if (statusEl) {
            statusEl.textContent = isTrackPurchased ? 'Full Track' : 'Preview (30 sec)';
            statusEl.className = 'track-status ' + (isTrackPurchased ? 'full' : 'preview');
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.audio.src) return;
        
        try {
            this.audio.load();  // Ensure audio is properly loaded
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton();
                }).catch(error => {
                    console.error('Playback failed:', error);
                    // Reset state if playback fails
                    this.isPlaying = false;
                    this.updatePlayButton();
                });
            }
        } catch (error) {
            console.error('Error starting playback:', error);
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    updatePlayButton() {
        const playBtn = document.querySelector('.play-btn');
        const icon = playBtn?.querySelector('i');
        
        if (icon) {
            if (this.isPlaying) {
                icon.className = 'fas fa-pause';
            } else {
                icon.className = 'fas fa-play';
            }
        }
    }

    updateProgress() {
        const current = this.audio.currentTime;
        const duration = this.audio.duration;
        
        if (!this.currentTrack) return;
        
        // Check if track is purchased (either album or individual track)
        const isTrackPurchased = this.isPurchased || this.purchasedTracks.includes(this.currentTrack.id);
        
        // Preview limit - 30 seconds for non-purchased tracks
        if (!isTrackPurchased && current >= this.previewDuration) {
            this.pause();
            this.showPurchasePrompt(this.currentTrack);
            return;
        }
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill && duration) {
            progressFill.style.width = (current / duration * 100) + '%';
            
            // Add preview marker if not purchased
            if (!isTrackPurchased) {
                let previewMarker = document.querySelector('.preview-marker');
                if (!previewMarker) {
                    previewMarker = document.createElement('div');
                    previewMarker.className = 'preview-marker';
                    previewMarker.style.position = 'absolute';
                    previewMarker.style.top = '0';
                    previewMarker.style.bottom = '0';
                    previewMarker.style.width = '2px';
                    previewMarker.style.backgroundColor = '#ffcc00';
                    previewMarker.style.zIndex = '5';
                    document.querySelector('.progress-bar').appendChild(previewMarker);
                }
                
                const previewPercent = (this.previewDuration / duration) * 100;
                previewMarker.style.left = `${previewPercent}%`;
            } else {
                const previewMarker = document.querySelector('.preview-marker');
                if (previewMarker) previewMarker.remove();
            }
        }
        
        const currentTime = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');
        if (currentTime) currentTime.textContent = this.formatTime(current);
        
        // Show full duration or preview duration based on purchase status
        if (durationEl) {
            const displayDuration = !isTrackPurchased ? 
                Math.min(this.previewDuration, duration || 0) : (duration || 0);
            durationEl.textContent = this.formatTime(displayDuration);
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    onEnded() {
        this.isPlaying = false;
        this.updatePlayButton();
    }

    onError() {
        console.error('Audio error occurred');
    }

    showPurchasePrompt(trackData) {
        const purchaseOptions = document.createElement('div');
        purchaseOptions.className = 'purchase-modal';
        purchaseOptions.innerHTML = `
            <div class="modal-content">
                <h3>Preview Ended</h3>
                <p>You've heard the 30-second preview of "${trackData.title}". Purchase options:</p>
                <div class="purchase-options">
                    <div class="option">
                        <h4>This Track - $${this.trackPrice.toFixed(2)}</h4>
                        <p>Get full access to this track only</p>
                        <button class="purchase-track-btn" data-track-id="${trackData.id}">Buy Track</button>
                    </div>
                    <div class="option">
                        <h4>Full Album - $${this.albumPrice.toFixed(2)}</h4>
                        <p>Get all 20 tracks</p>
                        <button class="purchase-album-btn">Buy Album</button>
                    </div>
                </div>
                <button class="close-modal-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(purchaseOptions);
        
        // Add event listeners
        purchaseOptions.querySelector('.purchase-track-btn').addEventListener('click', () => {
            purchaseOptions.remove();
            this.purchaseTrack(trackData);
        });
        
        purchaseOptions.querySelector('.purchase-album-btn').addEventListener('click', () => {
            purchaseOptions.remove();
            this.purchaseAlbum();
        });
        
        purchaseOptions.querySelector('.close-modal-btn').addEventListener('click', () => {
            purchaseOptions.remove();
        });
        
        // Add modal styles if not already present
        if (!document.getElementById('modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .purchase-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: #333;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                }
                .purchase-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin: 20px 0;
                }
                .option {
                    background: #444;
                    padding: 15px;
                    border-radius: 5px;
                    text-align: center;
                }
                .purchase-track-btn, .purchase-album-btn {
                    background: #cc0000;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .close-modal-btn {
                    background: #666;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    purchaseTrack(trackData) {
        // Show PayPal container for track purchase
        const paypalContainer = document.getElementById('paypal-track-container');
        if (paypalContainer) {
            paypalContainer.dataset.trackId = trackData.id;
            paypalContainer.style.display = 'block';
            
            // Scroll to PayPal buttons
            paypalContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback if no PayPal container
            if (confirm(`Purchase "${trackData.title}" for $${this.trackPrice.toFixed(2)}?`)) {
                this.completeTrackPurchase(trackData.id);
            }
        }
    }
    
    purchaseAlbum() {
        // Show PayPal container for album purchase
        const paypalContainer = document.getElementById('paypal-album-container');
        if (paypalContainer) {
            paypalContainer.style.display = 'block';
            
            // Scroll to PayPal buttons
            paypalContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback if no PayPal container
            if (confirm(`Purchase "Blind and Battered" album for $${this.albumPrice.toFixed(2)}?`)) {
                this.completeAlbumPurchase();
            }
        }
    }
    
    completeTrackPurchase(trackId) {
        // Add track to purchased tracks
        if (!this.purchasedTracks.includes(trackId)) {
            this.purchasedTracks.push(trackId);
            localStorage.setItem('purchasedTracks', JSON.stringify(this.purchasedTracks));
        }
        
        // Update UI
        this.updatePurchaseStatus();
        
        // If current track is the purchased one, reload it to play full version
        if (this.currentTrack && this.currentTrack.id === trackId) {
            this.loadTrack(this.currentTrack);
        }
        
        alert(`Track "${this.tracks.find(t => t.id === trackId)?.title || 'Unknown'}" purchased successfully!`);
    }
    
    completeAlbumPurchase() {
        // Mark entire album as purchased
        localStorage.setItem('purchased', 'true');
        this.isPurchased = true;
        
        // Update UI
        this.updatePurchaseStatus();
        
        // If a track is currently playing, reload it to play full version
        if (this.currentTrack) {
            this.loadTrack(this.currentTrack);
        }
        
        alert('Album purchased successfully! All tracks unlocked.');
    }

    updatePurchaseStatus() {
        // Update album purchase button
        const purchaseBtn = document.querySelector('.purchase-album');
        if (purchaseBtn) {
            if (this.isPurchased) {
                purchaseBtn.textContent = '✓ Album Purchased';
                purchaseBtn.disabled = true;
                purchaseBtn.style.background = '#28a745';
            } else {
                purchaseBtn.textContent = `Buy Album - $${this.albumPrice.toFixed(2)}`;
            }
        }
        
        // Update individual track purchase buttons
        this.tracks.forEach(track => {
            const isPurchased = this.isPurchased || this.purchasedTracks.includes(track.id);
            const purchaseTrackBtn = track.element.querySelector('.purchase-track');
            const trackStatus = track.element.querySelector('.track-status');
            
            if (purchaseTrackBtn) {
                if (isPurchased) {
                    purchaseTrackBtn.textContent = '✓ Purchased';
                    purchaseTrackBtn.disabled = true;
                    purchaseTrackBtn.style.background = '#28a745';
                } else {
                    purchaseTrackBtn.textContent = `Buy - $${this.trackPrice.toFixed(2)}`;
                }
            }
            
            if (trackStatus) {
                trackStatus.textContent = isPurchased ? 'Full Track' : 'Preview';
                trackStatus.className = 'track-status ' + (isPurchased ? 'full' : 'preview');
            }
        });
        
        // If current track is loaded, update its info
        if (this.currentTrack) {
            this.updateTrackInfo(this.currentTrack);
        }
    }

    // Initialize PayPal integration
    initPayPal() {
        // Check if PayPal script is already loaded
        if (window.paypal) {
            this.setupPayPalButtons();
            return;
        }
        // Load PayPal script
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
        script.onload = () => this.setupPayPalButtons();
        document.body.appendChild(script);
    }

    setupPayPalButtons() {
        // Setup album purchase PayPal buttons
        const albumContainer = document.getElementById('paypal-album-container');
        if (albumContainer && window.paypal) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: this.albumPrice.toFixed(2)
                            },
                            description: 'Mac Wayne - Blind and Battered Album'
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        this.completeAlbumPurchase();
                    });
                }
            }).render(albumContainer);
        }
        // Setup track purchase PayPal buttons
        const trackContainer = document.getElementById('paypal-track-container');
        if (trackContainer && window.paypal) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    const trackId = trackContainer.dataset.trackId;
                    const track = this.tracks.find(t => t.id === trackId);
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: this.trackPrice.toFixed(2)
                            },
                            description: `Mac Wayne - ${track?.title || 'Track'}`
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        const trackId = trackContainer.dataset.trackId;
                        this.completeTrackPurchase(trackId);
                        trackContainer.style.display = 'none';
                    });
                }
            }).render(trackContainer);
        }
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new NewAudioPlayer();
});

// Debug functions
window.resetPurchase = () => {
    localStorage.removeItem('purchased');
    localStorage.removeItem('purchasedTracks');
    location.reload();
};

window.simulatePurchase = () => {
    localStorage.setItem('purchased', 'true');
    location.reload();
};

window.simulateTrackPurchase = (trackId) => {
    const purchasedTracks = JSON.parse(localStorage.getItem('purchasedTracks') || '[]');
    if (!purchasedTracks.includes(trackId)) {
        purchasedTracks.push(trackId);
        localStorage.setItem('purchasedTracks', JSON.stringify(purchasedTracks));
    }
    location.reload();
};