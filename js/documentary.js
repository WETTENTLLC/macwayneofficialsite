// Documentary page functionality - video player, modals, streaming options
class DocumentaryManager {
    constructor() {
        this.currentVideo = null;
        this.videoModal = document.getElementById('videoModal');
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.setupVideoObservers();
    }

    bindEventListeners() {
        // Video play buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.play-btn') || e.target.closest('.play-btn')) {
                e.preventDefault();
                const button = e.target.closest('.play-btn') || e.target;
                const videoId = button.dataset.video || button.closest('[data-video]')?.dataset.video;
                if (videoId) {
                    this.playVideo(videoId);
                }
            }
        });

        // Trailer and full documentary buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.watch-trailer-btn')) {
                this.playVideo('documentary-trailer');
            } else if (e.target.matches('.watch-full-btn')) {
                this.playVideo('documentary-full');
            }
        });

        // Modal close
        if (this.videoModal) {
            this.videoModal.addEventListener('click', (e) => {
                if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
                    this.closeVideoModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoModal?.classList.contains('open')) {
                this.closeVideoModal();
            }
        });

        // Watch options
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn') && e.target.closest('.watch-option')) {
                const option = e.target.closest('.watch-option');
                const optionType = this.getWatchOptionType(option);
                this.handleWatchOption(optionType, e.target);
            }
        });

        // Clip cards hover effects
        this.setupClipHoverEffects();
    }

    playVideo(videoId) {
        const videoUrl = this.getVideoUrl(videoId);
        if (!videoUrl) {
            console.warn(`Video URL not found for ID: ${videoId}`);
            return;
        }

        if (this.videoModal) {
            const iframe = this.videoModal.querySelector('iframe');
            if (iframe) {
                iframe.src = videoUrl;
                this.videoModal.classList.add('open');
                document.body.classList.add('modal-open');
                this.currentVideo = videoId;
            }
        }
    }

    closeVideoModal() {
        if (this.videoModal) {
            const iframe = this.videoModal.querySelector('iframe');
            if (iframe) {
                iframe.src = '';
            }
            this.videoModal.classList.remove('open');
            document.body.classList.remove('modal-open');
            this.currentVideo = null;
        }
    }

    getVideoUrl(videoId) {
        // Map video IDs to actual URLs
        // In production, these would be real video URLs
        const videoUrls = {
            'documentary-trailer': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
            'documentary-full': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
            'clip-1': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
            'clip-2': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
            'clip-3': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
            'clip-4': 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
        };

        return videoUrls[videoId];
    }

    setupClipHoverEffects() {
        const clipCards = document.querySelectorAll('.clip-card');
        
        clipCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovered');
                const thumbnail = card.querySelector('.clip-thumbnail img');
                if (thumbnail) {
                    // Add subtle zoom effect
                    thumbnail.style.transform = 'scale(1.05)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('hovered');
                const thumbnail = card.querySelector('.clip-thumbnail img');
                if (thumbnail) {
                    thumbnail.style.transform = 'scale(1)';
                }
            });
        });
    }

    setupVideoObservers() {
        // Intersection Observer for video elements
        const videoElements = document.querySelectorAll('video');
        
        if (videoElements.length > 0) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play().catch(() => {
                            // Autoplay failed, which is expected in many browsers
                        });
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.5 });

            videoElements.forEach(video => videoObserver.observe(video));
        }
    }

    getWatchOptionType(optionElement) {
        const titleElement = optionElement.querySelector('h3');
        if (titleElement) {
            const title = titleElement.textContent.toLowerCase();
            if (title.includes('stream')) return 'stream';
            if (title.includes('download')) return 'download';
            if (title.includes('dvd') || title.includes('physical')) return 'physical';
        }
        return 'unknown';
    }

    handleWatchOption(optionType, button) {
        const buttonText = button.textContent.toLowerCase();
        
        switch (optionType) {
            case 'stream':
                if (buttonText.includes('stream')) {
                    this.handleStreamOption();
                }
                break;
            case 'download':
                if (buttonText.includes('buy')) {
                    this.handleDownloadOption();
                }
                break;
            case 'physical':
                if (buttonText.includes('pre-order')) {
                    this.handlePhysicalOption();
                }
                break;
        }
    }

    handleStreamOption() {
        // In production, this would integrate with a streaming service
        this.showNotification('Redirecting to streaming platform...', 'info');
        setTimeout(() => {
            // Simulate redirect to streaming service
            alert('This would redirect to a streaming platform like Vimeo On Demand or custom player.');
        }, 1500);
    }

    handleDownloadOption() {
        // In production, this would integrate with a digital store
        this.showNotification('Redirecting to digital store...', 'info');
        setTimeout(() => {
            // Simulate redirect to digital store
            alert('This would redirect to a digital store for download purchase.');
        }, 1500);
    }

    handlePhysicalOption() {
        // In production, this would integrate with an e-commerce platform
        this.showNotification('Redirecting to store...', 'info');
        setTimeout(() => {
            // Simulate redirect to shop
            window.location.href = 'shop.html';
        }, 1500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `documentary-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Method to handle video analytics (for production)
    trackVideoPlay(videoId) {
        // This would send analytics data to track video engagement
        console.log(`Video played: ${videoId}`);
        
        // Example analytics call:
        // analytics.track('video_play', { video_id: videoId, timestamp: Date.now() });
    }

    // Method to handle purchase tracking (for production)
    trackPurchaseIntent(optionType) {
        // This would track user purchase intent for marketing analysis
        console.log(`Purchase intent: ${optionType}`);
        
        // Example analytics call:
        // analytics.track('purchase_intent', { option_type: optionType, timestamp: Date.now() });
    }
}

// Enhanced review animation
class ReviewAnimator {
    constructor() {
        this.setupReviewAnimations();
    }

    setupReviewAnimations() {
        const reviewCards = document.querySelectorAll('.review-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        this.animateStars(entry.target);
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });

        reviewCards.forEach(card => observer.observe(card));
    }

    animateStars(reviewCard) {
        const stars = reviewCard.querySelectorAll('.icon-star.filled');
        
        stars.forEach((star, index) => {
            setTimeout(() => {
                star.classList.add('star-animate');
            }, index * 100);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('documentary-page')) {
        new DocumentaryManager();
        new ReviewAnimator();
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DocumentaryManager, ReviewAnimator };
}
