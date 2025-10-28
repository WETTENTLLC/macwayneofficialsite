// Real PayPal Purchase System
class RealPayPalPurchase {
    constructor() {
        this.clientId = 'ATefxKUHVrxyBM7_sudRHvnbUXV-nznDOJD9ZwO_nRMOSZlYCfrHA6SouCz9K7Uk3X0phjvkj_Yo0STn';
        this.init();
    }

    async init() {
        await this.loadPayPal();
        this.setupPurchaseButtons();
    }

    async loadPayPal() {
        if (window.paypal) return;
        
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=USD`;
            script.onload = resolve;
            script.onerror = () => {
                console.error('PayPal failed to load');
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    setupPurchaseButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.purchase-album')) {
                e.preventDefault();
                this.showPayPalButton('album', '14.99', 'Mac Wayne - Blind & Battered Album');
            }
            if (e.target.matches('.purchase-streaming')) {
                e.preventDefault();
                this.showPayPalButton('streaming', '5.00', 'Mac Wayne - Streaming Access');
            }
            if (e.target.matches('.purchase-track')) {
                e.preventDefault();
                this.showPayPalButton('track', '1.50', 'Mac Wayne - Individual Track');
            }
        });
    }

    showPayPalButton(type, price, description) {
        // Create modal with PayPal button
        const modal = document.createElement('div');
        modal.className = 'paypal-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Complete Purchase</h3>
                <p><strong>${description}</strong></p>
                <p>Price: $${price} USD</p>
                <div id="paypal-button-${type}"></div>
                <button class="cancel-btn" onclick="this.closest('.paypal-modal').remove()">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);

        if (!window.paypal) {
            modal.querySelector('.modal-content').innerHTML = `
                <h3>Payment Error</h3>
                <p>PayPal is not available. Please refresh the page and try again.</p>
                <button onclick="this.closest('.paypal-modal').remove()">Close</button>
            `;
            return;
        }

        // Render actual PayPal button
        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price,
                            currency_code: 'USD'
                        },
                        description: description
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    modal.remove();
                    this.handleSuccessfulPayment(type, details, price);
                    this.sendDownloadEmail(details, type, price);
                });
            },
            onError: (err) => {
                console.error('PayPal Error:', err);
                alert('Payment failed. Please try again.');
                modal.remove();
            },
            onCancel: () => {
                modal.remove();
            }
        }).render(`#paypal-button-${type}`);
    }

    handleSuccessfulPayment(type, details, price) {
        // Save purchase to localStorage
        const purchase = {
            id: details.id,
            type: type,
            price: price,
            date: new Date().toISOString(),
            status: 'completed'
        };

        // Store purchase
        if (type === 'album') {
            localStorage.setItem('mac-wayne-album-purchased', 'true');
        } else if (type === 'streaming') {
            localStorage.setItem('mac-wayne-streaming-access', 'true');
        }

        // Show success message
        alert(`✅ Payment Successful!\n\nTransaction ID: ${details.id}\nAmount: $${price}\n\nThank you for supporting Mac Wayne!`);

        // Reload page to update UI
        location.reload();
    }

    async sendDownloadEmail(details, type, price) {
        const customerEmail = details.payer.email_address;
        const transactionId = details.id;
        const customerName = details.payer.name.given_name + ' ' + details.payer.name.surname;
        
        // Email to customer
        const customerEmailData = {
            email: customerEmail,
            subject: `Mac Wayne Track Purchase - Download Coming Soon`,
            message: `Hi ${customerName},\n\nThank you for your Mac Wayne track purchase!\n\nTransaction ID: ${transactionId}\nAmount: $${price}\n\nYour download link will be sent within 24 hours.\n\nSupport: macwayneofficial.com\n\n- Mac Wayne Team`
        };

        // Email to you (notification)
        const adminEmailData = {
            email: 'admin@macwayneofficial.com',
            subject: `NEW PURCHASE ALERT - ${customerName}`,
            message: `NEW TRACK PURCHASE:\n\nCustomer: ${customerName}\nEmail: ${customerEmail}\nTransaction ID: ${transactionId}\nAmount: $${price}\nType: ${type}\nDate: ${new Date().toLocaleString()}\n\nSend download link manually to customer.`
        };

        try {
            // Send customer email
            await fetch('https://formspree.io/f/mldlyaln', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerEmailData)
            });
            
            // Send admin notification
            await fetch('https://formspree.io/f/mldlyaln', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adminEmailData)
            });
            
            console.log('Purchase notifications sent');
        } catch (error) {
            console.error('Email delivery failed:', error);
        }
    }
}

// Add modal styles
const style = document.createElement('style');
style.textContent = `
.paypal-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}
.paypal-modal .modal-content {
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 10px;
    border: 2px solid #cc0000;
    max-width: 400px;
    width: 90%;
    text-align: center;
}
.paypal-modal h3 {
    color: #cc0000;
    margin-bottom: 1rem;
}
.paypal-modal p {
    color: #fff;
    margin-bottom: 1rem;
}
.cancel-btn {
    background: #666;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
}
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.realPayPalPurchase = new RealPayPalPurchase();
});