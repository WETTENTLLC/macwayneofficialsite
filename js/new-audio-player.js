// Enhanced Audio Player with PayPal Integration
window.NewAudioPlayer = class NewAudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isPurchased = false; // Default to preview mode
        this.purchasedTracks = JSON.parse(localStorage.getItem('purchasedTracks') || '[]');
        this.currentTrack = null;
        this.previewDuration = 30; // 30 second preview
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
        trackElements.forEach((track, index) => {
            // Store track data
            const trackData = {
                id: track.dataset.id || `track-${index}`,
                title: track.querySelector('.track-name')?.textContent || `Track ${index + 1}`,
                sampleSrc: track.dataset.src,
                fullSrc: track.dataset.fullSrc,
                element: track,
                index: index
            };
            this.tracks.push(trackData);
            
            // Setup click handlers
            track.addEventListener('click', () => this.loadTrack(trackData));
            
            const miniBtn = track.querySelector('.mini-play-btn');
            if (miniBtn) {
                miniBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadTrack(trackData);
                });
            }
            
            // Add purchase track button
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
        if (!trackData) return;
        
        // Remove previous active track
        document.querySelectorAll('.track-item').forEach(t => t.classList.remove('playing'));
        
        // Set current track as active
        if (trackData.element) {
            trackData.element.classList.add('playing');
            this.currentTrack = trackData;
        }
        
        // Determine if we should play full track or sample
        const isTrackPurchased = this.purchasedTracks.includes(trackData.id);
        const src = isTrackPurchased ? trackData.fullSrc : trackData.sampleSrc;
        
        if (!src) {
            console.error('No audio source available for track:', trackData.title);
            return;
        }
        
        this.audio.src = src;
        this.updateTrackInfo(trackData);
        
        // Set preview duration if not purchased
        if (!isTrackPurchased) {
            this.audio.addEventListener('timeupdate', () => {
                if (this.audio.currentTime >= this.previewDuration) {
                    this.audio.pause();
                    this.audio.currentTime = 0;
                }
            });
        }
        
        this.play();
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
        if (!this.audio.src) {
            console.error('No audio source set');
            return;
        }

        // Set loading state
        this.setLoadingState(true);

        // Check if file exists first
        const checkAudio = new Audio();
        checkAudio.src = this.audio.src;

        checkAudio.addEventListener('loadedmetadata', () => {
            // File exists and can be played
            this.setLoadingState(false);
            this.audio.play()
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton();
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    this.handlePlayError();
                });
        });

        checkAudio.addEventListener('error', () => {
            console.error('Audio file not found or not supported');
            this.setLoadingState(false);
            this.handlePlayError('Audio file not available in demo mode');
        });
    }

    setLoadingState(isLoading) {
        const statusEl = document.querySelector('.track-status');
        if (statusEl) {
            if (isLoading) {
                statusEl.textContent = 'Loading...';
                statusEl.className = 'track-status loading';
            } else {
                statusEl.textContent = this.isPurchased ? 'Full Track' : 'Preview';
                statusEl.className = `track-status ${this.isPurchased ? 'full' : 'preview'}`;
            }
        }
    }

    handlePlayError(message = 'Error loading audio') {
        const statusEl = document.querySelector('.track-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = 'track-status error';
        }
        this.isPlaying = false;
        this.updatePlayButton();
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
            const allPurchased = this.tracks.every(track => this.purchasedTracks.includes(track.id));
            if (allPurchased) {
                purchaseBtn.textContent = '✓ Album Purchased';
                purchaseBtn.disabled = true;
                purchaseBtn.style.background = '#28a745';
            } else {
                purchaseBtn.textContent = `Buy Album - $${this.albumPrice.toFixed(2)}`;
                purchaseBtn.disabled = false;
                purchaseBtn.style.background = '';
            }
        }
        
        // Update individual track purchase buttons
        this.tracks.forEach(track => {
            const isPurchased = this.purchasedTracks.includes(track.id);
            const purchaseTrackBtn = track.element.querySelector('.purchase-track');
            const trackStatus = track.element.querySelector('.track-status');
            
            if (purchaseTrackBtn) {
                if (isPurchased) {
                    purchaseTrackBtn.textContent = '✓ Purchased';
                    purchaseTrackBtn.disabled = true;
                    purchaseTrackBtn.style.background = '#28a745';
                } else {
                    purchaseTrackBtn.textContent = `Buy - $${this.trackPrice.toFixed(2)}`;
                    purchaseTrackBtn.disabled = false;
                    purchaseTrackBtn.style.background = '';
                }
            }
            
            if (trackStatus) {
                trackStatus.textContent = isPurchased ? 'Full Track' : '30-Sec Preview';
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
        
        // Load PayPal script if not already loaded
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=ATefxKUHVrxyBM7_sudRHvnbUXV-nznDOJD9ZwO_nRMOSZlYCfrHA6SouCz9K7Uk3X0phjvkj_Yo0STn&currency=USD';
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