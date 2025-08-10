// Fixed Audio Player with Track Display
document.addEventListener('DOMContentLoaded', function() {
    let currentAudio = null;
    let currentTrackElement = null;
    
    // Create track display
    const trackDisplay = document.createElement('div');
    trackDisplay.id = 'current-track-display';
    trackDisplay.innerHTML = `
        <div class="track-info">
            <div class="track-title">Select a track to play</div>
            <div class="track-artist">Mac Wayne</div>
        </div>
        <div class="track-controls">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="time-display">
                <span class="current-time">0:00</span> / <span class="duration">0:00</span>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #current-track-display {
            background: #333;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            color: white;
        }
        .track-info .track-title { font-weight: bold; font-size: 1.1em; }
        .track-info .track-artist { color: #ccc; font-size: 0.9em; }
        .progress-bar {
            background: #555;
            height: 4px;
            border-radius: 2px;
            margin: 10px 0 5px 0;
            position: relative;
        }
        .progress-fill {
            background: #cc0000;
            height: 100%;
            border-radius: 2px;
            width: 0%;
            transition: width 0.1s;
        }
        .time-display {
            font-size: 0.8em;
            color: #ccc;
        }
    `;
    document.head.appendChild(style);
    
    // Insert display after album description
    const albumDesc = document.querySelector('.album-description');
    if (albumDesc) {
        albumDesc.parentNode.insertBefore(trackDisplay, albumDesc.nextSibling);
    }
    
    // Setup play buttons
    document.querySelectorAll('.mini-play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const trackItem = btn.closest('.track-item');
            const trackName = trackItem.querySelector('.track-name').textContent;
            const sampleSrc = trackItem.dataset.src;
            
            // Stop current audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            
            // Reset all buttons
            document.querySelectorAll('.mini-play-btn').forEach(b => b.innerHTML = '▶ Play');
            document.querySelectorAll('.track-item').forEach(t => t.classList.remove('playing'));
            
            // Update display
            trackDisplay.querySelector('.track-title').textContent = trackName;
            btn.innerHTML = '⏳ Loading...';
            trackItem.classList.add('playing');
            currentTrackElement = trackItem;
            
            // Try local file first, then fallback
            currentAudio = new Audio();
            
            currentAudio.addEventListener('loadstart', () => {
                console.log('Loading:', sampleSrc);
            });
            
            currentAudio.addEventListener('canplay', () => {
                btn.innerHTML = '⏸️ Playing';
                currentAudio.play().then(() => {
                    updateProgress();
                    
                    // 30 second preview
                    setTimeout(() => {
                        if (currentAudio && !currentAudio.paused) {
                            currentAudio.pause();
                            btn.innerHTML = '▶ Play';
                            trackItem.classList.remove('playing');
                            alert(`Preview ended for "${trackName}". Purchase full track ($1.50) or album ($14.99).`);
                        }
                    }, 30000);
                });
            });
            
            currentAudio.addEventListener('error', () => {
                console.log('Local file failed, using demo audio');
                // Use demo audio
                currentAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
                currentAudio.load();
            });
            
            currentAudio.addEventListener('timeupdate', updateProgress);
            
            currentAudio.addEventListener('ended', () => {
                btn.innerHTML = '▶ Play';
                trackItem.classList.remove('playing');
            });
            
            // Load audio
            currentAudio.src = sampleSrc;
            currentAudio.load();
        });
    });
    
    function updateProgress() {
        if (!currentAudio) return;
        
        const current = currentAudio.currentTime;
        const duration = currentAudio.duration || 30;
        
        const progressFill = trackDisplay.querySelector('.progress-fill');
        const currentTimeEl = trackDisplay.querySelector('.current-time');
        const durationEl = trackDisplay.querySelector('.duration');
        
        if (progressFill) {
            progressFill.style.width = (current / duration * 100) + '%';
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(current);
        }
        
        if (durationEl) {
            durationEl.textContent = formatTime(Math.min(duration, 30));
        }
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    console.log('Fixed audio player loaded');
});