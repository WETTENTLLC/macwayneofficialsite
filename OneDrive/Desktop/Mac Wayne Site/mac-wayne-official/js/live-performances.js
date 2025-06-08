// Live Performances Page Functionality
class LivePerformances {
    constructor() {
        this.youtubeAPIReady = false;
        this.players = new Map();
        this.currentFilter = 'all';
        
        this.init();
        this.loadYouTubeAPI();
    }
    
    init() {
        this.bindEvents();
        this.initializeBookingForm();
        this.initializePaymentModal();
    }
    
    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
        
        // Video play buttons
        document.querySelectorAll('.play-overlay').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleVideoPlay(e));
        });
        
        // Purchase buttons
        document.querySelectorAll('.purchase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePurchase(e));
        });
        
        // Book private performance
        document.querySelectorAll('.book-private-btn').forEach(btn => {
            btn.addEventListener('click', () => this.scrollToBooking());
        });
        
        // Load more button
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePerformances());
        }
        
        // Share button
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => this.sharePerformance());
        });
    }
    
    loadYouTubeAPI() {
        // Load YouTube IFrame API
        if (!window.YT) {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            document.head.appendChild(script);
            
            window.onYouTubeIframeAPIReady = () => {
                this.youtubeAPIReady = true;
                console.log('YouTube API ready');
            };
        } else {
            this.youtubeAPIReady = true;
        }
    }
    
    handleFilter(e) {
        const filterBtn = e.target;
        const filter = filterBtn.dataset.filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        
        // Filter performances
        this.filterPerformances(filter);
        this.currentFilter = filter;
    }
    
    filterPerformances(filter) {
        const cards = document.querySelectorAll('.performance-card');
        
        cards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    handleVideoPlay(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const videoContainer = button.closest('.youtube-embed');
        const videoId = videoContainer.dataset.videoId;
        
        // Check if it's premium content
        const card = button.closest('.performance-card');
        if (card && card.classList.contains('premium')) {
            this.showPremiumMessage(card);
            return;
        }
        
        if (videoId && videoId !== 'premium-content' && videoId !== 'premium-content-2') {
            this.playYouTubeVideo(videoContainer, videoId);
        }
    }
    
    playYouTubeVideo(container, videoId) {
        if (!this.youtubeAPIReady) {
            console.log('YouTube API not ready');
            // Fallback: open in new tab
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            return;
        }
        
        const playerId = `player-${videoId}-${Date.now()}`;
        container.innerHTML = `<div id="${playerId}"></div>`;
        
        const player = new YT.Player(playerId, {
            width: '100%',
            height: container.offsetHeight || 400,
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                rel: 0,
                modestbranding: 1
            },
            events: {
                onReady: (event) => {
                    event.target.playVideo();
                }
            }
        });
        
        this.players.set(playerId, player);
    }
    
    showPremiumMessage(card) {
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.premium-price').textContent;
        
        const message = `
            <div class="premium-message">
                <div class="premium-icon">
                    <i class="fas fa-crown"></i>
                </div>
                <h3>Premium Content</h3>
                <p>"${title}" is exclusive premium content.</p>
                <p class="price">Purchase for ${price}</p>
                <div class="premium-actions">
                    <button class="btn btn-primary purchase-btn" data-performance="${card.querySelector('.purchase-btn').dataset.performance}">
                        <i class="fas fa-shopping-cart"></i>
                        Purchase Now
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.premium-message').remove()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        // Remove existing message
        const existing = document.querySelector('.premium-message');
        if (existing) existing.remove();
        
        // Add message to page
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = message;
        messageDiv.className = 'premium-message-overlay';
        document.body.appendChild(messageDiv);
        
        // Bind purchase button
        messageDiv.querySelector('.purchase-btn').addEventListener('click', (e) => {
            this.handlePurchase(e);
            messageDiv.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    handlePurchase(e) {
        const button = e.currentTarget;
        const performance = button.dataset.performance;
        
        const performanceData = {
            'behind-bars': {
                title: 'Unreleased: Behind Bars',
                price: '$4.99'
            },
            'prison-stories': {
                title: 'Prison Stories - Full Session',
                price: '$7.99'
            }
        };
        
        const data = performanceData[performance];
        if (data) {
            this.openPaymentModal(data.title, data.price, performance);
        }
    }
    
    openPaymentModal(title, price, performanceId) {
        const modal = document.getElementById('payment-modal');
        const titleElement = document.getElementById('payment-title');
        const priceElement = document.getElementById('payment-price');
        
        titleElement.textContent = title;
        priceElement.textContent = price;
        modal.dataset.performanceId = performanceId;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    initializePaymentModal() {
        const modal = document.getElementById('payment-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const form = document.getElementById('payment-form');
        
        // Close modal
        closeBtn.addEventListener('click', () => this.closePaymentModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closePaymentModal();
        });
        
        // Form submission
        form.addEventListener('submit', (e) => this.handlePayment(e));
        
        // Card number formatting
        const cardNumberInput = document.getElementById('card-number');
        cardNumberInput.addEventListener('input', this.formatCardNumber);
        
        // Expiry formatting
        const expiryInput = document.getElementById('card-expiry');
        expiryInput.addEventListener('input', this.formatExpiry);
        
        // CVC validation
        const cvcInput = document.getElementById('card-cvc');
        cvcInput.addEventListener('input', this.formatCVC);
    }
    
    closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    formatCardNumber(e) {
        const value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }
    
    formatExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }
    
    formatCVC(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    async handlePayment(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const modal = document.getElementById('payment-modal');
        const performanceId = modal.dataset.performanceId;
        
        // Show loading
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Store purchase in localStorage (replace with real API)
            const purchases = JSON.parse(localStorage.getItem('live-purchases') || '[]');
            purchases.push({
                id: performanceId,
                date: new Date().toISOString(),
                title: document.getElementById('payment-title').textContent,
                price: document.getElementById('payment-price').textContent
            });
            localStorage.setItem('live-purchases', JSON.stringify(purchases));
            
            // Show success
            this.showPaymentSuccess();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Payment error:', error);
            this.showPaymentError();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showPaymentSuccess() {
        this.closePaymentModal();
        this.showNotification('Payment successful! You now have access to this exclusive performance.', 'success');
        
        // Unlock the performance
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    
    showPaymentError() {
        this.showNotification('Payment failed. Please check your card details and try again.', 'error');
    }
    
    initializeBookingForm() {
        const form = document.getElementById('booking-form');
        const performanceSelect = document.getElementById('performance-type');
        const priceEstimate = document.getElementById('price-estimate');
        
        // Performance type change
        performanceSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.selectedOptions[0];
            const price = selectedOption.dataset.price;
            
            if (price) {
                priceEstimate.textContent = `$${parseInt(price).toLocaleString()}`;
            } else {
                priceEstimate.textContent = 'Select performance type';
            }
        });
        
        // Form submission
        form.addEventListener('submit', (e) => this.handleBookingSubmission(e));
        
        // Set minimum date to today
        const dateInput = document.getElementById('event-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    async handleBookingSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        
        // Show loading
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Store booking request (replace with real API)
            const bookings = JSON.parse(localStorage.getItem('booking-requests') || '[]');
            const bookingData = Object.fromEntries(formData);
            bookingData.id = Date.now().toString();
            bookingData.status = 'pending';
            bookingData.submittedAt = new Date().toISOString();
            
            bookings.push(bookingData);
            localStorage.setItem('booking-requests', JSON.stringify(bookings));
            
            this.showBookingSuccess();
            form.reset();
            document.getElementById('price-estimate').textContent = 'Select performance type';
            
        } catch (error) {
            console.error('Booking error:', error);
            this.showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showBookingSuccess() {
        this.showNotification('Booking request sent successfully! We\'ll contact you within 24 hours with a detailed quote.', 'success');
    }
    
    scrollToBooking() {
        const bookingSection = document.querySelector('.booking-section');
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    loadMorePerformances() {
        const button = document.querySelector('.load-more-btn');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Simulate loading more content
        setTimeout(() => {
            button.innerHTML = originalText;
            this.showNotification('All performances loaded!', 'info');
        }, 1500);
    }
    
    sharePerformance() {
        if (navigator.share) {
            navigator.share({
                title: 'Mac Wayne Live Performances',
                text: 'Check out Mac Wayne\'s exclusive live performances!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            });
        }
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LivePerformances();
});

// Add notification and premium message styles
const additionalStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    animation: slideInRight 0.3s ease-out;
}

.notification-content {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--primary-color);
    border-radius: 8px;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}

.notification-success .notification-content {
    border-color: #4ade80;
    color: #4ade80;
}

.notification-error .notification-content {
    border-color: #ef4444;
    color: #ef4444;
}

.notification-info .notification-content {
    border-color: #3b82f6;
    color: #3b82f6;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 1rem;
}

.premium-message-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
}

.premium-message {
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.95));
    border: 2px solid var(--primary-color);
    border-radius: 15px;
    padding: 2rem;
    text-align: center;
    max-width: 400px;
    margin: 2rem;
}

.premium-message .premium-icon {
    font-size: 3rem;
    color: #ffd700;
    margin-bottom: 1rem;
}

.premium-message h3 {
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.premium-message .price {
    font-size: 1.5rem;
    color: var(--primary-color);
    font-weight: bold;
    margin: 1rem 0;
}

.premium-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
