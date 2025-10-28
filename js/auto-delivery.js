// Auto-delivery system for purchased tracks
class AutoDelivery {
    constructor() {
        this.setupPayPalHooks();
    }

    setupPayPalHooks() {
        // Override PayPal success handler
        const originalPayPal = window.paypal;
        if (originalPayPal) {
            this.enhancePayPalButtons();
        }
    }

    enhancePayPalButtons() {
        // Add to existing PayPal success handler
        document.addEventListener('paypal-success', (event) => {
            const { details, type, trackName } = event.detail;
            this.sendDownloadLink(details.payer.email_address, trackName, details.id);
        });
    }

    async sendDownloadLink(email, trackName, transactionId) {
        // Send email with download link
        const emailData = {
            to: email,
            subject: `Your Mac Wayne Track Purchase - ${trackName}`,
            body: `
Thank you for purchasing "${trackName}" by Mac Wayne!

Your transaction ID: ${transactionId}

Download your track here: https://macwayneofficial.com/download/${transactionId}

This link will be active for 30 days.

Support Mac Wayne: https://macwayneofficial.com

- Mac Wayne Team
            `
        };

        // Use Formspree or similar service
        try {
            await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData)
            });
            
            alert(`✅ Download link sent to ${email}!`);
        } catch (error) {
            console.error('Email delivery failed:', error);
            this.showManualDownload(trackName, transactionId);
        }
    }

    showManualDownload(trackName, transactionId) {
        alert(`✅ Purchase Complete!\n\nTrack: ${trackName}\nTransaction: ${transactionId}\n\nDownload link will be emailed shortly.\n\nIf you don't receive it, contact support with your transaction ID.`);
    }
}

// Initialize
new AutoDelivery();