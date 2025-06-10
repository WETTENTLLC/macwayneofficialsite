// This is a simple script to test if audio elements are being initialized properly
document.addEventListener('DOMContentLoaded', function() {
    console.log('Audio debugging script loaded');
    
    // Add a global error handler for all audio elements
    document.querySelectorAll('audio').forEach(audio => {
        console.log('Found audio element:', audio);
        
        audio.addEventListener('error', function(e) {
            console.error('Audio error:', e, this.error);
            alert(`Audio error: ${this.error ? this.error.code : 'unknown'}`);
        });
        
        audio.addEventListener('canplay', function() {
            console.log('Audio can play:', this.src);
        });
    });
    
    // Debug SimpleAudioPlayer initialization
    const originalSimpleAudioPlayer = window.SimpleAudioPlayer;
    
    window.SimpleAudioPlayer = function(container) {
        console.log('SimpleAudioPlayer constructor called with:', container);
        try {
            return new originalSimpleAudioPlayer(container);
        } catch (error) {
            console.error('Error in SimpleAudioPlayer constructor:', error);
            alert(`Player error: ${error.message}`);
            throw error;
        }
    };
    
    // Override audio play method to debug issues
    const originalPlay = Audio.prototype.play;
    Audio.prototype.play = function() {
        console.log('Audio.play called on:', this.src);
        return originalPlay.call(this).catch(error => {
            console.error('Audio.play error:', error);
            alert(`Play error: ${error.message}`);
            throw error;
        });
    };
    
    console.log('Audio debug hooks installed');
    
    // Add manual test button
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Audio';
    testButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px 15px; background: #cc0000; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    testButton.addEventListener('click', function() {
        const testAudio = new Audio('audio/sample-preview.mp3');
        testAudio.addEventListener('canplay', () => console.log('Test audio can play'));
        testAudio.addEventListener('error', (e) => console.error('Test audio error:', e));
        testAudio.play().catch(e => console.error('Play error:', e));
    });
    
    document.body.appendChild(testButton);
});
