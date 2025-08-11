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
            
            // Use actual sample files
            currentAudio = new Audio(sampleSrc);
            
            currentAudio.addEventListener('canplay', () => {
                btn.innerHTML = '⏸️ Playing';
                currentAudio.play().then(() => {
                    // Update progress every 100ms
                    const progressInterval = setInterval(() => {
                        if (!currentAudio || currentAudio.paused) {
                            clearInterval(progressInterval);
                            return;
                        }
                        
                        const current = currentAudio.currentTime;
                        const progressFill = trackDisplay.querySelector('.progress-fill');
                        const currentTimeEl = trackDisplay.querySelector('.current-time');
                        
                        if (progressFill) progressFill.style.width = (current / 30 * 100) + '%';
                        if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
                        
                        // Stop at 30 seconds
                        if (current >= 30) {
                            currentAudio.pause();
                            clearInterval(progressInterval);
                            btn.innerHTML = '▶ Play';
                            trackItem.classList.remove('playing');
                            alert(`Preview ended for "${trackName}". Purchase full track ($1.50) or album ($14.99).`);
                        }
                    }, 100);
                }).catch(error => {
                    console.error('Play failed:', error);
                    btn.innerHTML = '❌ Error';
                    setTimeout(() => {
                        btn.innerHTML = '▶ Play';
                        trackItem.classList.remove('playing');
                    }, 2000);
                });
            });
            
            currentAudio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                btn.innerHTML = '❌ Error';
                setTimeout(() => {
                    btn.innerHTML = '▶ Play';
                    trackItem.classList.remove('playing');
                }, 2000);
            });
            
            currentAudio.addEventListener('ended', () => {
                btn.innerHTML = '▶ Play';
                trackItem.classList.remove('playing');
            });
            
            currentAudio.load();
        });
    });
    
    function updateProgress() {
        const durationEl = trackDisplay.querySelector('.duration');
        if (durationEl) {
            durationEl.textContent = '0:30';
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