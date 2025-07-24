// Download System for Purchased Tracks
class DownloadSystem {
    constructor() {
        this.purchasedTracks = JSON.parse(localStorage.getItem('purchasedTracks') || '[]');
        this.albumPurchased = localStorage.getItem('albumPurchased') === 'true';
        this.init();
    }

    init() {
        this.updateTrackButtons();
        this.addPurchaseHandlers();
    }

    // Simulate purchase completion
    completePurchase(type, trackId = null) {
        if (type === 'album') {
            localStorage.setItem('albumPurchased', 'true');
            this.albumPurchased = true;
            // Add all tracks to purchased list
            for (let i = 1; i <= 20; i++) {
                if (!this.purchasedTracks.includes(`track-${i}`)) {
                    this.purchasedTracks.push(`track-${i}`);
                }
            }
        } else if (type === 'track' && trackId) {
            if (!this.purchasedTracks.includes(trackId)) {
                this.purchasedTracks.push(trackId);
            }
        }
        
        localStorage.setItem('purchasedTracks', JSON.stringify(this.purchasedTracks));
        this.updateTrackButtons();
        this.showDownloadModal(type, trackId);
    }

    // Update track buttons based on purchase status
    updateTrackButtons() {
        document.querySelectorAll('.track-item').forEach(track => {
            const trackId = track.dataset.id;
            const purchaseBtn = track.querySelector('.purchase-track');
            const statusEl = track.querySelector('.track-status');
            
            if (this.albumPurchased || this.purchasedTracks.includes(trackId)) {
                if (purchaseBtn) {
                    purchaseBtn.textContent = 'Download';
                    purchaseBtn.className = 'download-track';
                    purchaseBtn.onclick = () => this.downloadTrack(trackId);
                }
                if (statusEl) {
                    statusEl.textContent = 'Owned';
                    statusEl.className = 'track-status owned';
                }
            }
        });

        // Update album button
        const albumBtn = document.querySelector('.purchase-album');
        if (albumBtn && this.albumPurchased) {
            albumBtn.textContent = 'Download Album';
            albumBtn.className = 'download-album';
            albumBtn.onclick = () => this.downloadAlbum();
        }
    }

