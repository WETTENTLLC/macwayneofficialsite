// Enhanced Payment and Delivery System for Mac Wayne Site
class PaymentDeliverySystem {
    constructor() {
        this.purchaseHistory = JSON.parse(localStorage.getItem('mac-wayne-purchases') || '[]');
        this.streamingAccess = localStorage.getItem('mac-wayne-streaming-access') === 'true';
        this.albumPurchased = localStorage.getItem('mac-wayne-album-purchased') === 'true';
        this.purchasedTracks = JSON.parse(localStorage.getItem('mac-wayne-purchased-tracks') || '[]');
        this.init();
    }

    init() {
        this.setupPaymentValidation();
        this.validateExistingPurchases();
        this.updateUI();
    }

    setupPaymentValidation() {
        if (window.paypalIntegration) {
            const originalAlbumSuccess = window.paypalIntegration.handleAlbumPurchaseSuccess;
            const originalStreamingSuccess = window.paypalIntegration.handleStreamingPurchaseSuccess;
            
            window.paypalIntegration.handleAlbumPurchaseSuccess = (details) => {
                this.processAlbumPurchase(details);
                if (originalAlbumSuccess) originalAlbumSuccess.call(window.paypalIntegration, details);
            };
            
            window.paypalIntegration.handleStreamingPurchaseSuccess = (details) => {
                this.processStreamingPurchase(details);
                if (originalStreamingSuccess) originalStreamingSuccess.call(window.paypalIntegration, details);
            };
        }
    }

    processAlbumPurchase(paymentDetails) {
        const purchase = {
            id: paymentDetails.id || this.generatePurchaseId(),
            type: 'album',
            product: 'Blind & Battered Album',
            price: '14.99',
            date: new Date().toISOString(),
            status: 'completed',
            delivered: true,
            paymentMethod: 'paypal',
            transactionId: paymentDetails.id
        };

        this.purchaseHistory.push(purchase);
        this.savePurchaseHistory();
        
        localStorage.setItem('mac-wayne-album-purchased', 'true');
        this.albumPurchased = true;
        
        this.enableFullAudioAccess();
        this.showDeliveryConfirmation('album', purchase);
    }

    processStreamingPurchase(paymentDetails) {
        const purchase = {
            id: paymentDetails.id || this.generatePurchaseId(),
            type: 'streaming',
            product: 'Album Streaming Access',
            price: '5.00',
            date: new Date().toISOString(),
            status: 'completed',
            delivered: true,
            paymentMethod: 'paypal',
            transactionId: paymentDetails.id
        };

        this.purchaseHistory.push(purchase);
        this.savePurchaseHistory();
        
        localStorage.setItem('mac-wayne-streaming-access', 'true');
        this.streamingAccess = true;
        
        this.enableStreamingMode();
        this.showDeliveryConfirmation('streaming', purchase);
    }

    processTrackPurchase(trackId, paymentDetails) {
        const purchase = {
            id: paymentDetails.id,
            type: 'track',
            product: `Track ${trackId}`,
            trackId: trackId,
            price: '1.50',
            date: new Date().toISOString(),
            status: 'completed',
            delivered: true,
            paymentMethod: 'paypal',
            transactionId: paymentDetails.id
        };

        this.purchaseHistory.push(purchase);
        this.purchasedTracks.push(trackId);
        
        localStorage.setItem('mac-wayne-purchased-tracks', JSON.stringify(this.purchasedTracks));
        this.savePurchaseHistory();
        
        this.updateTrackUI(trackId);
        this.showSuccess(`Track purchased! You can now download it.`);
    }

    // Album purchasers get full access - streaming AND downloads
    enableFullAudioAccess() {
        document.querySelectorAll('.track-item').forEach(item => {
            const trackStatus = item.querySelector('.track-status');
            const playBtn = item.querySelector('.mini-play-btn');
            const purchaseBtn = item.querySelector('.purchase-track');
            
            if (trackStatus) {
                trackStatus.textContent = 'Owned';
                trackStatus.className = 'track-status owned';
            }
            
            if (playBtn) {
                playBtn.textContent = '▶ Play Full';
                playBtn.onclick = () => this.playFullTrack(item);
            }
            
            if (purchaseBtn) {
                purchaseBtn.textContent = 'Download';
                purchaseBtn.className = 'download-track';
                purchaseBtn.onclick = () => this.downloadTrack(item.dataset.id);
            }
        });

        const previewIndicator = document.querySelector('.preview-indicator');
        if (previewIndicator) {
            previewIndicator.textContent = 'Full Album Access - Download Available';
            previewIndicator.style.color = '#28a745';
        }

        const albumBtn = document.querySelector('.purchase-album');
        if (albumBtn) {
            albumBtn.textContent = '✓ Purchased - Download Available';
            albumBtn.className = 'download-album purchased';
            albumBtn.onclick = () => this.showDownloadCenter();
        }
    }

