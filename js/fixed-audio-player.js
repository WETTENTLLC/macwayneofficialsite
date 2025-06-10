// Fixed Audio Player - Mac Wayne Official
// Enhanced accessibility and cross-browser compatibility

class FixedAudioPlayer {
  constructor() {
    this.currentTrack = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    this.isMuted = false;
    this.init();
  }

  init() {
    this.createPlayerElements();
    this.bindEvents();
    this.loadTrackList();
  }

  createPlayerElements() {
    const playerHTML = `
      <div id="fixed-audio-player" class="audio-player-fixed" aria-label="Audio Player">
        <div class="player-controls">
          <button class="btn-prev" aria-label="Previous track">
            <i class="fas fa-step-backward"></i>
          </button>
          <button class="btn-play-pause" aria-label="Play/Pause">
            <i class="fas fa-play"></i>
          </button>
          <button class="btn-next" aria-label="Next track">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
        <div class="player-info">
          <div class="track-title">Select a track</div>
          <div class="track-artist">Mac Wayne</div>
        </div>
        <div class="player-progress">
          <span class="time-current">0:00</span>
          <div class="progress-bar" role="slider" aria-label="Track progress" tabindex="0">
            <div class="progress-fill"></div>
          </div>
          <span class="time-duration">0:00</span>
        </div>
        <div class="player-volume">
          <button class="btn-mute" aria-label="Mute/Unmute">
            <i class="fas fa-volume-up"></i>
          </button>
          <div class="volume-bar" role="slider" aria-label="Volume" tabindex="0">
            <div class="volume-fill"></div>
          </div>
        </div>
        <audio class="audio-element" preload="metadata"></audio>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', playerHTML);
  }

  bindEvents() {
    const player = document.getElementById('fixed-audio-player');
    const audio = player.querySelector('.audio-element');
    const playBtn = player.querySelector('.btn-play-pause');
    const prevBtn = player.querySelector('.btn-prev');
    const nextBtn = player.querySelector('.btn-next');
    const muteBtn = player.querySelector('.btn-mute');
    const progressBar = player.querySelector('.progress-bar');
    const volumeBar = player.querySelector('.volume-bar');

    // Play/Pause
    playBtn.addEventListener('click', () => this.togglePlayPause());
    
    // Previous/Next
    prevBtn.addEventListener('click', () => this.previousTrack());
    nextBtn.addEventListener('click', () => this.nextTrack());
    
    // Mute
    muteBtn.addEventListener('click', () => this.toggleMute());
    
    // Progress bar
    progressBar.addEventListener('click', (e) => this.seekTo(e));
    progressBar.addEventListener('keydown', (e) => this.handleProgressKeyboard(e));
    
    // Volume bar
    volumeBar.addEventListener('click', (e) => this.setVolume(e));
    volumeBar.addEventListener('keydown', (e) => this.handleVolumeKeyboard(e));
    
    // Audio events
    audio.addEventListener('timeupdate', () => this.updateProgress());
    audio.addEventListener('loadedmetadata', () => this.updateDuration());
    audio.addEventListener('ended', () => this.trackEnded());
    audio.addEventListener('error', (e) => this.handleError(e));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));
  }

  loadTrackList() {
    // Load tracks from data attributes or JSON
    const trackElements = document.querySelectorAll('[data-audio-src]');
    this.tracks = Array.from(trackElements).map(el => ({
      src: el.dataset.audioSrc,
      title: el.dataset.audioTitle || 'Unknown Track',
      artist: el.dataset.audioArtist || 'Mac Wayne',
      element: el
    }));
    
    // Bind track click events
    trackElements.forEach((el, index) => {
      el.addEventListener('click', () => this.loadTrack(index));
    });
  }

  loadTrack(index) {
    if (index < 0 || index >= this.tracks.length) return;
    
    this.currentTrack = index;
    const track = this.tracks[index];
    const audio = document.querySelector('.audio-element');
    const player = document.getElementById('fixed-audio-player');
    
    audio.src = track.src;
    player.querySelector('.track-title').textContent = track.title;
    player.querySelector('.track-artist').textContent = track.artist;
    
    // Update UI
    this.updateActiveTrack();
    
    // Show player if hidden
    player.classList.add('visible');
  }

  togglePlayPause() {
    const audio = document.querySelector('.audio-element');
    const playBtn = document.querySelector('.btn-play-pause i');
    
    if (this.currentTrack === null) {
      this.loadTrack(0);
      return;
    }
    
    if (this.isPlaying) {
      audio.pause();
      this.isPlaying = false;
      playBtn.className = 'fas fa-play';
    } else {
      audio.play().catch(e => console.error('Playback failed:', e));
      this.isPlaying = true;
      playBtn.className = 'fas fa-pause';
    }
  }

  previousTrack() {
    if (this.currentTrack > 0) {
      this.loadTrack(this.currentTrack - 1);
      if (this.isPlaying) {
        setTimeout(() => this.togglePlayPause(), 100);
      }
    }
  }

  nextTrack() {
    if (this.currentTrack < this.tracks.length - 1) {
      this.loadTrack(this.currentTrack + 1);
      if (this.isPlaying) {
        setTimeout(() => this.togglePlayPause(), 100);
      }
    }
  }

  seekTo(e) {
    const audio = document.querySelector('.audio-element');
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  }

  setVolume(e) {
    const audio = document.querySelector('.audio-element');
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.volume = Math.max(0, Math.min(1, percent));
    audio.volume = this.volume;
    this.updateVolumeUI();
  }

  toggleMute() {
    const audio = document.querySelector('.audio-element');
    const muteBtn = document.querySelector('.btn-mute i');
    
    if (this.isMuted) {
      audio.volume = this.volume;
      this.isMuted = false;
      muteBtn.className = this.volume > 0.5 ? 'fas fa-volume-up' : 'fas fa-volume-down';
    } else {
      audio.volume = 0;
      this.isMuted = true;
      muteBtn.className = 'fas fa-volume-mute';
    }
  }

  updateProgress() {
    const audio = document.querySelector('.audio-element');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeEl = document.querySelector('.time-current');
    
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${percent}%`;
      currentTimeEl.textContent = this.formatTime(audio.currentTime);
    }
  }

  updateDuration() {
    const audio = document.querySelector('.audio-element');
    const durationEl = document.querySelector('.time-duration');
    durationEl.textContent = this.formatTime(audio.duration);
  }

  updateVolumeUI() {
    const volumeFill = document.querySelector('.volume-fill');
    volumeFill.style.width = `${this.volume * 100}%`;
  }

  updateActiveTrack() {
    // Remove active class from all tracks
    document.querySelectorAll('[data-audio-src]').forEach(el => {
      el.classList.remove('playing');
    });
    
    // Add active class to current track
    if (this.currentTrack !== null) {
      this.tracks[this.currentTrack].element.classList.add('playing');
    }
  }

  trackEnded() {
    this.isPlaying = false;
    const playBtn = document.querySelector('.btn-play-pause i');
    playBtn.className = 'fas fa-play';
    
    // Auto-play next track if available
    if (this.currentTrack < this.tracks.length - 1) {
      this.nextTrack();
      setTimeout(() => this.togglePlayPause(), 500);
    }
  }

  handleError(e) {
    console.error('Audio playback error:', e);
    const player = document.getElementById('fixed-audio-player');
    player.querySelector('.track-title').textContent = 'Error loading track';
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  handleGlobalKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlayPause();
        break;
      case 'ArrowLeft':
        if (e.ctrlKey) {
          e.preventDefault();
          this.previousTrack();
        }
        break;
      case 'ArrowRight':
        if (e.ctrlKey) {
          e.preventDefault();
          this.nextTrack();
        }
        break;
    }
  }

  handleProgressKeyboard(e) {
    const audio = document.querySelector('.audio-element');
    switch(e.code) {
      case 'ArrowLeft':
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        break;
      case 'ArrowRight':
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        break;
    }
  }

  handleVolumeKeyboard(e) {
    switch(e.code) {
      case 'ArrowUp':
        this.volume = Math.min(1, this.volume + 0.1);
        break;
      case 'ArrowDown':
        this.volume = Math.max(0, this.volume - 0.1);
        break;
    }
    const audio = document.querySelector('.audio-element');
    audio.volume = this.volume;
    this.updateVolumeUI();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FixedAudioPlayer();
});