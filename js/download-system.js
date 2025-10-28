// Secure Download System
class DownloadSystem {
    constructor() {
        this.baseUrl = 'https://macwayneofficial.com/downloads/';
    }

    generateDownloadLink(transactionId, trackId) {
        // Create secure download URL
        const downloadToken = btoa(`${transactionId}-${trackId}-${Date.now()}`);
        return `${this.baseUrl}?token=${downloadToken}&track=${trackId}`;
    }

    async sendDownloadEmail(details, trackId, trackName) {
        const downloadLink = this.generateDownloadLink(details.id, trackId);
        
        const emailData = {
            email: details.payer.email_address,
            subject: `Mac Wayne - ${trackName} Download Ready`,
            message: `Thank you for purchasing "${trackName}"!

Transaction ID: ${details.id}

DOWNLOAD YOUR TRACK:
${downloadLink}

This link expires in 30 days.

Support: macwayneofficial.com`
        };

        await fetch('https://formspree.io/f/mldlyaln', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });
    }
}

window.downloadSystem = new DownloadSystem();