    // Streaming purchasers get streaming only - NO downloads
    enableStreamingMode() {
        document.querySelectorAll('.track-item').forEach(item => {
            const trackStatus = item.querySelector('.track-status');
            const playBtn = item.querySelector('.mini-play-btn');
            const purchaseBtn = item.querySelector('.purchase-track');
            
            if (trackStatus) {
                trackStatus.textContent = 'Stream';
                trackStatus.className = 'track-status stream';
            }
            
            if (playBtn) {
                playBtn.textContent = '▶ Stream Full';
                playBtn.onclick = () => this.playFullTrack(item);
            }
            
            // Keep purchase button for downloads
            if (purchaseBtn && !this.albumPurchased) {
                purchaseBtn.textContent = 'Buy to Download';
            }
        });

        const streamBtn = document.querySelector('.purchase-streaming');
        if (streamBtn) {
            streamBtn.textContent = '✓ Streaming Active';
            streamBtn.disabled = true;
            streamBtn.style.background = '#28a745';
        }
    }

    updateTrackUI(trackId) {
        const trackItem = document.querySelector(`[data-id="${trackId}"]`);
        if (!trackItem) return;
        
        const trackStatus = trackItem.querySelector('.track-status');
        const purchaseBtn = trackItem.querySelector('.purchase-track');
        
        if (trackStatus) {
            trackStatus.textContent = 'Owned';
            trackStatus.className = 'track-status owned';
        }
        
        if (purchaseBtn) {
            purchaseBtn.textContent = 'Download';
            purchaseBtn.className = 'download-track';
            purchaseBtn.onclick = () => this.downloadTrack(trackId);
        }
    }

    playFullTrack(trackItem) {
        const fullSrc = trackItem.dataset.fullSrc;
        const trackName = trackItem.querySelector('.track-name').textContent;
        
        if (!fullSrc) {
            this.showError('Full track not available');
            return;
        }

        let audio = document.getElementById('main-audio-player');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'main-audio-player';
            audio.controls = true;
            audio.style.width = '100%';
            audio.style.marginTop = '10px';
            
            const playerContainer = document.querySelector('.featured-player');
            if (playerContainer) {
                playerContainer.appendChild(audio);
            }
        }
        
