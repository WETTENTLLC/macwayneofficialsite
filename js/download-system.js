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
        setTimeout(() => {
            this.initPayPalButton(type, trackId, finalPrice, itemName, modal, purchaseType);
        }, 100);
        
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
        // Map track IDs to actual file paths
        const trackFiles = {
            'track-1': 'public/audio/Blind and Battered [Explicit]/01 - Gotta Split [Explicit].mp3',
            'track-2': 'public/audio/Blind and Battered [Explicit]/02 - I Think [Explicit].mp3',
            'track-3': 'public/audio/Blind and Battered [Explicit]/03 - Keep Your Mouth Shut (Skit) [Explicit].mp3',
            'track-4': 'public/audio/Blind and Battered [Explicit]/04 - Just a Player [Explicit].mp3',
            'track-5': 'public/audio/Blind and Battered [Explicit]/05 - Ziplocks [Explicit].mp3',
            'track-6': 'public/audio/Blind and Battered [Explicit]/06 - Where You Been (Skit) [Explicit].mp3',
            'track-7': 'public/audio/Blind and Battered [Explicit]/07 - Cant Tell Me [Explicit].mp3',
            'track-8': 'public/audio/Blind and Battered [Explicit]/08 - Just a Gimmick [Explicit].mp3',
            'track-9': 'public/audio/Blind and Battered [Explicit]/09 - Wish I Knew Then [Explicit].mp3',
            'track-10': 'public/audio/Blind and Battered [Explicit]/10 - Blind and Battered [Explicit].mp3',
            'track-11': 'public/audio/Blind and Battered [Explicit]/11 - Smoother Than Woodgrain [Explicit].mp3',
            'track-12': 'public/audio/Blind and Battered [Explicit]/12 - Touch You [Explicit].mp3',
            'track-13': 'public/audio/Blind and Battered [Explicit]/13 - Life of Magic [Explicit].mp3',
            'track-14': 'public/audio/Blind and Battered [Explicit]/14 - Its Going Down [Explicit].mp3',
            'track-15': 'public/audio/Blind and Battered [Explicit]/15 - One Way In [Explicit].mp3',
            'track-16': 'public/audio/Blind and Battered [Explicit]/16 - Crispy Game [Explicit].mp3',
            'track-17': 'public/audio/Blind and Battered [Explicit]/17 - The End of the World [Explicit].mp3',
            'track-18': 'public/audio/Blind and Battered [Explicit]/18 - Smell of Victory [Explicit].mp3',
            'track-19': 'public/audio/Blind and Battered [Explicit]/19 - Do the I\'m the Shit [Explicit].mp3',
            'track-20': 'public/audio/Blind and Battered [Explicit]/20 - Hatin On a Blind Man [Explicit].mp3'
        };
        
        const trackNames = {
            'track-1': 'Gotta Split',
            'track-2': 'I Think',
            'track-3': 'Keep Your Mouth Shut (Skit)',
            'track-4': 'Just a Player',
            'track-5': 'Ziplocks',
            'track-6': 'Where You Been (Skit)',
            'track-7': 'Cant Tell Me',
            'track-8': 'Just a Gimmick',
            'track-9': 'Wish I Knew Then',
            'track-10': 'Blind and Battered',
            'track-11': 'Smoother Than Woodgrain',
            'track-12': 'Touch You',
            'track-13': 'Life of Magic',
            'track-14': 'Its Going Down',
            'track-15': 'One Way In',
            'track-16': 'Crispy Game',
            'track-17': 'The End of the World',
            'track-18': 'Smell of Victory',
            'track-19': 'Do the I\'m the Shit',
            'track-20': 'Hatin On a Blind Man'
        };
        
        const audioSrc = trackFiles[trackId];
        const trackName = trackNames[trackId];
        
        if (!audioSrc || !trackName) {
            this.showDownloadError(`Track ${trackId} not found`);
            return;
        }
        
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
        // Create a download modal with all tracks
        const modal = document.createElement('div');
        modal.className = 'album-download-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Download Full Album</h3>
                <p>Click on any track to download individually, or download all:</p>
                <div class="album-tracks-list">
                    ${this.generateFullTrackList()}
                </div>
                <div class="album-actions">
                    <button class="download-all-btn" onclick="downloadSystem.downloadAllTracks()">Download All Tracks</button>
                    <button class="close-modal" onclick="document.body.removeChild(this.closest('.album-download-modal'))">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Generate full track list for album download
    generateFullTrackList() {
        const tracks = [
            { id: 'track-1', name: 'Gotta Split' },
            { id: 'track-2', name: 'I Think' },
            { id: 'track-3', name: 'Keep Your Mouth Shut (Skit)' },
            { id: 'track-4', name: 'Just a Player' },
            { id: 'track-5', name: 'Ziplocks' },
            { id: 'track-6', name: 'Where You Been (Skit)' },
            { id: 'track-7', name: 'Cant Tell Me' },
            { id: 'track-8', name: 'Just a Gimmick' },
            { id: 'track-9', name: 'Wish I Knew Then' },
            { id: 'track-10', name: 'Blind and Battered' },
            { id: 'track-11', name: 'Smoother Than Woodgrain' },
            { id: 'track-12', name: 'Touch You' },
            { id: 'track-13', name: 'Life of Magic' },
            { id: 'track-14', name: 'Its Going Down' },
            { id: 'track-15', name: 'One Way In' },
            { id: 'track-16', name: 'Crispy Game' },
            { id: 'track-17', name: 'The End of the World' },
            { id: 'track-18', name: 'Smell of Victory' },
            { id: 'track-19', name: 'Do the I\'m the Shit' },
            { id: 'track-20', name: 'Hatin On a Blind Man' }
        ];
        
        return tracks.map(track => `
            <div class="track-download-item">
                <span class="track-number">${track.id.replace('track-', '')}</span>
                <span class="track-name">${track.name}</span>
                <button class="mini-download-btn" onclick="downloadSystem.downloadTrack('${track.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `).join('');
    }
    
    // Download all tracks sequentially
    downloadAllTracks() {
        const tracks = ['track-1', 'track-2', 'track-3', 'track-4', 'track-5', 'track-6', 'track-7', 'track-8', 'track-9', 'track-10', 'track-11', 'track-12', 'track-13', 'track-14', 'track-15', 'track-16', 'track-17', 'track-18', 'track-19', 'track-20'];
        
        tracks.forEach((trackId, index) => {
            setTimeout(() => {
                this.downloadTrack(trackId);
            }, index * 1000); // Stagger downloads by 1 second
        });
        
        this.showDownloadSuccess('All tracks download started! Files will download one by one.');
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
    initPayPalButton(type, trackId, price, itemName, modal, purchaseType) {
        if (!window.paypal) {
            // Load PayPal SDK if not already loaded
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=ATefxKUHVrxyBM7_sudRHvnbUXV-nznDOJD9ZwO_nRMOSZlYCfrHA6SouCz9K7Uk3X0phjvkj_Yo0STn&currency=USD';
            script.onload = () => this.renderPayPalButton(type, trackId, price, itemName, modal, purchaseType);
            document.head.appendChild(script);
        } else {
            this.renderPayPalButton(type, trackId, price, itemName, modal, purchaseType);
        }
    }

    // Render PayPal button
    renderPayPalButton(type, trackId, price, itemName, modal, purchaseType = 'download') {
        const containerId = `paypal-button-container-${type}-${purchaseType}`;
        const container = modal.querySelector(`#${containerId}`);
        
        if (!container) {
            console.error('PayPal container not found:', containerId);
            return;
        }
        
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
        }).render(`#${containerId}`);
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
    
    // Show download error message
    showDownloadError(message) {
        const toast = document.createElement('div');
        toast.className = 'download-error-toast';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3000);
    }


}

// Initialize download system
let downloadSystem;
document.addEventListener('DOMContentLoaded', function() {
    downloadSystem = new DownloadSystem();
});

