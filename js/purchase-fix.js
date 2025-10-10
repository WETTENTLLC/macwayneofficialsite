// Emergency Purchase Fix - Simple Working System
class PurchaseFix {
    constructor() {
        this.init();
    }

    init() {
        // Remove all existing purchase handlers
        document.querySelectorAll('.purchase-album, .purchase-streaming, .purchase-track').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        // Add simple working handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.purchase-album')) {
                this.handleAlbumPurchase();
            }
            if (e.target.matches('.purchase-streaming')) {
                this.handleStreamingPurchase();
            }
            if (e.target.matches('.purchase-track')) {
                this.handleTrackPurchase();
            }
        });
    }

    handleAlbumPurchase() {
        // Simulate successful purchase for now
        const confirmed = confirm('Purchase Mac Wayne Album for $14.99?\n\n(This is a test - no actual payment will be processed)');
        if (confirmed) {
            this.completeAlbumPurchase();
        }
    }

    handleStreamingPurchase() {
        const confirmed = confirm('Get streaming access for $5.00?\n\n(This is a test - no actual payment will be processed)');
        if (confirmed) {
            this.completeStreamingPurchase();
        }
    }

    handleTrackPurchase() {
        const confirmed = confirm('Purchase individual track for $1.50?\n\n(This is a test - no actual payment will be processed)');
        if (confirmed) {
            this.completeTrackPurchase();
        }
    }

    completeAlbumPurchase() {
        localStorage.setItem('mac-wayne-album-purchased', 'true');
        alert('✅ Album purchased successfully!\n\nYou now have:\n• Full streaming access\n• Download access to all tracks\n• Permanent ownership');
        
        // Update UI
        document.querySelectorAll('.purchase-album').forEach(btn => {
            btn.textContent = '✓ Purchased';
            btn.disabled = true;
            btn.style.background = '#28a745';
        });
        
        // Enable downloads
        document.querySelectorAll('.purchase-track').forEach(btn => {
            btn.textContent = 'Download';
            btn.onclick = () => this.downloadTrack();
        });
        
        location.reload();
    }

    completeStreamingPurchase() {
        localStorage.setItem('mac-wayne-streaming-access', 'true');
        alert('✅ Streaming access activated!\n\nYou now have:\n• Full track streaming\n• Unlimited plays\n• No downloads (upgrade to album for downloads)');
        
        // Update UI
        document.querySelectorAll('.purchase-streaming').forEach(btn => {
            btn.textContent = '✓ Streaming Active';
            btn.disabled = true;
            btn.style.background = '#28a745';
        });
        
        location.reload();
    }

    completeTrackPurchase() {
        alert('✅ Track purchased!\n\nYou can now download this track.');
    }

    downloadTrack() {
        alert('✅ Download started!\n\n(In production, this would download the actual MP3 file)');
    }
}

// Initialize immediately
document.addEventListener('DOMContentLoaded', () => {
    window.purchaseFix = new PurchaseFix();
});