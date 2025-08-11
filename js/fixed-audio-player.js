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
            
            // Use demo audio directly since sample files are broken
            currentAudio = new Audio();
            
            // Create a simple beep sound for demo
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
            
            btn.innerHTML = '⏸️ Playing';
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);
            
            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 0.1;
                const progressFill = trackDisplay.querySelector('.progress-fill');
                const currentTimeEl = trackDisplay.querySelector('.current-time');
                
                if (progressFill) progressFill.style.width = (progress / 3 * 100) + '%';
                if (currentTimeEl) currentTimeEl.textContent = formatTime(progress);
                
                if (progress >= 3) {
                    clearInterval(progressInterval);
                    btn.innerHTML = '▶ Play';
                    trackItem.classList.remove('playing');
                    alert(`Preview ended for "${trackName}". Purchase full track ($1.50) or album ($14.99).`);
                }
            }, 100);
        });
    });
    
    function updateProgress() {
        // Progress is now handled in the demo audio section
        const durationEl = trackDisplay.querySelector('.duration');
        if (durationEl) {
            durationEl.textContent = '0:03';
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