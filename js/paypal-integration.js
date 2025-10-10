// PayPal Integration for Mac Wayne Site
class PayPalIntegration {
    constructor() {
        this.clientId = 'ATefxKUHVrxyBM7_sudRHvnbUXV-nznDOJD9ZwO_nRMOSZlYCfrHA6SouCz9K7Uk3X0phjvkj_Yo0STn';
        this.loaded = false;
        this.init();
    }

    async init() {
        await this.loadPayPalSDK();
        this.setupPayPalButtons();
    }

    async loadPayPalSDK() {
        if (document.querySelector('script[src*="paypal.com"]')) {
            this.loaded = true;
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=USD&intent=capture`;
            script.onload = () => {
                this.loaded = true;
                resolve();
            };
            script.onerror = (error) => {
                console.warn('PayPal SDK failed to load - payments will be simulated');
                resolve(); // Don't reject, just continue without PayPal
            };
            document.head.appendChild(script);
        });
    }

    setupPayPalButtons() {
        // Album purchase buttons
        this.setupAlbumPurchase();
        
        // Streaming access buttons
        this.setupStreamingAccess();
        
        // Track purchase buttons
        this.setupTrackPurchase();
        
        // Donation buttons
        this.setupDonations();
    }

    setupAlbumPurchase() {
        const albumContainer = document.getElementById('paypal-album-container');
        if (!albumContainer || !window.paypal) return;

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '14.99'
                        },
                        description: 'Mac Wayne - Blind & Battered Album (20 tracks)'
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    this.handleAlbumPurchaseSuccess(details);
                });
            },
            onError: (err) => {
                console.error('PayPal album purchase error:', err);
                alert('Payment failed. Please try again.');
            }
        }).render('#paypal-album-container');
    }

    setupStreamingAccess() {
        // Streaming PayPal buttons will be created dynamically when needed
    }

    createStreamingButton() {
        const streamingContainer = document.getElementById('paypal-streaming-container');
        if (!streamingContainer || !window.paypal) return;

        // Clear existing content
        streamingContainer.innerHTML = `
            <h3>Complete Streaming Access</h3>
            <p>Click the PayPal button below to get full album streaming access for $5.00</p>
            <div id="paypal-streaming-buttons"></div>
        `;

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '5.00'
                        },
                        description: 'Mac Wayne - Full Album Streaming Access'
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    this.handleStreamingPurchaseSuccess(details);
                });
            },
            onError: (err) => {
                console.error('PayPal streaming purchase error:', err);
                alert('Payment failed. Please try again.');
            }
        }).render('#paypal-streaming-buttons');
    }

    setupTrackPurchase() {
        const trackContainer = document.getElementById('paypal-track-container');
        if (!trackContainer || !window.paypal) return;

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '1.50'
                        },
                        description: 'Mac Wayne - Individual Track Purchase'
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    this.handleTrackPurchaseSuccess(details);
                });
            },
            onError: (err) => {
                console.error('PayPal track purchase error:', err);
                alert('Payment failed. Please try again.');
            }
        }).render('#paypal-track-container');
    }

    setupDonations() {
        // This will be called by the donation system when amount is set
    }

    createDonationButton(amount) {
        const donationContainer = document.getElementById('paypal-donation-container');
        if (!donationContainer || !window.paypal) return;

        // Clear existing buttons
        donationContainer.innerHTML = `
            <h3>Complete Your Donation</h3>
            <p>Donating $${amount} to support Mac Wayne</p>
            <div id="paypal-donation-buttons"></div>
        `;

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toString()
                        },
                        description: `Donation to support Mac Wayne - $${amount}`
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    this.handleDonationSuccess(details, amount);
                });
            },
            onError: (err) => {
                console.error('PayPal donation error:', err);
                alert('Donation failed. Please try again.');
            }
        }).render('#paypal-donation-buttons');
    }

    handleAlbumPurchaseSuccess(details) {
        // Save purchase status
        localStorage.setItem('mac-wayne-album-purchased', 'true');
        
        // Show success message
        alert('Thank you for purchasing Mac Wayne\'s album! You now have access to all tracks.');
        
        // Hide PayPal container
        document.getElementById('paypal-album-container').style.display = 'none';
        
        // Update UI
        if (window.purchaseSystem) {
            window.purchaseSystem.completePurchase('digital', '14.99');
        }
    }

    handleStreamingPurchaseSuccess(details) {
        // Save streaming access
        localStorage.setItem('mac-wayne-streaming-access', 'true');
        
        // Show success message
        alert('Thank you! You now have full album streaming access. All tracks are unlocked!');
        
        // Hide PayPal container
        document.getElementById('paypal-streaming-container').style.display = 'none';
        
        // Enable full audio playback
        this.enableStreamingMode();
        
        // Trigger streaming system update
        if (window.enableStreamingAccess) {
            window.enableStreamingAccess();
        }
    }

    handleTrackPurchaseSuccess(details) {
        alert('Thank you for your purchase! Your track download will begin shortly.');
        document.getElementById('paypal-track-container').style.display = 'none';
    }

    enableStreamingMode() {
        // Update all track items to show streaming access
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            const playBtn = item.querySelector('.mini-play-btn');
            const trackStatus = item.querySelector('.track-status');
            
            if (playBtn && trackStatus) {
                trackStatus.textContent = 'Full Track';
                trackStatus.className = 'track-status full';
                playBtn.textContent = '▶ Play Full';
            }
        });
        
        // Update purchase buttons
        const streamingBtn = document.querySelector('.purchase-streaming');
        if (streamingBtn) {
            streamingBtn.innerHTML = '✓ Streaming Active';
            streamingBtn.disabled = true;
            streamingBtn.style.background = '#28a745';
        }
    }

    handleDonationSuccess(details, amount) {
        alert(`Thank you for your $${amount} donation to support Mac Wayne!`);
        document.getElementById('paypal-donation-container').style.display = 'none';
        
        // Reset donation form
        if (window.helpBlindMan) {
            window.helpBlindMan.resetDonationForm();
        }
    }
}

// Initialize PayPal integration
document.addEventListener('DOMContentLoaded', () => {
    window.paypalIntegration = new PayPalIntegration();
});

// Make donation function available globally
window.createPayPalDonation = (amount) => {
    if (window.paypalIntegration) {
        window.paypalIntegration.createDonationButton(amount);
    }
};