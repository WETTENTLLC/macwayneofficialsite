/**
 * Mac Wayne Battered Coin (MWB) - JavaScript Functionality
 * Accessibility-first cryptocurrency platform
 */

class BatteredCoinApp {
    constructor() {
        this.currentPrice = 0.00;
        this.priceChange = 0.00;
        this.circulatingSupply = 25000000;
        this.totalSupply = 100000000;
        
        this.init();
    }

    init() {
        this.setupPriceSimulation();
        this.setupPurchaseForm();
        this.setupAnimations();
        this.setupAccessibility();
        this.startPriceTicker();
    }

    /**
     * Simulate real-time price updates for demonstration
     */
    setupPriceSimulation() {
        // Simulate initial price between $0.10 - $0.50
        this.currentPrice = (Math.random() * 0.40 + 0.10).toFixed(4);
        this.updatePriceDisplay();
    }

    /**
     * Start price ticker with simulated updates
     */
    startPriceTicker() {
        setInterval(() => {
            // Simulate small price fluctuations (±5%)
            const fluctuation = (Math.random() - 0.5) * 0.1;
            const newPrice = this.currentPrice * (1 + fluctuation);
            
            if (newPrice > 0) {
                const oldPrice = this.currentPrice;
                this.currentPrice = newPrice.toFixed(4);
                this.priceChange = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);
                this.updatePriceDisplay();
            }
        }, 5000); // Update every 5 seconds
    }

    /**
     * Update price display with accessibility announcements
     */
    updatePriceDisplay() {
        const priceElement = document.getElementById('mwb-price');
        const changeElement = document.getElementById('mwb-change');
        const marketCapElement = document.getElementById('market-cap');

        if (priceElement) {
            priceElement.textContent = `$${this.currentPrice}`;
        }

        if (changeElement) {
            const isPositive = this.priceChange >= 0;
            changeElement.textContent = `${isPositive ? '+' : ''}${this.priceChange}%`;
            changeElement.className = `ticker-change ${isPositive ? 'positive' : 'negative'}`;
        }

        if (marketCapElement) {
            const marketCap = (this.currentPrice * this.circulatingSupply).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            marketCapElement.textContent = marketCap;
        }

        // Update circulating supply display
        const supplyElement = document.getElementById('circulating-supply');
        if (supplyElement) {
            supplyElement.textContent = `${this.circulatingSupply.toLocaleString()} MWB`;
        }
    }

    /**
     * Setup purchase form functionality
     */
    setupPurchaseForm() {
        const form = document.querySelector('.coin-purchase-form');
        const amountInput = document.getElementById('purchase-amount');
        const quantityInput = document.getElementById('coin-quantity');

        if (amountInput && quantityInput) {
            // Calculate coin quantity in real-time
            amountInput.addEventListener('input', () => {
                const usdAmount = parseFloat(amountInput.value) || 0;
                const coinQuantity = (usdAmount / this.currentPrice).toFixed(2);
                quantityInput.value = `${coinQuantity} MWB`;
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePurchase(new FormData(form));
            });
        }
    }

    /**
     * Handle cryptocurrency purchase
     */
    async handlePurchase(formData) {
        const amount = formData.get('amount');
        const wallet = formData.get('wallet');
        const paymentMethod = formData.get('payment');

        // Accessibility announcement
        this.announceToScreenReader('Processing MWB coin purchase...');

        try {
            // Simulate purchase processing
            await this.simulatePurchaseProcess();
            
            // Calculate coins purchased
            const coinsPurchased = (amount / this.currentPrice).toFixed(2);
            
            // Show success message
            this.showPurchaseSuccess(coinsPurchased, amount, wallet, paymentMethod);
            
            // Accessibility announcement
            this.announceToScreenReader(`Purchase successful! You have received ${coinsPurchased} MWB coins.`);
            
        } catch (error) {
            this.showPurchaseError(error.message);
            this.announceToScreenReader('Purchase failed. Please try again.');
        }
    }

    /**
     * Simulate purchase processing with realistic delay
     */
    simulatePurchaseProcess() {
        return new Promise((resolve, reject) => {
            // Show loading state
            const submitButton = document.querySelector('.purchase-button');
            if (submitButton) {
                submitButton.textContent = 'Processing...';
                submitButton.disabled = true;
            }

            setTimeout(() => {
                // 90% success rate for demo
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Payment processing failed'));
                }
                
                // Reset button
                if (submitButton) {
                    submitButton.textContent = 'Purchase MWB Coins';
                    submitButton.disabled = false;
                }
            }, 2000);
        });
    }

    /**
     * Show purchase success notification
     */
    showPurchaseSuccess(coins, amount, wallet, paymentMethod) {
        const notification = this.createNotification(
            'success',
            'Purchase Successful!',
            `You have successfully purchased ${coins} MWB coins for $${amount} using ${paymentMethod}. Coins will be transferred to wallet ${wallet} within 10 minutes.`
        );
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Show purchase error notification
     */
    showPurchaseError(message) {
        const notification = this.createNotification(
            'error',
            'Purchase Failed',
            `Transaction could not be completed: ${message}. Please check your payment information and try again.`
        );
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Create accessible notification element
     */
    createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        notification.innerHTML = `
            <div class="notification-content">
                <h3 class="notification-title">${title}</h3>
                <p class="notification-message">${message}</p>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });

        return notification;
    }

    /**
     * Setup coin animations
     */
    setupAnimations() {
        const coins = document.querySelectorAll('.floating-coin');
        
        coins.forEach((coin, index) => {
            // Random floating animation
            coin.style.animationDelay = `${index * 0.5}s`;
            coin.style.animationDuration = `${3 + Math.random() * 2}s`;
        });

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.coin-animation');
            
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Keyboard navigation for custom elements
        this.setupKeyboardNavigation();
        
        // High contrast mode detection
        this.setupHighContrastMode();
        
        // Reduced motion preferences
        this.setupReducedMotion();
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        const interactiveElements = document.querySelectorAll('button, .cta-button, .community-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    /**
     * Setup high contrast mode
     */
    setupHighContrastMode() {
        // Check for high contrast preference
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // Listen for changes
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    }

    /**
     * Setup reduced motion preferences
     */
    setupReducedMotion() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }

        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Download whitepaper functionality
     */
    downloadWhitepaper() {
        // Simulate whitepaper download
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,'; // Would be actual PDF data
        link.download = 'mac-wayne-battered-coin-whitepaper.pdf';
        link.click();
        
        this.announceToScreenReader('Whitepaper download started');
    }
}

// Utility functions for scroll behavior
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Focus management for accessibility
        const heading = section.querySelector('h2, h3');
        if (heading) {
            heading.focus();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new BatteredCoinApp();
    
    // Setup download button
    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            app.downloadWhitepaper();
        });
    }
    
    // Setup navigation toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    
    // Setup smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId) {
                e.preventDefault();
                scrollToSection(sectionId);
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }
        });
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BatteredCoinApp;
}