        audio.src = fullSrc;
        audio.play();
    }

    // Downloads only for album purchasers OR individual track purchasers
    downloadTrack(trackId) {
        if (!this.albumPurchased && !this.purchasedTracks.includes(trackId)) {
            this.showPurchasePrompt('track', trackId);
            return;
        }

        const trackFiles = {
            'track-1': { file: 'public/audio/Blind and Battered [Explicit]/01 - Gotta Split [Explicit].mp3', name: 'Gotta Split' },
            'track-2': { file: 'public/audio/Blind and Battered [Explicit]/02 - I Think [Explicit].mp3', name: 'I Think' },
            'track-3': { file: 'public/audio/Blind and Battered [Explicit]/03 - Keep Your Mouth Shut (Skit) [Explicit].mp3', name: 'Keep Your Mouth Shut (Skit)' },
            'track-4': { file: 'public/audio/Blind and Battered [Explicit]/04 - Just a Player [Explicit].mp3', name: 'Just a Player' },
            'track-5': { file: 'public/audio/Blind and Battered [Explicit]/05 - Ziplocks [Explicit].mp3', name: 'Ziplocks' },
            'track-6': { file: 'public/audio/Blind and Battered [Explicit]/06 - Where You Been (Skit) [Explicit].mp3', name: 'Where You Been (Skit)' },
            'track-7': { file: 'public/audio/Blind and Battered [Explicit]/07 - Cant Tell Me [Explicit].mp3', name: 'Cant Tell Me' },
            'track-8': { file: 'public/audio/Blind and Battered [Explicit]/08 - Just a Gimmick [Explicit].mp3', name: 'Just a Gimmick' },
            'track-9': { file: 'public/audio/Blind and Battered [Explicit]/09 - Wish I Knew Then [Explicit].mp3', name: 'Wish I Knew Then' },
            'track-10': { file: 'public/audio/Blind and Battered [Explicit]/10 - Blind and Battered [Explicit].mp3', name: 'Blind and Battered' },
            'track-11': { file: 'public/audio/Blind and Battered [Explicit]/11 - Smoother Than Woodgrain [Explicit].mp3', name: 'Smoother Than Woodgrain' },
            'track-12': { file: 'public/audio/Blind and Battered [Explicit]/12 - Touch You [Explicit].mp3', name: 'Touch You' },
            'track-13': { file: 'public/audio/Blind and Battered [Explicit]/13 - Life of Magic [Explicit].mp3', name: 'Life of Magic' },
            'track-14': { file: 'public/audio/Blind and Battered [Explicit]/14 - Its Going Down [Explicit].mp3', name: 'Its Going Down' },
            'track-15': { file: 'public/audio/Blind and Battered [Explicit]/15 - One Way In [Explicit].mp3', name: 'One Way In' },
            'track-16': { file: 'public/audio/Blind and Battered [Explicit]/16 - Crispy Game [Explicit].mp3', name: 'Crispy Game' },
            'track-17': { file: 'public/audio/Blind and Battered [Explicit]/17 - The End of the World [Explicit].mp3', name: 'The End of the World' },
            'track-18': { file: 'public/audio/Blind and Battered [Explicit]/18 - Smell of Victory [Explicit].mp3', name: 'Smell of Victory' },
            'track-19': { file: 'public/audio/Blind and Battered [Explicit]/19 - Do the I\'m the Shit [Explicit].mp3', name: 'Do the I\'m the Shit' },
            'track-20': { file: 'public/audio/Blind and Battered [Explicit]/20 - Hatin On a Blind Man [Explicit].mp3', name: 'Hatin On a Blind Man' }
        };

        const track = trackFiles[trackId];
        if (!track) {
            this.showError('Track not found');
            return;
        }

        const link = document.createElement('a');
        link.href = track.file;
        link.download = `Mac Wayne - ${track.name}.mp3`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showSuccess(`${track.name} download started!`);
    }

    // Download center only for album purchasers
    showDownloadCenter() {
        if (!this.albumPurchased) {
            this.showPurchasePrompt('album');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'download-center-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎵 Mac Wayne Album Download Center</h3>
                    <button class="close-btn" onclick="this.closest('.download-center-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="download-options">
                        <div class="download-option">
                            <h4>📦 Download Full Album</h4>
                            <p>Get all 20 tracks in one download</p>
                            <button class="download-btn" onclick="paymentDeliverySystem.downloadAllTracks()">
                                Download All Tracks
                            </button>
                        </div>
                        <div class="download-option">
                            <h4>🎵 Individual Tracks</h4>
                            <p>Download specific tracks</p>
                            <div class="track-download-list">
                                ${this.generateTrackDownloadList()}
                            </div>
                        </div>
                    </div>
                    <div class="purchase-info">
                        <h4>📋 Your Purchase</h4>
                        <p><strong>Product:</strong> Blind & Battered Album</p>
                        <p><strong>Tracks:</strong> 20 Full Tracks</p>
                        <p><strong>Format:</strong> High Quality MP3</p>
                        <p><strong>Status:</strong> ✅ Purchased & Ready for Download</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    generateTrackDownloadList() {
        const tracks = [
            'Gotta Split', 'I Think', 'Keep Your Mouth Shut (Skit)', 'Just a Player', 'Ziplocks',
            'Where You Been (Skit)', 'Cant Tell Me', 'Just a Gimmick', 'Wish I Knew Then', 'Blind and Battered',
            'Smoother Than Woodgrain', 'Touch You', 'Life of Magic', 'Its Going Down', 'One Way In',
            'Crispy Game', 'The End of the World', 'Smell of Victory', 'Do the I\'m the Shit', 'Hatin On a Blind Man'
        ];

        return tracks.map((track, index) => `
            <div class="track-download-item">
                <span class="track-number">${index + 1}.</span>
                <span class="track-name">${track}</span>
                <button class="mini-download-btn" onclick="paymentDeliverySystem.downloadTrack('track-${index + 1}')">
                    📥 Download
                </button>
            </div>
        `).join('');
    }

    downloadAllTracks() {
        for (let i = 1; i <= 20; i++) {
            setTimeout(() => {
                this.downloadTrack(`track-${i}`);
            }, i * 500);
        }
        
        this.showSuccess('All tracks download started! Files will download one by one.');
    }

    showDeliveryConfirmation(type, purchase) {
        const modal = document.createElement('div');
        modal.className = 'delivery-confirmation-modal';
        
        let content = '';
        if (type === 'album') {
            content = `
                <div class="confirmation-content">
                    <div class="success-icon">🎉</div>
                    <h3>Album Purchase Successful!</h3>
                    <p><strong>Thank you for supporting Mac Wayne!</strong></p>
                    <div class="purchase-details">
                        <p>📀 <strong>Product:</strong> Blind & Battered Album (20 tracks)</p>
                        <p>💰 <strong>Amount:</strong> $${purchase.price}</p>
                        <p>🆔 <strong>Transaction ID:</strong> ${purchase.transactionId}</p>
                    </div>
                    <div class="delivery-status">
                        <h4>✅ Delivery Complete</h4>
                        <p>• Full album access enabled</p>
                        <p>• All tracks unlocked for streaming</p>
                        <p>• Download access activated</p>
                        <p>• No expiration date</p>
                    </div>
                    <div class="action-buttons">
                        <button class="primary-btn" onclick="paymentDeliverySystem.showDownloadCenter()">
                            📥 Download Now
                        </button>
                        <button class="secondary-btn" onclick="this.closest('.delivery-confirmation-modal').remove()">
                            🎵 Start Listening
                        </button>
                    </div>
                </div>
            `;
        } else if (type === 'streaming') {
            content = `
                <div class="confirmation-content">
                    <div class="success-icon">🎵</div>
                    <h3>Streaming Access Activated!</h3>
                    <p><strong>Thank you for supporting Mac Wayne!</strong></p>
                    <div class="purchase-details">
                        <p>📱 <strong>Product:</strong> Full Album Streaming Access</p>
                        <p>💰 <strong>Amount:</strong> $${purchase.price}</p>
                        <p>🆔 <strong>Transaction ID:</strong> ${purchase.transactionId}</p>
                    </div>
                    <div class="delivery-status">
                        <h4>✅ Access Granted</h4>
                        <p>• Full album streaming enabled</p>
                        <p>• All 20 tracks unlocked</p>
                        <p>• Unlimited streaming access</p>
                        <p>• No downloads (upgrade to album for downloads)</p>
                    </div>
                    <div class="action-buttons">
                        <button class="primary-btn" onclick="this.closest('.delivery-confirmation-modal').remove()">
                            🎵 Start Streaming
                        </button>
                    </div>
                </div>
            `;
        }
        
        modal.innerHTML = `<div class="modal-content">${content}</div>`;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 10000);
    }

    showPurchasePrompt(type, trackId = null) {
        const modal = document.createElement('div');
        modal.className = 'purchase-prompt-modal';
        
        let content = '';
        if (type === 'album') {
            content = `
                <h3>🔒 Album Purchase Required</h3>
                <p>Downloads require full album purchase.</p>
                <div class="prompt-actions">
                    <button class="purchase-btn" onclick="document.querySelector('.purchase-album').click(); this.closest('.purchase-prompt-modal').remove();">
                        Buy Album - $14.99
                    </button>
                    <button class="cancel-btn" onclick="this.closest('.purchase-prompt-modal').remove()">
                        Cancel
                    </button>
                </div>
            `;
        } else if (type === 'track') {
            const trackName = document.querySelector(`[data-id="${trackId}"] .track-name`)?.textContent || 'Track';
            content = `
                <h3>🔒 Purchase Required</h3>
                <p>Download "${trackName}" for $1.50 or buy the full album for $14.99</p>
                <div class="prompt-actions">
                    <button class="purchase-btn" onclick="paymentDeliverySystem.purchaseTrack('${trackId}'); this.closest('.purchase-prompt-modal').remove();">
                        Buy Track - $1.50
                    </button>
                    <button class="purchase-btn" onclick="document.querySelector('.purchase-album').click(); this.closest('.purchase-prompt-modal').remove();">
                        Buy Album - $14.99
                    </button>
                    <button class="cancel-btn" onclick="this.closest('.purchase-prompt-modal').remove()">
                        Cancel
                    </button>
                </div>
            `;
        } else if (type === 'streaming') {
            content = `
                <h3>🔒 Streaming Access Required</h3>
                <p>This track requires streaming access to play in full.</p>
                <div class="prompt-actions">
                    <button class="purchase-btn" onclick="document.querySelector('.purchase-streaming').click(); this.closest('.purchase-prompt-modal').remove();">
                        Get Streaming - $5.00
                    </button>
                    <button class="cancel-btn" onclick="this.closest('.purchase-prompt-modal').remove()">
                        Cancel
                    </button>
                </div>
            `;
        }
        
        modal.innerHTML = `<div class="modal-content">${content}</div>`;
        document.body.appendChild(modal);
    }

    purchaseTrack(trackId) {
        const mockPaymentDetails = {
            id: 'TRACK_' + trackId + '_' + Date.now(),
            status: 'COMPLETED'
        };
        
        this.processTrackPurchase(trackId, mockPaymentDetails);
    }

    validateExistingPurchases() {
        if (this.albumPurchased) {
            this.enableFullAudioAccess();
        } else if (this.streamingAccess) {
            this.enableStreamingMode();
        }
    }

    updateUI() {
        this.validateExistingPurchases();
    }

    generatePurchaseId() {
        return 'MW_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    savePurchaseHistory() {
        localStorage.setItem('mac-wayne-purchases', JSON.stringify(this.purchaseHistory));
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    getPurchaseHistory() {
        return this.purchaseHistory;
    }

    hasAlbumAccess() {
        return this.albumPurchased;
    }

    hasStreamingAccess() {
        return this.streamingAccess;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.paymentDeliverySystem = new PaymentDeliverySystem();
});