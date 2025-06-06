// Audio Player functionality for Mac Wayne Official website

class AudioPlayer {
    constructor(container) {
        this.container = container;
        this.audio = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.tracks = [];
        this.currentTrackIndex = 0;
        
        this.init();
    }
    
    init() {
        this.setupTracks();
        this.setupEventListeners();
        this.setupProgressBar();
    }
    
    setupTracks() {
        const trackElements = this.container.querySelectorAll('.track-item');
        this.tracks = Array.from(trackElements).map((element, index) => ({
            index,
            element,
            title: element.querySelector('.track-title')?.textContent || `Track ${index + 1}`,
            duration: element.querySelector('.track-duration')?.textContent || '0:00',
            src: element.dataset.src || '', // Audio file URL
            preview: element.dataset.preview || '' // Preview URL if different
        }));
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
    
    async loadTrack() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
        
        if (!this.currentTrack.src) {
            console.warn('No audio source for track:', this.currentTrack.title);
            return;
        }
        
        this.audio = new Audio(this.currentTrack.src);
        
        // Audio event listeners
        this.audio.addEventListener('loadstart', () => this.showLoading(true));
        this.audio.addEventListener('canplaythrough', () => this.showLoading(false));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
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
            this.audio.currentTime = this.audio.duration * percent;
        }
    }
    
    updateProgress() {
        if (!this.audio) return;
        
        const progressFill = this.container.querySelector('.progress-fill');
        const currentTimeDisplay = this.container.querySelector('.current-time');
        const durationDisplay = this.container.querySelector('.duration');
        
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        
        if (progressFill && duration) {
            const percent = (currentTime / duration) * 100;
            progressFill.style.width = `${percent}%`;
        }
        
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = this.formatTime(currentTime);
        }
        
        if (durationDisplay) {
            durationDisplay.textContent = this.formatTime(duration || 0);
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
});

// Export for use in other modules
window.AudioPlayer = AudioPlayer;
