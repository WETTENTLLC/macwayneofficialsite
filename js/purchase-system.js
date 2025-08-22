// Purchase System for Mac Wayne Site
class PurchaseSystem {
    constructor() {
        this.purchaseStatus = this.loadPurchaseStatus();
        this.init();
    }

    init() {
        this.setupPurchaseButtons();
        this.updateUI();
    }

    setupPurchaseButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.purchase-album')) {
                e.preventDefault();
                this.showPurchaseModal();
            }
        });
    }

    showPurchaseModal() {
        const modal = document.createElement('div');
        modal.className = 'purchase-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Purchase Mac Wayne Album</h3>
                <div class="purchase-options">
                    <div class="option">
                        <h4>Digital Album - $9.99</h4>
                        <p>✓ Instant download</p>
                        <p>✓ All 20 full tracks</p>
                        <p>✓ High quality MP3</p>
                        <button class="btn-purchase" data-type="digital" data-price="9.99">Buy Digital</button>
                    </div>
                    <div class="option">
                        <h4>Physical CD - $15.99</h4>
                        <p>✓ Physical CD shipped</p>
                        <p>✓ Digital download included</p>
                        <p>✓ Album artwork</p>
                        <button class="btn-purchase" data-type="physical" data-price="15.99">Buy Physical</button>
                    </div>
                </div>
                <button class="btn-close">Cancel</button>
            </div>
        `;

        // Add event listeners
        modal.querySelectorAll('.btn-purchase').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const price = btn.dataset.price;
                this.processPurchase(type, price);
                modal.remove();
            });
        });

        modal.querySelector('.btn-close').addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
    }

    processPurchase(type, price) {
        // Show processing
        this.showProcessingModal();

        // Simulate payment processing
        setTimeout(() => {
            this.completePurchase(type, price);
        }, 2000);
    }

    showProcessingModal() {
        const modal = document.createElement('div');
        modal.className = 'purchase-modal processing';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="spinner"></div>
                <h3>Processing Payment...</h3>
                <p>Please wait while we process your purchase.</p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    completePurchase(type, price) {
        // Remove processing modal
        document.querySelector('.purchase-modal.processing')?.remove();

        // Save purchase
        this.purchaseStatus = {
            purchased: true,
            type: type,
            price: price,
            date: new Date().toISOString(),
            unlocked: true
        };
        this.savePurchaseStatus();

        // Update download system
        if (window.downloadSystem) {
            window.downloadSystem.completePurchase('album');
        }

        // Show success with download option
        this.showSuccessModal(type, price);

        // Update UI
        this.updateUI();

        // Unlock audio if player exists
        if (window.macWaynePlayer) {
            window.macWaynePlayer.isPreviewMode = false;
            window.macWaynePlayer.updatePurchaseStatus();
        }
    }

    showSuccessModal(type, price) {
        const modal = document.createElement('div');
        modal.className = 'purchase-modal success';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">🎉</div>
                <h3>Purchase Successful!</h3>
                <p>Thank you for supporting Mac Wayne!</p>
                <div class="purchase-details">
                    <p><strong>Item:</strong> ${type === 'digital' ? 'Digital Album' : 'Physical CD + Digital'}</p>
                    <p><strong>Price:</strong> $${price}</p>
                    <p><strong>Status:</strong> ${type === 'digital' ? 'Available for download' : 'Will ship within 3-5 business days'}</p>
                </div>
                <p class="unlock-notice">🔓 All tracks are now unlocked!</p>
                <div class="download-actions">
                    <button class="btn-download" onclick="this.startDownload()">📥 Download Album Now</button>
                    <button class="btn-close">Start Listening</button>
                </div>
            </div>
        `;

        // Add download functionality
        modal.querySelector('.btn-download').addEventListener('click', () => {
            if (window.downloadSystem) {
                window.downloadSystem.downloadAlbum();
            }
            modal.remove();
        });

        modal.querySelector('.btn-close').addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
    }

    updateUI() {
        const purchaseButtons = document.querySelectorAll('.purchase-album');
        
        purchaseButtons.forEach(btn => {
            if (this.purchaseStatus.purchased) {
                btn.innerHTML = '✓ Purchased';
                btn.disabled = true;
                btn.style.background = '#28a745';
                btn.style.cursor = 'default';
            } else {
                btn.innerHTML = 'Purchase Album - $9.99';
                btn.disabled = false;
                btn.style.background = '#cc0000';
                btn.style.cursor = 'pointer';
            }
        });

        // Update track indicators
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            const duration = item.querySelector('.track-duration');
            if (duration) {
                if (this.purchaseStatus.purchased) {
                    duration.textContent = 'Full Track';
                    duration.style.color = '#28a745';
                } else {
                    duration.textContent = 'Preview';
                    duration.style.color = '#ffc107';
                }
            }
        });
    }

    loadPurchaseStatus() {
        const saved = localStorage.getItem('mac-wayne-purchase-status');
        return saved ? JSON.parse(saved) : { purchased: false };
    }

    savePurchaseStatus() {
        localStorage.setItem('mac-wayne-purchase-status', JSON.stringify(this.purchaseStatus));
    }

    isPurchased() {
        return this.purchaseStatus.purchased;
    }


}

// Initialize purchase system
document.addEventListener('DOMContentLoaded', () => {
    window.purchaseSystem = new PurchaseSystem();
    
    // Ensure download system is available
    if (!window.downloadSystem && window.DownloadSystem) {
        window.downloadSystem = new DownloadSystem();
    }
});

