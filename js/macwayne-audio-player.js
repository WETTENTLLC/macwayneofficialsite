// Enhanced Mac Wayne Audio Player with Purchase Integration
class MacWayneAudioPlayer {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.duration = 0;
        this.isPreviewMode = true;
        this.previewDuration = 30; // 30 seconds
        this.purchasedTracks = this.loadPurchasedTracks();
        this.volume = 0.8;
        
        // Track data with purchase info
        this.tracks = [
            {
                id: 1,
                title: "Gotta Split",
                artist: "Mac Wayne",
                album: "Blind and Battered",
                duration: "3:42",
                audioFile: "public/audio/Blind and Battered [Explicit]/01 - Gotta Split [Explicit].mp3",
                sampleFile: "public/audio/Blind and Battered [Explicit]/samples/01-sample.mp3",
                price: 1.99,
                albumPrice: 19.99,
                coverArt: "public/Images/macwayne-background.png"
            },
            {
                id: 2,
                title: "I Think",
                artist: "Mac Wayne",
                album: "Blind and Battered",
                duration: "4:15",
                audioFile: "public/audio/Blind and Battered [Explicit]/02 - I Think [Explicit].mp3",
                sampleFile: "public/audio/Blind and Battered [Explicit]/samples/02-sample.mp3",
                price: 1.99,
                albumPrice: 19.99,
                coverArt: "public/Images/macwayne-background.png"
            },
            {
                id: 3,
                title: "Keep Your Mouth Shut (Skit)",
                artist: "Mac Wayne",
                album: "Blind and Battered",
                duration: "1:23",
                audioFile: "public/audio/Blind and Battered [Explicit]/03 - Keep Your Mouth Shut (Skit) [Explicit].mp3",
                sampleFile: "public/audio/Blind and Battered [Explicit]/samples/03-sample.mp3",
                price: 1.99,
                albumPrice: 19.99,
                coverArt: "public/Images/macwayne-background.png"
            },
            {
                id: 4,
                title: "Just a Player",
                artist: "Mac Wayne",
                album: "Blind and Battered",
                duration: "3:58",
                audioFile: "public/audio/Blind and Battered [Explicit]/04 - Just a Player [Explicit].mp3",
                sampleFile: "public/audio/Blind and Battered [Explicit]/samples/04-sample.mp3",
                price: 1.99,
                albumPrice: 19.99,
                coverArt: "public/Images/macwayne-background.png"
            },
            {
                id: 5,
                title: "Ziplocks",
                artist: "Mac Wayne",
                album: "Blind and Battered",
                duration: "4:32",
                audioFile: "public/audio/Blind and Battered [Explicit]/05 - Ziplocks [Explicit].mp3",
                sampleFile: "public/audio/Blind and Battered [Explicit]/samples/05-sample.mp3",
                price: 1.99,
                albumPrice: 19.99,
                coverArt: "public/Images/macwayne-background.png"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.createPlayerHTML();
        this.bindEvents();
        this.loadTrack(0);
        this.updatePlaylist();
        this.setupAccessibility();
        
        // Initialize audio element
        this.audio = document.getElementById('mac-audio-element');
        if (this.audio) {
            this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.handleTrackEnd());
            this.audio.addEventListener('error', (e) => this.handleAudioError(e));
        }
    }
    