    // Add purchase button handlers
    addPurchaseHandlers() {
        // Track purchase buttons
        document.querySelectorAll('.purchase-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackItem = e.target.closest('.track-item');
                const trackId = trackItem.dataset.id;
                const purchaseType = e.target.dataset.type;
                const price = e.target.dataset.price;
                this.showPurchaseModal('track', trackId, purchaseType, price);
            });
        });

        // Album purchase buttons
        document.querySelectorAll('.album-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const purchaseType = e.target.dataset.type;
                const price = e.target.dataset.price;
                this.showPurchaseModal('album', null, purchaseType, price);
            });
        });
    }

    // Show PayPal purchase modal
    showPurchaseModal(type, trackId = null, purchaseType = 'download', price = null) {
        let itemName, finalPrice;
        
        if (type === 'album') {
            itemName = purchaseType === 'stream' ? 'Blind & Battered Album (Stream)' : 'Blind & Battered Album (Download)';
            finalPrice = price || (purchaseType === 'stream' ? '5.00' : '14.99');
        } else {
            const trackName = document.querySelector(`[data-id="${trackId}"] .track-name`).textContent;
            itemName = `${trackName} (${purchaseType === 'stream' ? 'Stream' : 'Download'})`;
            finalPrice = price || (purchaseType === 'stream' ? '0.50' : '1.50');
        }
        
        const modal = document.createElement('div');
        modal.className = 'purchase-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Purchase ${itemName}</h3>
                <p>Price: $${finalPrice} USD</p>
                <div id="paypal-button-container-${type}-${purchaseType}"></div>
                <button class="cancel-purchase">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Initialize PayPal button
        this.initPayPalButton(type, trackId, finalPrice, itemName, modal, purchaseType);
        
        modal.querySelector('.cancel-purchase').onclick = () => {
            document.body.removeChild(modal);
        };
    }

    // Show download modal with links
    showDownloadModal(type, trackId = null) {
        const modal = document.createElement('div');
        modal.className = 'download-modal';
        
        let downloadContent = '';
        if (type === 'album') {
            downloadContent = `
                <h3>Album Download Ready</h3>
                <p>Your album purchase is complete! Click below to download:</p>
                <button class="download-btn" onclick="downloadSystem.downloadAlbum()">
                    <i class="fas fa-download"></i> Download Full Album (ZIP)
                </button>
                <div class="individual-tracks">
                    <h4>Or download individual tracks:</h4>
                    ${this.generateTrackDownloadList()}
                </div>
            `;
        } else {
            const trackName = document.querySelector(`[data-id="${trackId}"] .track-name`).textContent;
            downloadContent = `
                <h3>Track Download Ready</h3>
                <p>Your purchase of "${trackName}" is complete!</p>
                <button class="download-btn" onclick="downloadSystem.downloadTrack('${trackId}')">
                    <i class="fas fa-download"></i> Download ${trackName}
                </button>
            `;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                ${downloadContent}
                <button class="close-modal" onclick="document.body.removeChild(this.closest('.download-modal'))">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Generate list of downloadable tracks
    generateTrackDownloadList() {
        return this.purchasedTracks.map(trackId => {
            const trackEl = document.querySelector(`[data-id="${trackId}"]`);
            if (!trackEl) return '';
            
            const trackName = trackEl.querySelector('.track-name').textContent;
            return `
                <div class="track-download-item">
                    <span>${trackName}</span>
                    <button class="mini-download-btn" onclick="downloadSystem.downloadTrack('${trackId}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    // Download individual track
    downloadTrack(trackId) {
        const trackEl = document.querySelector(`[data-id="${trackId}"]`);
        if (!trackEl) return;
        
        const audioSrc = trackEl.dataset.fullSrc;
        const trackName = trackEl.querySelector('.track-name').textContent;
        
        // Create download link
        const link = document.createElement('a');
        link.href = audioSrc;
        link.download = `Mac Wayne - ${trackName}.mp3`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        this.showDownloadSuccess(`${trackName} download started!`);
    }

    // Download full album as ZIP
    downloadAlbum() {
        // For demo purposes, download first track
        // In production, this would create a ZIP file
        this.downloadTrack('track-1');
        this.showDownloadSuccess('Album download started! (Demo: downloading first track)');
    }

    // Show download success message
    showDownloadSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'download-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3000);
    }

    // Initialize PayPal button
    initPayPalButton(type, trackId, price, itemName, modal) {
        if (!window.paypal) {
            // Load PayPal SDK if not already loaded
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=ATefxKUHVrxyBM7_sudRHvnbUXV-nznDOJD9ZwO_nRMOSZlYCfrHA6SouCz9K7Uk3X0phjvkj_Yo0STn&currency=USD';
            script.onload = () => this.renderPayPalButton(type, trackId, price, itemName, modal);
            document.head.appendChild(script);
        } else {
            this.renderPayPalButton(type, trackId, price, itemName, modal);
        }
    }

    // Render PayPal button
    renderPayPalButton(type, trackId, price, itemName, modal) {
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price,
                            currency_code: 'USD'
                        },
                        description: `Mac Wayne - ${itemName}`
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    // Payment successful
                    this.completePurchase(type, trackId);
                    document.body.removeChild(modal);
                    this.showPaymentSuccess(details, itemName);
                });
            },
            onError: (err) => {
                console.error('PayPal Error:', err);
                this.showPaymentError();
            },
            onCancel: () => {
                // User cancelled payment
                document.body.removeChild(modal);
            }
        }).render(`#paypal-button-container-${type}`);
    }

    // Show payment success message
    showPaymentSuccess(details, itemName) {
        const toast = document.createElement('div');
        toast.className = 'payment-success-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>Payment Successful!</strong>
                <p>Thank you for purchasing ${itemName}</p>
                <small>Transaction ID: ${details.id}</small>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 5000);
    }

    // Show payment error message
    showPaymentError() {
        const toast = document.createElement('div');
        toast.className = 'payment-error-toast';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <strong>Payment Failed</strong>
                <p>Please try again or contact support</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 5000);
    }

    // Reset purchases (for testing)
    resetPurchases() {
        localStorage.removeItem('purchasedTracks');
        localStorage.removeItem('albumPurchased');
        this.purchasedTracks = [];
        this.albumPurchased = false;
        this.updateTrackButtons();
    }
}

// Initialize download system
let downloadSystem;
document.addEventListener('DOMContentLoaded', function() {
    downloadSystem = new DownloadSystem();
});

// Global functions for testing
function simulateTrackPurchase(trackId) {
    downloadSystem.completePurchase('track', trackId);
}

function simulateAlbumPurchase() {
    downloadSystem.completePurchase('album');
}

function resetAllPurchases() {
    downloadSystem.resetPurchases();
}