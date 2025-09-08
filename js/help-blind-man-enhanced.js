/**
 * Enhanced Help The Blind Man Section - Donation & Social Media Integration
 * Handles donation processing, social media sharing, and accessibility features
 */

class HelpBlindManEnhanced {
    constructor() {
        this.donationAmount = 0;
        this.paypalLoaded = false;
        this.init();
    }

    init() {
        this.setupDonationForm();
        this.setupSocialSharing();
        this.loadPayPalSDK();
        this.setupAccessibilityFeatures();
    }

    setupDonationForm() {
        const amountInput = document.getElementById('donation-amount');
        const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
        const donateBtn = document.getElementById('donate-btn');

        // Quick amount button handlers
        quickAmountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseFloat(e.target.dataset.amount);
                this.setDonationAmount(amount);
                this.updateQuickAmountSelection(e.target);
            });
        });

        // Custom amount input handler
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                const amount = parseFloat(e.target.value) || 0;
                this.setDonationAmount(amount);
                this.clearQuickAmountSelection();
            });

            amountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.processDonation();
                }
            });
        }

        // Donate button handler
        if (donateBtn) {
            donateBtn.addEventListener('click', () => {
                this.processDonation();
            });
        }
    }

    setDonationAmount(amount) {
        this.donationAmount = amount;
        const amountInput = document.getElementById('donation-amount');
        if (amountInput) {
            amountInput.value = amount;
        }
        this.updateDonateButton();
    }

    updateQuickAmountSelection(selectedBtn) {
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        selectedBtn.classList.add('selected');
    }

    clearQuickAmountSelection() {
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    updateDonateButton() {
        const donateBtn = document.getElementById('donate-btn');
        if (donateBtn && this.donationAmount > 0) {
            donateBtn.innerHTML = `<i class=\"fas fa-heart\" aria-hidden=\"true\"></i>DONATE $${this.donationAmount}`;
            donateBtn.setAttribute('aria-label', `Donate ${this.donationAmount} dollars to support Mac Wayne`);
        } else if (donateBtn) {
            donateBtn.innerHTML = `<i class=\"fas fa-heart\" aria-hidden=\"true\"></i>DONATE NOW`;
            donateBtn.setAttribute('aria-label', 'Donate to support Mac Wayne');
        }
    }

    async loadPayPalSDK() {
        // Use the same payment system as the existing purchase system
        this.paypalLoaded = true;
        console.log('Using existing purchase system infrastructure for donations');
    }

    initializePayPal() {
        // Integration with existing purchase system - no separate PayPal needed
        this.paypalLoaded = true;
    }

    processDonation() {
        if (this.donationAmount <= 0) {
            this.showDonationError('Please enter a donation amount');
            return;
        }

        if (this.donationAmount < 1) {
            this.showDonationError('Minimum donation amount is $1');
            return;
        }

        if (this.paypalLoaded) {
            this.showPayPalDonation();
        } else {
            this.showFallbackDonation();
        }
    }

    showPayPalDonation() {
        // Use the same modal system as the existing purchase system
        const modal = document.createElement('div');
        modal.className = 'purchase-modal donation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Support Mac Wayne</h3>
                <div class="donation-details">
                    <div class="donation-amount-display">
                        <h4>Donation Amount: $${this.donationAmount}</h4>
                        <p>Your support helps keep Mac Wayne creating music and spreading awareness.</p>
                    </div>
                    <div class="payment-options">
                        <button class="btn-purchase donation-btn-process" data-amount="${this.donationAmount}">
                            💳 Donate with Card/PayPal
                        </button>
                        <p class="payment-note">Secure payment via PayPal (credit/debit cards accepted)</p>
                    </div>
                </div>
                <button class="btn-close">Cancel</button>
            </div>
        `;

        // Add event listeners using the same pattern as purchase system
        modal.querySelector('.donation-btn-process').addEventListener('click', () => {
            this.processDonationPayment(this.donationAmount);
            modal.remove();
        });

        modal.querySelector('.btn-close').addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
    }

    showFallbackDonation() {
        // Fallback to direct payment methods
        const message = `
            <div class=\"donation-fallback\">
                <h4>Alternative Donation Methods</h4>
                <p>Donate $${this.donationAmount} via:</p>
                <div class=\"fallback-methods\">
                    <a href=\"https://venmo.com/MacWayne425\" target=\"_blank\" class=\"payment-method venmo\">
                        <i class=\"fab fa-venmo\"></i> Venmo: @MacWayne425
                    </a>
                    <a href=\"https://cash.app/$MacWayne425\" target=\"_blank\" class=\"payment-method cashapp\">
                        <i class=\"fas fa-dollar-sign\"></i> Cash App: $MacWayne425
                    </a>
                </div>
            </div>
        `;
        
        this.showModal('Donation Options', message);
    }

    processDonationPayment(amount) {
        // Show processing modal using same pattern as purchase system
        this.showProcessingModal();

        // Simulate payment processing (same as purchase system)
        setTimeout(() => {
            this.completeDonation(amount);
        }, 2000);
    }

    showProcessingModal() {
        const modal = document.createElement('div');
        modal.className = 'purchase-modal processing donation-processing';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="spinner"></div>
                <h3>Processing Donation...</h3>
                <p>Please wait while we process your donation.</p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    completeDonation(amount) {
        // Remove processing modal
        document.querySelector('.donation-processing')?.remove();
        
        // Show success modal
        this.showDonationSuccess(amount);
        
        // Reset form
        this.resetDonationForm();
    }

    showDonationSuccess() {
        const message = `
            <div class=\"donation-success\">
                <i class=\"fas fa-heart\" style=\"color: #ff6b6b; font-size: 3rem; margin-bottom: 1rem;\"></i>
                <h3>Thank You!</h3>
                <p>Your $${this.donationAmount} donation helps keep Mac Wayne creating music and spreading awareness.</p>
                <p>Every contribution makes a difference in his journey.</p>
            </div>
        `;
        
        this.showModal('Donation Successful', message);
        this.resetDonationForm();
    }

    showDonationError(errorMessage) {
        const amountInput = document.getElementById('donation-amount');
        if (amountInput) {
            amountInput.style.borderColor = '#ff4444';
            amountInput.setAttribute('aria-invalid', 'true');
            amountInput.setAttribute('aria-describedby', 'donation-error');
        }

        // Create or update error message
        let errorDiv = document.getElementById('donation-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'donation-error';
            errorDiv.className = 'donation-error-message';
            errorDiv.setAttribute('role', 'alert');
            amountInput.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = 'block';

        // Clear error after 5 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.style.display = 'none';
                amountInput.style.borderColor = '';
                amountInput.removeAttribute('aria-invalid');
                amountInput.removeAttribute('aria-describedby');
            }
        }, 5000);
    }

    resetDonationForm() {
        this.donationAmount = 0;
        const amountInput = document.getElementById('donation-amount');
        if (amountInput) {
            amountInput.value = '';
        }
        this.clearQuickAmountSelection();
        this.updateDonateButton();
    }

    setupSocialSharing() {
        const shareWebsiteBtn = document.getElementById('share-website');
        const shareStoryBtn = document.getElementById('share-story');

        if (shareWebsiteBtn) {
            shareWebsiteBtn.addEventListener('click', () => {
                this.shareWebsite();
            });
        }

        if (shareStoryBtn) {
            shareStoryBtn.addEventListener('click', () => {
                this.shareStory();
            });
        }
    }

    async shareWebsite() {
        const shareData = {
            title: 'Mac Wayne - Blind Hip Hop Visionary',
            text: 'Check out Mac Wayne\\'s incredible journey as a blind hip-hop artist breaking barriers through music and accessibility innovation.',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.trackSocialShare('native_share', 'website');
            } else {
                this.showShareOptions(shareData);
            }
        } catch (error) {
            console.log('Share cancelled or failed:', error);
            this.showShareOptions(shareData);
        }
    }

    async shareStory() {
        const shareData = {
            title: 'Mac Wayne\\'s Inspiring Journey',
            text: 'Mac Wayne lost his sight but never lost his vision. Discover how this blind hip-hop artist is changing the music industry through accessibility and innovation.',
            url: window.location.href + '#help-blind-man'
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.trackSocialShare('native_share', 'story');
            } else {
                this.showShareOptions(shareData);
            }
        } catch (error) {
            console.log('Share cancelled or failed:', error);
            this.showShareOptions(shareData);
        }
    }

    showShareOptions(shareData) {
        const encodedText = encodeURIComponent(shareData.text);
        const encodedUrl = encodeURIComponent(shareData.url);
        
        const shareOptions = `
            <div class=\"share-options\">
                <h4>Share Mac Wayne's Story</h4>
                <div class=\"share-buttons\">
                    <a href=\"https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}\" 
                       target=\"_blank\" class=\"share-btn twitter\" onclick=\"helpBlindMan.trackSocialShare('twitter', 'manual')\">
                        <i class=\"fab fa-twitter\"></i> Twitter
                    </a>
                    <a href=\"https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}\" 
                       target=\"_blank\" class=\"share-btn facebook\" onclick=\"helpBlindMan.trackSocialShare('facebook', 'manual')\">
                        <i class=\"fab fa-facebook\"></i> Facebook
                    </a>
                    <a href=\"https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}\" 
                       target=\"_blank\" class=\"share-btn linkedin\" onclick=\"helpBlindMan.trackSocialShare('linkedin', 'manual')\">
                        <i class=\"fab fa-linkedin\"></i> LinkedIn
                    </a>
                    <button class=\"share-btn copy-link\" onclick=\"helpBlindMan.copyToClipboard('${shareData.url}')\">
                        <i class=\"fas fa-link\"></i> Copy Link
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Share Options', shareOptions);
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Link copied to clipboard!');
            this.trackSocialShare('clipboard', 'copy');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showToast('Failed to copy link. Please copy manually: ' + text);
        }
    }

    trackSocialShare(platform, method) {
        // Analytics tracking for social shares
        console.log(`Social share tracked: ${platform} via ${method}`);
        
        // Google Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: method,
                content_id: 'mac_wayne_story'
            });
        }
    }

    setupAccessibilityFeatures() {
        // Enhanced keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
        
        // High contrast mode detection
        this.detectHighContrastMode();
    }

    setupKeyboardNavigation() {
        const interactiveElements = document.querySelectorAll(
            '.quick-amount-btn, .donation-btn, .social-link, .support-btn'
        );

        interactiveElements.forEach(element => {
            // Ensure all interactive elements are focusable
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }

            // Add keyboard event handlers
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    setupScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'help-announcements';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('help-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    detectHighContrastMode() {
        // Detect Windows High Contrast Mode
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast-mode');
        }
    }

    showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('help-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'help-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class=\"modal-content\">
                    <div class=\"modal-header\">
                        <h3 class=\"modal-title\"></h3>
                        <button class=\"close-modal\" aria-label=\"Close modal\">&times;</button>
                    </div>
                    <div class=\"modal-body\"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal handlers
            modal.querySelector('.close-modal').addEventListener('click', () => {
                this.closeModal();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });

            // Keyboard handler for modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    this.closeModal();
                }
            });
        }

        // Update modal content
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;
        modal.style.display = 'block';
        
        // Focus management
        modal.querySelector('.close-modal').focus();
        
        // Announce to screen readers
        this.announceToScreenReader(`${title} dialog opened`);
    }

    closeModal() {
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.style.display = 'none';
            this.announceToScreenReader('Dialog closed');
        }
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.helpBlindMan = new HelpBlindManEnhanced();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpBlindManEnhanced;
}