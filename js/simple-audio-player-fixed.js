// Simple Audio Player Fixed - Mac Wayne Official
// Lightweight, accessible audio player

class SimpleAudioPlayer {
  constructor(element) {
    this.container = element;
    this.audio = null;
    this.isPlaying = false;
    this.init();
  }

  init() {
    this.createPlayer();
    this.bindEvents();
  }

  createPlayer() {
    const audioSrc = this.container.dataset.audioSrc;
    const audioTitle = this.container.dataset.audioTitle || 'Audio Track';
    
    const playerHTML = `
      <div class="simple-audio-player">
        <div class="player-info">
          <span class="track-title">${audioTitle}</span>
        </div>
        <div class="player-controls">
          <button class="play-btn" aria-label="Play ${audioTitle}">
            <i class="fas fa-play"></i>
          </button>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="time-display">
              <span class="current-time">0:00</span> / 
              <span class="duration">0:00</span>
            </div>
          </div>
        </div>
        <audio preload="metadata" src="${audioSrc}"></audio>
      </div>
    `;
    
    this.container.innerHTML = playerHTML;
    this.audio = this.container.querySelector('audio');
    this.playBtn = this.container.querySelector('.play-btn');
    this.progressBar = this.container.querySelector('.progress-bar');
    this.progressFill = this.container.querySelector('.progress-fill');
    this.currentTimeEl = this.container.querySelector('.current-time');
    this.durationEl = this.container.querySelector('.duration');
  }

  bindEvents() {
    // Play/pause button
    this.playBtn.addEventListener('click', () => this.togglePlay());
    
    // Progress bar click
    this.progressBar.addEventListener('click', (e) => this.seek(e));
    
    // Audio events
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.trackEnded());
    this.audio.addEventListener('error', () => this.handleError());
    
    // Keyboard support
    this.playBtn.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
      this.playBtn.setAttribute('aria-label', `Play ${this.container.dataset.audioTitle}`);
    } else {
      // Pause other players
      document.querySelectorAll('.simple-audio-player audio').forEach(otherAudio => {
        if (otherAudio !== this.audio && !otherAudio.paused) {
          otherAudio.pause();
          const otherPlayer = otherAudio.closest('.simple-audio-player');
          const otherBtn = otherPlayer.querySelector('.play-btn');
          otherBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
      });
      
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.playBtn.setAttribute('aria-label', `Pause ${this.container.dataset.audioTitle}`);
      }).catch(error => {
        console.error('Playback failed:', error);
        this.handleError();
      });
    }
  }

  seek(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.audio.currentTime = percent * this.audio.duration;
  }

  updateProgress() {
    if (this.audio.duration) {
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressFill.style.width = `${percent}%`;
      this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  updateDuration() {
    this.durationEl.textContent = this.formatTime(this.audio.duration);
  }

  trackEnded() {
    this.isPlaying = false;
    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
    this.playBtn.setAttribute('aria-label', `Play ${this.container.dataset.audioTitle}`);
    this.progressFill.style.width = '0%';
    this.currentTimeEl.textContent = '0:00';
  }

  handleError() {
    this.container.querySelector('.track-title').textContent = 'Error loading audio';
    this.playBtn.disabled = true;
    this.playBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Auto-initialize all audio players
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.audio-player-container').forEach(container => {
    new SimpleAudioPlayer(container);
  });
});

// Export for manual initialization
window.SimpleAudioPlayer = SimpleAudioPlayer;