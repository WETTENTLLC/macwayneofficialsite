// Audio Fallback System for GitHub Pages
class AudioFallback {
    constructor() {
        this.initFallback();
    }
    
    initFallback() {
        // Replace all audio functionality with purchase prompts
        document.querySelectorAll('.mini-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const trackItem = btn.closest('.track-item');
                const trackName = trackItem.querySelector('.track-name').textContent;
                
                // Show purchase modal instead of playing audio
                this.showPurchaseModal(trackName, trackItem.dataset.id);
            });
        });
    }
    
    showPurchaseModal(trackName, trackId) {
        const modal = document.createElement('div');
        modal.className = 'audio-purchase-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Audio Preview Unavailable</h3>
                <p>Preview for "${trackName}" is temporarily unavailable due to technical limitations.</p>
                <p>Purchase the track to download the full version:</p>
                <div class="modal-buttons">
                    <button class="purchase-track-btn" data-track="${trackId}">Buy Track - $1.99</button>
                    <button class="purchase-album-btn">Buy Full Album - $9.99</button>
                    <button class="close-modal-btn">Close</button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center;
            justify-content: center; z-index: 1000;
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background: #1a1a1a; padding: 2rem; border-radius: 8px;
            max-width: 400px; text-align: center; color: white;
        `;
        
        modal.querySelector('.modal-buttons').style.cssText = `
            display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem;
        `;
        
        modal.querySelectorAll('button').forEach(btn => {
            btn.style.cssText = `
                padding: 0.75rem 1.5rem; border: none; border-radius: 4px;
                cursor: pointer; font-weight: bold;
            `;
        });
        
        modal.querySelector('.purchase-track-btn').style.background = '#ff6b35';
        modal.querySelector('.purchase-album-btn').style.background = '#4CAF50';
        modal.querySelector('.close-modal-btn').style.background = '#666';
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.purchase-track-btn').addEventListener('click', () => {
            if (window.audioPlayer && window.audioPlayer.purchaseTrack) {
                window.audioPlayer.purchaseTrack({id: trackId, title: trackName});
            }
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.purchase-album-btn').addEventListener('click', () => {
            if (window.audioPlayer && window.audioPlayer.purchaseAlbum) {
                window.audioPlayer.purchaseAlbum();
            }
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Initialize fallback system
document.addEventListener('DOMContentLoaded', () => {
    new AudioFallback();
});