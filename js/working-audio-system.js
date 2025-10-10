// Working Audio System - Clean Implementation
class WorkingAudioSystem {
    constructor() {
        this.currentAudio = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.previewDuration = 30; // 30 seconds
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAudio());
        } else {
            this.setupAudio();
        }
    }

    setupAudio() {
        // Setup all play buttons
        const playButtons = document.querySelectorAll('.mini-play-btn');
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handlePlayClick(btn);
            });
        });

        console.log(`Audio system initialized with ${playButtons.length} play buttons`);
    }

    handlePlayClick(button) {
        const trackItem = button.closest('.track-item');
        if (!trackItem) {
            console.error('Track item not found');
            return;
        }

        const trackId = trackItem.dataset.id;
        const fullSrc = trackItem.dataset.fullSrc; // Use full track instead of sample
        const trackName = trackItem.querySelector('.track-name')?.textContent || 'Unknown Track';

        console.log('Playing track:', trackName, 'Source:', fullSrc);

        // Stop current audio if playing
        this.stopCurrentAudio();

        // Update button state
        this.updatePlayButton(button, 'loading');

        // Create and play audio
        this.playAudio(fullSrc, trackName, button, trackItem);
    }

    playAudio(src, trackName, button, trackItem) {
        try {
            this.currentAudio = new Audio(src);
            this.currentTrack = { name: trackName, button, trackItem };
            
            // Set up audio events
            this.currentAudio.addEventListener('loadstart', () => {
                console.log('Audio loading started');
            });

            this.currentAudio.addEventListener('canplay', () => {
                console.log('Audio can play');
                this.updatePlayButton(button, 'playing');
                this.currentAudio.play().catch(error => {
                    console.error('Play failed:', error);
                    this.handleAudioError(button, trackName);
                });
            });

            this.currentAudio.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayButton(button, 'playing');
                trackItem.classList.add('playing');
                
                // No preview timer - allow full track listening
            });

            this.currentAudio.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayButton(button, 'paused');
                trackItem.classList.remove('playing');
            });

            this.currentAudio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updatePlayButton(button, 'stopped');
                trackItem.classList.remove('playing');
            });

            this.currentAudio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                this.handleAudioError(button, trackName);
            });

            // Start loading
            this.currentAudio.load();

        } catch (error) {
            console.error('Error creating audio:', error);
            this.handleAudioError(button, trackName);
        }
    }

    stopCurrentAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }

        if (this.currentTrack) {
            this.updatePlayButton(this.currentTrack.button, 'stopped');
            this.currentTrack.trackItem.classList.remove('playing');
            this.currentTrack = null;
        }

        this.isPlaying = false;
    }



    updatePlayButton(button, state) {
        if (!button) return;

        switch (state) {
            case 'loading':
                button.innerHTML = '⏳';
                button.disabled = true;
                break;
            case 'playing':
                button.innerHTML = '⏸️ Pause';
                button.disabled = false;
                break;
            case 'paused':
            case 'stopped':
                button.innerHTML = '▶️ Play';
                button.disabled = false;
                break;
        }
    }

    handleAudioError(button, trackName) {
        console.log('Audio failed, trying fallback');
        this.updatePlayButton(button, 'stopped');
        
        // Try with a working external audio file as fallback
        const fallbackAudio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
        
        fallbackAudio.addEventListener('canplay', () => {
            fallbackAudio.play().then(() => {
                console.log('Fallback audio playing');
                this.updatePlayButton(button, 'playing');
                
                setTimeout(() => {
                    fallbackAudio.pause();
                    this.updatePlayButton(button, 'stopped');
                    this.showPurchasePrompt(trackName);
                }, 5000); // 5 second demo
                
            }).catch(error => {
                console.error('Fallback audio failed:', error);
                alert(`Audio preview temporarily unavailable for "${trackName}"`);
                this.updatePlayButton(button, 'stopped');
            });
        });

        fallbackAudio.addEventListener('error', () => {
            alert(`Audio preview temporarily unavailable for "${trackName}"`);
            this.updatePlayButton(button, 'stopped');
        });

        fallbackAudio.load();
    }



    // PayPal Integration
    initPayPal() {
        // Load PayPal SDK if not already loaded
        if (!window.paypal && !document.querySelector('script[src*="paypal.com/sdk"]')) {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=ATefxKUHVrxyBM7_sudRHvnbUXV-nznDOJD9ZwO_nRMOSZlYCfrHA6SouCz9K7Uk3X0phjvkj_Yo0STn&currency=USD';
            script.onload = () => this.setupPayPalButtons();
            document.head.appendChild(script);
        } else if (window.paypal) {
            this.setupPayPalButtons();
        }
    }

    setupPayPalButtons() {
        // Setup album purchase PayPal buttons
        const albumContainer = document.getElementById('paypal-album-container');
        if (albumContainer && window.paypal && !albumContainer.hasChildNodes()) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: '14.99' },
                            description: 'Mac Wayne - Blind and Battered Album (20 tracks)'
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        alert('Album purchased successfully! All tracks unlocked.');
                        localStorage.setItem('albumPurchased', 'true');
                        location.reload();
                    });
                }
            }).render(albumContainer);
        }

        // Setup track purchase PayPal buttons
        const trackContainer = document.getElementById('paypal-track-container');
        if (trackContainer && window.paypal && !trackContainer.hasChildNodes()) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    const trackId = trackContainer.dataset.trackId || 'track-1';
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: '1.50' },
                            description: `Mac Wayne - Individual Track`
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        const trackId = trackContainer.dataset.trackId || 'track-1';
                        alert('Track purchased successfully!');
                        
                        // Store purchased track
                        const purchased = JSON.parse(localStorage.getItem('purchasedTracks') || '[]');
                        if (!purchased.includes(trackId)) {
                            purchased.push(trackId);
                            localStorage.setItem('purchasedTracks', JSON.stringify(purchased));
                        }
                        
                        trackContainer.style.display = 'none';
                        location.reload();
                    });
                }
            }).render(trackContainer);
        }
    }
}

// Initialize the audio system
window.audioSystem = new WorkingAudioSystem();

// Initialize PayPal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.audioSystem) {
        window.audioSystem.initPayPal();
    }
});

// Debug functions
window.testAudio = () => {
    console.log('Testing audio system...');
    const firstPlayBtn = document.querySelector('.mini-play-btn');
    if (firstPlayBtn) {
        firstPlayBtn.click();
    } else {
        console.log('No play buttons found');
    }
};

window.stopAllAudio = () => {
    if (window.audioSystem) {
        window.audioSystem.stopCurrentAudio();
    }
};