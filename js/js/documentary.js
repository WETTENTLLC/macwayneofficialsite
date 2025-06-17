// Mac Wayne Documentary Page - Accessible JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize video modal functionality
    initializeVideoModal();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize accessible video controls
    initializeVideoControls();
    
    // Initialize keyboard navigation for clips
    initializeClipNavigation();
});

function initializeVideoModal() {
    const modal = document.getElementById('videoModal');
    const playButtons = document.querySelectorAll('.play-btn, .watch-trailer-btn');
    const closeButton = modal?.querySelector('.modal-close');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const iframe = modal?.querySelector('iframe');
    
    if (!modal) return;
    
    // Open modal
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const videoId = this.getAttribute('data-video');
            let videoSrc = '';
            
            // Determine video source based on button type
            if (this.classList.contains('watch-trailer-btn')) {
                videoSrc = 'https://www.youtube.com/embed/CkDPQkDTxC8?autoplay=1';
            } else if (videoId) {
                videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
            
            if (videoSrc && iframe) {
                iframe.src = videoSrc;
            }
            
            // Show modal with accessibility
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus management
            setTimeout(() => {
                closeButton?.focus();
            }, 100);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Announce to screen readers
            announceToScreenReader('Video modal opened');
        });
    });
    
    // Close modal function
    function closeModal() {
        if (iframe) {
            iframe.src = '';
        }
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus to trigger button
        const lastFocusedButton = document.activeElement;
        if (lastFocusedButton && lastFocusedButton.classList.contains('play-btn')) {
            lastFocusedButton.focus();
        }
        
        announceToScreenReader('Video modal closed');
    }
    
    // Close modal events
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block' && e.key === 'Escape') {
            closeModal();
        }
        
        // Trap focus within modal
        if (modal.style.display === 'block' && e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('aria-hidden', isExpanded);
            
            if (!isExpanded) {
                // Focus first menu item when opening
                const firstMenuItem = navMenu.querySelector('a');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            }
        });
        
        // Close menu with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                mobileMenuToggle.focus();
            }
        });
    }
}

function initializeVideoControls() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        // Add play/pause control for hero video
        heroVideo.addEventListener('click', function() {
            if (this.paused) {
                this.play();
                announceToScreenReader('Background video playing');
            } else {
                this.pause();
                announceToScreenReader('Background video paused');
            }
        });
        
        // Keyboard control for hero video
        heroVideo.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make video focusable
        heroVideo.setAttribute('tabindex', '0');
        heroVideo.setAttribute('aria-label', 'Background video - Press Enter to play or pause');
    }
}

function initializeClipNavigation() {
    const clipsGrid = document.querySelector('.clips-grid');
    
    if (clipsGrid) {
        clipsGrid.addEventListener('keydown', function(e) {
            const clipCards = clipsGrid.querySelectorAll('.clip-card');
            const currentIndex = Array.from(clipCards).indexOf(document.activeElement);
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % clipCards.length;
                    clipCards[nextIndex].focus();
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + clipCards.length) % clipCards.length;
                    clipCards[prevIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    clipCards[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    clipCards[clipCards.length - 1].focus();
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    const playBtn = document.activeElement.querySelector('.play-btn');
                    if (playBtn) {
                        playBtn.click();
                    }
                    break;
            }
        });
        
        // Make clip cards focusable
        const clipCards = clipsGrid.querySelectorAll('.clip-card');
        clipCards.forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            // Add focus styles
            card.addEventListener('focus', function() {
                this.style.outline = '3px solid #cc0000';
                this.style.outlineOffset = '2px';
            });
            
            card.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
}

// Screen reader announcement function
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

// Add enhanced styles for documentary page
const documentaryStyles = document.createElement('style');
documentaryStyles.textContent = `
    .clip-card:focus {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(204, 0, 0, 0.3);
        background: rgba(204, 0, 0, 0.1);
    }
    
    .hero-video:focus {
        outline: 3px solid #cc0000;
        outline-offset: 2px;
    }
    
    .watch-option:focus-within {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(204, 0, 0, 0.3);
    }
    
    .review-card {
        border: 1px solid transparent;
        transition: all 0.3s ease;
    }
    
    .review-card:focus-within {
        border-color: #cc0000;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(204, 0, 0, 0.2);
    }
`;
document.head.appendChild(documentaryStyles);