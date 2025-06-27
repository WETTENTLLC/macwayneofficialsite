// Mac Wayne Audio Player with Purchase Integration
class MacWayneAudioPlayer {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.isPreviewMode = true;
        this.previewDuration = 30; // 30 seconds
        this.audio = null;
        this.tracks = [];
        this.init();
    }

    init() {
        this.setupAudioElement();
        this.setupTrackList();
        this.setupPlayerControls();
        this.setupPurchaseButtons();
        this.checkPurchaseStatus();
    }

    setupAudioElement() {
        this.audio = document.getElementById('audio-element') || document.createElement('audio');
        this.audio.id = 'audio-element';
        this.audio.preload = 'metadata';
        
        if (!document.getElementById('audio-element')) {
            document.body.appendChild(this.audio);
        }

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
        this.audio.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
    }

    setupTrackList() {
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach((item, index) => {
            const trackData = {
                id: index,
                title: item.querySelector('.track-name')?.textContent || `Track ${index + 1}`,
                src: item.dataset.src,
                element: item
            };
            this.tracks.push(trackData);

            // Add click handler for track selection
            item.addEventListener('click', () => this.selectTrack(trackData));
            
            // Add play button handler
            const playBtn = item.querySelector('.mini-play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectTrack(trackData);
                });
            }
        });
    }

    setupPlayerControls() {
        const playBtn = document.querySelector('.play-btn');
        const progressBar = document.querySelector('.progress-bar');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.seek(percent);
            });
        }
    }

    setupPurchaseButtons() {
        const purchaseButtons = document.querySelectorAll('.purchase-album');
        purchaseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handlePurchase());
        });
    }

    selectTrack(track) {
        if (!track.src) {
            console.error('No audio source for track:', track.title);
            return;
        }

        this.currentTrack = track;
        this.audio.src = track.src;
        
        // Update UI
        this.updateTrackInfo(track);
        this.highlightCurrentTrack(track);
        
        // Auto-play
        this.play();
    }

    updateTrackInfo(track) {
        const titleEl = document.querySelector('.track-title');
        const artistEl = document.querySelector('.track-artist');
        
        if (titleEl) titleEl.textContent = track.title;
        if (artistEl) artistEl.textContent = 'Mac Wayne';
    }

    highlightCurrentTrack(track) {
        // Remove previous highlights
        document.querySelectorAll('.track-item').forEach(item => {
            item.classList.remove('playing');
        });
        
        // Highlight current track
        if (track.element) {
            track.element.classList.add('playing');
        }
    }

    async play() {
        if (!this.audio.src) return;

        try {
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayButton();
        } catch (error) {
            console.error('Playback failed:', error);
            this.showError('Unable to play audio. Please try again.');
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    seek(percent) {
        if (this.audio.duration) {
            let targetTime = this.audio.duration * percent;
            
            // Limit seeking in preview mode
            if (this.isPreviewMode && targetTime > this.previewDuration) {
                targetTime = this.previewDuration;
            }
            
            this.audio.currentTime = targetTime;
        }
    }

    updateProgress() {
        if (!this.audio.duration) return;

        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;

        // Check preview limit
        if (this.isPreviewMode && currentTime >= this.previewDuration) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.showPurchasePrompt();
            return;
        }

        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percent = (currentTime / duration) * 100;
            progressFill.style.width = `${percent}%`;
        }

        // Update time displays
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');
        
        if (currentTimeEl) currentTimeEl.textContent = this.formatTime(currentTime);
        if (durationEl) {
            const displayDuration = this.isPreviewMode ? 
                Math.min(this.previewDuration, duration) : duration;
            durationEl.textContent = this.formatTime(displayDuration);
        }
    }

    updatePlayButton() {
        const playBtn = document.querySelector('.play-btn');
        const playIcon = playBtn?.querySelector('.fa-play');
        const pauseIcon = playBtn?.querySelector('.fa-pause');

        if (this.isPlaying) {
            if (playIcon) playIcon.className = 'fas fa-pause';
            playBtn?.setAttribute('aria-label', 'Pause');
        } else {
            if (playIcon) playIcon.className = 'fas fa-play';
            if (pauseIcon) pauseIcon.className = 'fas fa-play';
            playBtn?.setAttribute('aria-label', 'Play');
        }
    }

    onTrackEnd() {
        this.isPlaying = false;
        this.updatePlayButton();
    }

    onMetadataLoaded() {
        const durationEl = document.querySelector('.duration');
        if (durationEl && this.audio.duration) {
            const displayDuration = this.isPreviewMode ? 
                Math.min(this.previewDuration, this.audio.duration) : this.audio.duration;
            durationEl.textContent = this.formatTime(displayDuration);
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showPurchasePrompt() {
        const modal = document.createElement('div');
        modal.className = 'purchase-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Preview Complete</h3>
                <p>You've heard the 30-second preview. Purchase the full album to unlock complete tracks!</p>
                <div class="modal-actions">
                    <button class="btn-purchase">Purchase Album - $9.99</button>
                    <button class="btn-close">Close</button>
                </div>
            </div>
        `;

        modal.querySelector('.btn-purchase').addEventListener('click', () => {
            modal.remove();
            this.handlePurchase();
        });

        modal.querySelector('.btn-close').addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
    }

    handlePurchase() {
        // Simulate purchase process
        const purchaseModal = document.createElement('div');
        purchaseModal.className = 'purchase-modal';
        purchaseModal.innerHTML = `
            <div class="modal-content">
                <h3>Purchase Mac Wayne Album</h3>
                <div class="purchase-options">
                    <div class="option">
                        <h4>Digital Album - $9.99</h4>
                        <p>Instant download, all 20 tracks</p>
                        <button class="btn-buy-digital">Buy Digital</button>
                    </div>
                    <div class="option">
                        <h4>Physical CD - $15.99</h4>
                        <p>CD + Digital download</p>
                        <button class="btn-buy-physical">Buy Physical</button>
                    </div>
                </div>
                <button class="btn-close">Cancel</button>
            </div>
        `;

        purchaseModal.querySelector('.btn-buy-digital').addEventListener('click', () => {
            this.completePurchase('digital');
            purchaseModal.remove();
        });

        purchaseModal.querySelector('.btn-buy-physical').addEventListener('click', () => {
            this.completePurchase('physical');
            purchaseModal.remove();
        });

        purchaseModal.querySelector('.btn-close').addEventListener('click', () => {
            purchaseModal.remove();
        });

        document.body.appendChild(purchaseModal);
    }

    completePurchase(type) {
        // Store purchase in localStorage
        localStorage.setItem('mac-wayne-album-purchased', 'true');
        localStorage.setItem('purchase-type', type);
        localStorage.setItem('purchase-date', new Date().toISOString());

        // Unlock full tracks
        this.isPreviewMode = false;
        
        // Show success message
        this.showPurchaseSuccess(type);
        
        // Update UI
        this.updatePurchaseStatus();
    }

    showPurchaseSuccess(type) {
        const successModal = document.createElement('div');
        successModal.className = 'purchase-modal success';
        successModal.innerHTML = `
            <div class="modal-content">
                <h3>🎉 Purchase Successful!</h3>
                <p>Thank you for supporting Mac Wayne! You now have access to all full-length tracks.</p>
                <p><strong>Purchase:</strong> ${type === 'digital' ? 'Digital Album' : 'Physical CD + Digital'}</p>
                <button class="btn-close">Start Listening</button>
            </div>
        `;

        successModal.querySelector('.btn-close').addEventListener('click', () => {
            successModal.remove();
        });

        document.body.appendChild(successModal);
    }

    checkPurchaseStatus() {
        // Check both old and new purchase systems
        const oldPurchased = localStorage.getItem('mac-wayne-album-purchased') === 'true';
        const newPurchaseStatus = localStorage.getItem('mac-wayne-purchase-status');
        const newPurchased = newPurchaseStatus ? JSON.parse(newPurchaseStatus).purchased : false;
        
        if (oldPurchased || newPurchased) {
            this.isPreviewMode = false;
            this.updatePurchaseStatus();
        }
    }

    updatePurchaseStatus() {
        // Hide purchase buttons and show purchased status
        const purchaseButtons = document.querySelectorAll('.purchase-album');
        purchaseButtons.forEach(btn => {
            if (this.isPreviewMode) {
                btn.textContent = 'Purchase & Unlock - $9.99';
            } else {
                btn.textContent = '✓ Purchased';
                btn.disabled = true;
                btn.style.background = '#28a745';
            }
        });

        // Update track indicators
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            const duration = item.querySelector('.track-duration');
            if (duration && this.isPreviewMode) {
                duration.textContent = 'Preview';
            } else if (duration && !this.isPreviewMode) {
                duration.textContent = 'Full Track';
            }
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'audio-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.macWaynePlayer = new MacWayneAudioPlayer();
});

// Add CSS for modals and player
const style = document.createElement('style');
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
    z-index: 10000;
}

.purchase-modal .modal-content {
    background: #1a1a1a;
    color: white;
    padding: 2rem;
    border-radius: 10px;
    max-width: 500px;
    text-align: center;
}

.purchase-options {
    display: grid;
    gap: 1rem;
    margin: 1rem 0;
}

.option {
    border: 1px solid #333;
    padding: 1rem;
    border-radius: 5px;
}

.btn-purchase, .btn-buy-digital, .btn-buy-physical {
    background: #cc0000;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    margin: 0.5rem;
}

.btn-close {
    background: #666;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    margin: 0.5rem;
}

.track-item.playing {
    background: rgba(204, 0, 0, 0.2);
    border-left: 3px solid #cc0000;
}

.purchase-modal.success .modal-content {
    border: 2px solid #28a745;
}
`;
document.head.appendChild(style);