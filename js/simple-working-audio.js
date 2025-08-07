// Simple Working Audio System
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple audio system loading...');
    
    // Working external audio sources for testing
    const workingAudioSources = [
        'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        'https://www.soundjay.com/misc/sounds/beep-07a.wav',
        'https://www.soundjay.com/misc/sounds/beep-10.wav'
    ];
    
    let currentAudio = null;
    
    // Setup all play buttons
    const playButtons = document.querySelectorAll('.mini-play-btn');
    console.log(`Found ${playButtons.length} play buttons`);
    
    playButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const trackItem = btn.closest('.track-item');
            const trackName = trackItem.querySelector('.track-name')?.textContent || `Track ${index + 1}`;
            
            console.log(`Playing: ${trackName}`);
            
            // Stop current audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            
            // Reset all buttons
            document.querySelectorAll('.mini-play-btn').forEach(b => {
                b.innerHTML = '▶ Play';
                b.disabled = false;
            });
            
            // Update current button
            btn.innerHTML = '⏳ Loading...';
            btn.disabled = true;
            
            // Use working external audio
            const audioSrc = workingAudioSources[index % workingAudioSources.length];
            currentAudio = new Audio(audioSrc);
            
            currentAudio.addEventListener('canplay', () => {
                btn.innerHTML = '⏸️ Playing';
                currentAudio.play().then(() => {
                    console.log(`Playing ${trackName} preview`);
                    
                    // Stop after 10 seconds for demo
                    setTimeout(() => {
                        if (currentAudio && !currentAudio.paused) {
                            currentAudio.pause();
                            btn.innerHTML = '▶ Play';
                            btn.disabled = false;
                            
                            alert(`Preview ended for "${trackName}". Purchase full track ($1.50) or album ($14.99) to hear complete songs.`);
                        }
                    }, 10000);
                    
                }).catch(error => {
                    console.error('Play failed:', error);
                    btn.innerHTML = '❌ Error';
                    setTimeout(() => {
                        btn.innerHTML = '▶ Play';
                        btn.disabled = false;
                    }, 2000);
                });
            });
            
            currentAudio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                btn.innerHTML = '❌ Error';
                setTimeout(() => {
                    btn.innerHTML = '▶ Play';
                    btn.disabled = false;
                }, 2000);
            });
            
            currentAudio.addEventListener('ended', () => {
                btn.innerHTML = '▶ Play';
                btn.disabled = false;
            });
            
            // Load the audio
            currentAudio.load();
        });
    });
    
    console.log('Simple audio system ready!');
});

// Test function
window.testAudio = () => {
    const firstBtn = document.querySelector('.mini-play-btn');
    if (firstBtn) {
        console.log('Testing first track...');
        firstBtn.click();
    }
};