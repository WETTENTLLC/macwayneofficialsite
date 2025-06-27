// Simple Audio Player Fix
class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isPurchased = localStorage.getItem('purchased') === 'true';
        this.init();
    }

    init() {
        const playBtn = document.querySelector('.play-btn');
        const tracks = document.querySelectorAll('.track-item');
        
        if (playBtn) {
            playBtn.onclick = () => this.togglePlay();
        }
        
        tracks.forEach(track => {
            track.onclick = () => this.loadTrack(track.dataset.src);
        });
        
        this.audio.ontimeupdate = () => this.updateProgress();
        
        // Purchase button
        const purchaseBtn = document.querySelector('.purchase-album');
        if (purchaseBtn) {
            purchaseBtn.onclick = () => this.purchase();
        }
    }

    loadTrack(src) {
        this.audio.src = src;
        this.play();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play();
        this.isPlaying = true;
        const playBtn = document.querySelector('.play-btn i');
        if (playBtn) playBtn.className = 'fas fa-pause';
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        const playBtn = document.querySelector('.play-btn i');
        if (playBtn) playBtn.className = 'fas fa-play';
    }

    updateProgress() {
        const current = this.audio.currentTime;
        const duration = this.audio.duration;
        
        // Preview limit
        if (!this.isPurchased && current >= 30) {
            this.pause();
            this.showPurchasePrompt();
            return;
        }
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill && duration) {
            progressFill.style.width = (current / duration * 100) + '%';
        }
        
        const currentTime = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');
        if (currentTime) currentTime.textContent = this.formatTime(current);
        if (durationEl) durationEl.textContent = this.formatTime(duration || 0);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    showPurchasePrompt() {
        alert('Preview ended. Purchase the album to hear full tracks!');
    }

    purchase() {
        if (confirm('Purchase album for $9.99?')) {
            localStorage.setItem('purchased', 'true');
            this.isPurchased = true;
            alert('Purchase successful! Full tracks unlocked.');
            
            const purchaseBtn = document.querySelector('.purchase-album');
            if (purchaseBtn) {
                purchaseBtn.textContent = '✓ Purchased';
                purchaseBtn.disabled = true;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudioPlayer();
});