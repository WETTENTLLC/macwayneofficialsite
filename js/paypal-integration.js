// PayPal Integration for Mac Wayne Site
class PayPalIntegration {
    constructor() {
        this.clientId = 'AQlP8Uy9H8k2lVhKzd7hF8k2lVhKzd7hF8k2lVhKzd7hF8k2lVhKzd7hF8k2lVhKzd7h';
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
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupPayPalButtons() {
        // Album purchase buttons
        this.setupAlbumPurchase();
        
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

    handleTrackPurchaseSuccess(details) {
        alert('Thank you for your purchase! Your track download will begin shortly.');
        document.getElementById('paypal-track-container').style.display = 'none';
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