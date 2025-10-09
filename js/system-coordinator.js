// System Coordinator - Ensures all systems work together without conflicts
class SystemCoordinator {
    constructor() {
        this.activeSystems = new Set();
        this.systemPriority = {
            'paymentDeliverySystem': 1,
            'audioPlayerControls': 2,
            'paypalIntegration': 3,
            'streamingSystem': 4
        };
        this.init();
    }

    init() {
        this.preventConflicts();
        this.coordinateSystemStartup();
    }

    preventConflicts() {
        // Disable conflicting old systems
        this.disableOldAudioSystems();
        this.preventDuplicateEventListeners();
    }

    disableOldAudioSystems() {
        // Disable old audio players that might conflict
        const oldSystems = ['macWaynePlayer', 'simpleAudioPlayer', 'workingAudioSystem'];
        oldSystems.forEach(system => {
            if (window[system] && typeof window[system].disable === 'function') {
                window[system].disable();
            }
        });
    }

    preventDuplicateEventListeners() {
        // Remove duplicate click handlers on play buttons
        document.querySelectorAll('.mini-play-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
    }

    coordinateSystemStartup() {
        // Ensure systems start in correct order
        const startupOrder = [
            'paymentDeliverySystem',
            'audioPlayerControls', 
            'paypalIntegration',
            'streamingSystem'
        ];

        startupOrder.forEach((systemName, index) => {
            setTimeout(() => {
                this.validateSystem(systemName);
            }, index * 100);
        });
    }

    validateSystem(systemName) {
        if (window[systemName]) {
            this.activeSystems.add(systemName);
            console.log(`✓ ${systemName} active`);
        }
    }

    // Ensure only one audio plays at a time across all systems
    enforceAudioExclusivity() {
        if (window.audioPlayerControls && window.audioPlayerControls.currentAudio) {
            // Stop other audio systems
            const otherAudioElements = document.querySelectorAll('audio:not(#main-audio-player)');
            otherAudioElements.forEach(audio => {
                if (!audio.paused) {
                    audio.pause();
                }
            });
        }
    }

    // Clean up old purchase data conflicts
    cleanupStorageConflicts() {
        const oldKeys = [
            'purchasedTracks',
            'albumPurchased', 
            'mac-wayne-purchase-status'
        ];
        
        oldKeys.forEach(key => {
            if (localStorage.getItem(key) && !localStorage.getItem('mac-wayne-' + key)) {
                // Migrate old data to new format
                const oldData = localStorage.getItem(key);
                localStorage.setItem('mac-wayne-' + key, oldData);
                localStorage.removeItem(key);
            }
        });
    }
}

// Initialize coordinator before other systems
document.addEventListener('DOMContentLoaded', () => {
    window.systemCoordinator = new SystemCoordinator();
});