    createPlayerHTML() {
        const playerContainer = document.getElementById('mac-audio-player');
        if (!playerContainer) {
            console.warn('Audio player container not found');
            return;
        }
        
        playerContainer.innerHTML = `
            <div class="player-wrapper" role="region" aria-label="Mac Wayne Audio Player">
                <audio id="mac-audio-element" preload="metadata"></audio>
                
                <!-- Now Playing Section -->
                <div class="now-playing">
                    <div class="track-art">
                        <img id="player-cover-art" src="public/Images/macwayne-background.png" alt="Album cover" loading="lazy">
                        <div class="preview-indicator" id="preview-indicator" style="display: none;">
                            <span>30s Preview</span>
                        </div>
                    </div>
                    <div class="track-info">
                        <h3 id="player-track-title">Select a track</h3>
                        <p id="player-artist">Mac Wayne</p>
                        <p id="player-album">Blind and Battered</p>
                    </div>
                </div>
                
                <!-- Controls Section -->
                <div class="player-controls">
                    <button id="prev-btn" class="control-btn" aria-label="Previous track">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button id="play-pause-btn" class="control-btn main-control" aria-label="Play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button id="next-btn" class="control-btn" aria-label="Next track">
                        <i class="fas fa-step-forward"></i>
                    </button>
                </div>
                
                <!-- Progress Section -->
                <div class="progress-section">
                    <span id="current-time">0:00</span>
                    <div class="progress-container">
                        <div class="progress-bar" id="progress-bar" role="slider" aria-label="Track progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
                            <div class="progress-fill" id="progress-fill"></div>
                            <div class="progress-handle" id="progress-handle"></div>
                        </div>
                    </div>
                    <span id="total-time">0:00</span>
                </div>
                
                <!-- Volume Control -->
                <div class="volume-section">
                    <button id="volume-btn" class="control-btn" aria-label="Toggle mute">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <div class="volume-container">
                        <input type="range" id="volume-slider" class="volume-slider" min="0" max="100" value="80" aria-label="Volume control">
                    </div>
                </div>
                
                <!-- Purchase Section -->
                <div class="purchase-section" id="purchase-section">
                    <div class="purchase-info">
                        <p>Enjoying the preview? Get the full track!</p>
                        <div class="purchase-buttons">
                            <button id="buy-track-btn" class="purchase-btn track-btn">
                                Buy Track - $<span id="track-price">1.99</span>
                            </button>
                            <button id="buy-album-btn" class="purchase-btn album-btn">
                                Buy Album - $<span id="album-price">19.99</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Download Section (for purchased tracks) -->
                <div class="download-section" id="download-section" style="display: none;">
                    <div class="download-info">
                        <p><i class="fas fa-check-circle"></i> You own this track!</p>
                        <button id="download-track-btn" class="download-btn">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Playlist Section -->
            <div class="playlist-section">
                <h3>Blind and Battered - Track List</h3>
                <div class="playlist" id="playlist" role="list" aria-label="Track playlist">
                    <!-- Playlist items will be generated here -->
                </div>
            </div>
            
            <!-- Success Message -->
            <div id="success-message" class="success-message" style="display: none;" role="alert" aria-live="polite">
                <div class="success-content">
                    <i class="fas fa-check-circle"></i>
                    <span id="success-text">Purchase successful!</span>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Control buttons
        document.getElementById('play-pause-btn')?.addEventListener('click', () => this.togglePlayPause());
        document.getElementById('prev-btn')?.addEventListener('click', () => this.previousTrack());
        document.getElementById('next-btn')?.addEventListener('click', () => this.nextTrack());
        
        // Progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seekTo(e));
            progressBar.addEventListener('keydown', (e) => this.handleProgressKeydown(e));
        }
        
        // Volume controls
        document.getElementById('volume-btn')?.addEventListener('click', () => this.toggleMute());
        document.getElementById('volume-slider')?.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Purchase buttons
        document.getElementById('buy-track-btn')?.addEventListener('click', () => this.purchaseTrack());
        document.getElementById('buy-album-btn')?.addEventListener('click', () => this.purchaseAlbum());
        document.getElementById('download-track-btn')?.addEventListener('click', () => this.downloadTrack());
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentTrack = index;
        const track = this.tracks[index];
        const isOwned = this.isPurchased(track.id) || this.isPurchased('album');
        
        // Update audio source
        if (this.audio) {
            this.audio.src = isOwned ? track.audioFile : track.sampleFile;
            this.audio.load();
        }
        
        // Update UI
        this.updateTrackInfo(track);
        this.updatePurchaseSection(track, isOwned);
        this.updatePlaylistHighlight();
        
        // Set preview mode
        this.isPreviewMode = !isOwned;
        this.updatePreviewIndicator();
        
        // Reset player state
        this.isPlaying = false;
        this.updatePlayButton();
    }
    
    updateTrackInfo(track) {
        document.getElementById('player-track-title').textContent = track.title;
        document.getElementById('player-artist').textContent = track.artist;
        document.getElementById('player-album').textContent = track.album;
        document.getElementById('player-cover-art').src = track.coverArt;
        document.getElementById('track-price').textContent = track.price;
        document.getElementById('album-price').textContent = track.albumPrice;
    }
    
    updatePurchaseSection(track, isOwned) {
        const purchaseSection = document.getElementById('purchase-section');
        const downloadSection = document.getElementById('download-section');
        
        if (isOwned) {
            purchaseSection.style.display = 'none';
            downloadSection.style.display = 'block';
        } else {
            purchaseSection.style.display = 'block';
            downloadSection.style.display = 'none';
        }
    }
    
    updatePreviewIndicator() {
        const indicator = document.getElementById('preview-indicator');
        if (indicator) {
            indicator.style.display = this.isPreviewMode ? 'block' : 'none';
        }
    }
    
    updatePlaylist() {
        const playlist = document.getElementById('playlist');
        if (!playlist) return;
        
        playlist.innerHTML = this.tracks.map((track, index) => {
            const isOwned = this.isPurchased(track.id) || this.isPurchased('album');
            const isCurrentTrack = index === this.currentTrack;
            
            return `
                <div class="playlist-item ${isCurrentTrack ? 'active' : ''}" 
                     data-track-index="${index}" 
                     role="button" 
                     tabindex="0"
                     aria-label="Play ${track.title} by ${track.artist}">
                    <div class="track-number">${index + 1}</div>
                    <div class="track-details">
                        <div class="track-title">${track.title}</div>
                        <div class="track-duration">${track.duration}</div>
                    </div>
                    <div class="track-status">
                        ${isOwned ? '<i class="fas fa-check-circle owned" title="Owned"></i>' : '<i class="fas fa-play-circle preview" title="Preview"></i>'}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click events to playlist items
        playlist.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.addEventListener('click', () => this.selectTrack(index));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectTrack(index);
                }
            });
        });
    }
    
    selectTrack(index) {
        this.loadTrack(index);
        this.play();
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.audio) return;
        
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.isPaused = false;
                this.updatePlayButton();
                this.announceToScreenReader('Playing ' + this.tracks[this.currentTrack].title);
            })
            .catch(error => {
                console.error('Playback failed:', error);
                this.announceToScreenReader('Playback failed. Please try again.');
            });
    }
    
    pause() {
        if (!this.audio) return;
        
        this.audio.pause();
        this.isPlaying = false;
        this.isPaused = true;
        this.updatePlayButton();
        this.announceToScreenReader('Paused');
    }
    
    updatePlayButton() {
        const playBtn = document.getElementById('play-pause-btn');
        const icon = playBtn?.querySelector('i');
        
        if (this.isPlaying) {
            icon?.setAttribute('class', 'fas fa-pause');
            playBtn?.setAttribute('aria-label', 'Pause');
        } else {
            icon?.setAttribute('class', 'fas fa-play');
            playBtn?.setAttribute('aria-label', 'Play');
        }
    }
    
    previousTrack() {
        const newIndex = this.currentTrack > 0 ? this.currentTrack - 1 : this.tracks.length - 1;
        this.loadTrack(newIndex);
        if (this.isPlaying) this.play();
    }
    
    nextTrack() {
        const newIndex = this.currentTrack < this.tracks.length - 1 ? this.currentTrack + 1 : 0;
        this.loadTrack(newIndex);
        if (this.isPlaying) this.play();
    }
    
    handleTrackEnd() {
        if (this.isPreviewMode) {
            this.pause();
            this.showPurchasePrompt();
        } else {
            this.nextTrack();
        }
    }
    
    showPurchasePrompt() {
        const track = this.tracks[this.currentTrack];
        this.announceToScreenReader(`Preview ended. Purchase ${track.title} for $${track.price} to hear the full track.`);
    }
    
    // Purchase functionality
    async purchaseTrack() {
        const track = this.tracks[this.currentTrack];
        await this.processPurchase('track', track.id, track.price);
    }
    
    async purchaseAlbum() {
        const track = this.tracks[this.currentTrack];
        await this.processPurchase('album', 'album', track.albumPrice);
    }
    
    async processPurchase(type, id, price) {
        try {
            this.showSuccessMessage(`Processing ${type} purchase...`);
            
            // Simulate purchase process (replace with actual PayPal integration)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mark as purchased
            this.markAsPurchased(id);
            
            this.showSuccessMessage(`${type === 'track' ? 'Track' : 'Album'} purchased successfully!`);
            
            // Reload current track to show full version
            this.loadTrack(this.currentTrack);
            this.updatePlaylist();
            
        } catch (error) {
            console.error('Purchase failed:', error);
            this.showSuccessMessage('Purchase failed. Please try again.');
        }
    }
    
    downloadTrack() {
        const track = this.tracks[this.currentTrack];
        
        // Create download link
        const link = document.createElement('a');
        link.href = track.audioFile;
        link.download = `${track.artist} - ${track.title}.mp3`;
        link.click();
        
        this.announceToScreenReader(`Downloading ${track.title}`);
    }
    
    // Utility functions
    isPurchased(id) {
        return this.purchasedTracks.includes(id);
    }
    
    markAsPurchased(id) {
        if (!this.isPurchased(id)) {
            this.purchasedTracks.push(id);
            localStorage.setItem('macWaynePurchases', JSON.stringify(this.purchasedTracks));
        }
    }
    
    loadPurchasedTracks() {
        try {
            const saved = localStorage.getItem('macWaynePurchases');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }
    
    showSuccessMessage(message) {
        const successMsg = document.getElementById('success-message');
        const successText = document.getElementById('success-text');
        
        if (successMsg && successText) {
            successText.textContent = message;
            successMsg.style.display = 'block';
            
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);
        }
        
        this.announceToScreenReader(message);
    }
    
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.textContent = message;
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-9999px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    setupAccessibility() {
        // Add ARIA labels and keyboard navigation
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
        });
    }
    
    // Progress and volume controls
    updateProgress() {
        if (!this.audio) return;
        
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration || 0;
        
        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            const progressFill = document.getElementById('progress-fill');
            const progressBar = document.getElementById('progress-bar');
            
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressBar) progressBar.setAttribute('aria-valuenow', Math.round(progress));
        }
        
        // Update time displays
        document.getElementById('current-time').textContent = this.formatTime(currentTime);
        
        // Check for preview limit
        if (this.isPreviewMode && currentTime >= this.previewDuration) {
            this.pause();
            this.audio.currentTime = 0;
            this.showPurchasePrompt();
        }
    }
    
    updateDuration() {
        if (!this.audio) return;
        
        const duration = this.audio.duration || 0;
        document.getElementById('total-time').textContent = this.formatTime(duration);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    seekTo(e) {
        if (!this.audio) return;
        
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const newTime = percentage * this.audio.duration;
        
        // Limit seeking in preview mode
        if (this.isPreviewMode && newTime > this.previewDuration) {
            this.audio.currentTime = this.previewDuration;
            this.showPurchasePrompt();
        } else {
            this.audio.currentTime = newTime;
        }
    }
    
    setVolume(value) {
        if (!this.audio) return;
        
        this.volume = value / 100;
        this.audio.volume = this.volume;
        
        // Update volume icon
        const volumeBtn = document.getElementById('volume-btn');
        const icon = volumeBtn?.querySelector('i');
        
        if (this.volume === 0) {
            icon?.setAttribute('class', 'fas fa-volume-mute');
        } else if (this.volume < 0.5) {
            icon?.setAttribute('class', 'fas fa-volume-down');
        } else {
            icon?.setAttribute('class', 'fas fa-volume-up');
        }
    }
    
    toggleMute() {
        if (!this.audio) return;
        
        if (this.audio.volume > 0) {
            this.previousVolume = this.audio.volume;
            this.setVolume(0);
            document.getElementById('volume-slider').value = 0;
        } else {
            const restoreVolume = this.previousVolume || 0.8;
            this.setVolume(restoreVolume * 100);
            document.getElementById('volume-slider').value = restoreVolume * 100;
        }
    }
    
    handleAudioError(e) {
        console.error('Audio error:', e);
        this.announceToScreenReader('Audio failed to load. Please try again.');
    }
    
    handleProgressKeydown(e) {
        if (!this.audio) return;
        
        const duration = this.audio.duration || 0;
        let newTime = this.audio.currentTime;
        
        switch (e.key) {
            case 'ArrowLeft':
                newTime = Math.max(0, newTime - 5);
                break;
            case 'ArrowRight':
                newTime = Math.min(duration, newTime + 5);
                break;
            case 'Home':
                newTime = 0;
                break;
            case 'End':
                newTime = duration;
                break;
            default:
                return;
        }
        
        e.preventDefault();
        
        // Apply preview limits
        if (this.isPreviewMode && newTime > this.previewDuration) {
            newTime = this.previewDuration;
            this.showPurchasePrompt();
        }
        
        this.audio.currentTime = newTime;
    }
    
    updatePlaylistHighlight() {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrack);
        });
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with the audio player
    if (document.getElementById('mac-audio-player')) {
        window.macWaynePlayer = new MacWayneAudioPlayer();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MacWayneAudioPlayer;
}

