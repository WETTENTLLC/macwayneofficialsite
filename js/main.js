// Main JavaScript functionality for Mac Wayne Official website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeScrollAnimations();
    initializeNavigation();
    initializeNewsletterForm();
    initializeVideoPlayer();
    initializeLazyLoading();
    initializeAudioPlayers();
});

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all scroll animation elements
    document.querySelectorAll('.scroll-fade, .scroll-slide-left, .scroll-slide-right').forEach(el => {
        observer.observe(el);
    });
}

// Navigation functionality
function initializeNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
}

// Newsletter form handling
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Basic email validation
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual newsletter service)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showNotification('Successfully subscribed to newsletter!', 'success');
        form.reset();
    } catch (error) {
        showNotification('Subscription failed. Please try again.', 'error');
        console.error('Newsletter subscription error:', error);
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Video player functionality
function initializeVideoPlayer() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            // Add loading state
            iframe.addEventListener('load', () => {
                container.classList.add('loaded');
            });
        }
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Audio player initialization
function initializeAudioPlayers() {
    console.log('Initializing simple audio players with enhanced error handling...');
    
    // First check if audio files exist and are valid
    const testAudio = new Audio();
    testAudio.src = 'audio/sample-preview.mp3';
    
    testAudio.addEventListener('error', function(e) {
        console.error('Audio test failed:', this.error);
        // Try to use fallback audio from CDN
        useFallbackAudio();
    });
    
    // Initialize featured player
    const featuredPlayer = document.querySelector('.featured-player .audio-player');
    if (featuredPlayer) {
        console.log('Found featured player, initializing with SimpleAudioPlayer...');
        try {
            window.featuredAudioPlayer = new SimpleAudioPlayer(featuredPlayer);
        } catch (error) {
            console.error('Error initializing featured player:', error);
            showAudioError(featuredPlayer, error.message);
        }
    }
    
    // Initialize any other audio players on the page
    const audioPlayers = document.querySelectorAll('.audio-player:not(.featured-player .audio-player)');
    audioPlayers.forEach((player, index) => {
        console.log(`Initializing simple audio player ${index + 1}...`);
        try {
            new SimpleAudioPlayer(player);
        } catch (error) {
            console.error(`Error initializing player ${index + 1}:`, error);
            showAudioError(player, error.message);
        }
    });
    
    // Add click handlers for mini play buttons in track list
    const miniPlayBtns = document.querySelectorAll('.mini-play-btn');
    miniPlayBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const trackItem = this.closest('.track-item');
            if (trackItem && window.featuredAudioPlayer) {
                const trackSrc = trackItem.dataset.src;
                const trackTitle = trackItem.dataset.title;
                const trackDuration = trackItem.dataset.duration;
                
                console.log('Loading new track:', { trackSrc, trackTitle, trackDuration });
                
                try {
                    // Update the featured player with this track
                    window.featuredAudioPlayer.loadNewTrack({
                        src: trackSrc,
                        title: trackTitle,
                        duration: trackDuration
                    });
                } catch (error) {
                    console.error('Error loading track:', error);
                    showAudioError(document.querySelector('.featured-player .audio-player'), 'Failed to load track');
                }
            }
        });
    });
      console.log('Simple audio players initialization complete');
}

// Function to show audio error message
function showAudioError(container, errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'audio-error-message';
    errorDiv.innerHTML = `
        <div class="error-icon">
            <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="error-text">
            <p>Audio playback error</p>
            <small>${errorMessage || 'Unable to play audio'}</small>
        </div>
        <button class="retry-btn">
            <i class="fas fa-redo"></i> Try Again
        </button>
    `;
    
    // Style the error message
    errorDiv.style.cssText = `
        display: flex;
        align-items: center;
        padding: 10px;
        background: rgba(220, 53, 69, 0.1);
        border: 1px solid rgba(220, 53, 69, 0.3);
        border-radius: 8px;
        margin: 10px 0;
        color: #dc3545;
    `;
    
    // Add click handler for retry button
    const retryBtn = errorDiv.querySelector('.retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            errorDiv.remove();
            if (container.SimpleAudioPlayerInstance) {
                container.SimpleAudioPlayerInstance.init();
            } else {
                // Reinitialize the player
                new SimpleAudioPlayer(container);
            }
        });
    }
    
    // Find a good place to insert the error
    if (container) {
        const playerControls = container.querySelector('.progress-container') || container;
        if (playerControls.parentNode) {
            playerControls.parentNode.insertBefore(errorDiv, playerControls.nextSibling);
        } else {
            container.appendChild(errorDiv);
        }
    }
}

// Function to use fallback audio from a CDN when local files fail
function useFallbackAudio() {
    console.log('Using fallback audio from CDN...');
    
    // Update all audio players to use fallback sources
    const fallbackAudios = {
        'track1.mp3': 'https://cdn.freesound.org/previews/415/415346_3652699-lq.mp3',
        'track2.mp3': 'https://cdn.freesound.org/previews/400/400561_5121236-lq.mp3',
        'track3.mp3': 'https://cdn.freesound.org/previews/463/463444_4068033-lq.mp3',
        'sample-preview.mp3': 'https://cdn.freesound.org/previews/399/399934_7666861-lq.mp3'
    };
    
    // Update all track elements to use fallback sources
    document.querySelectorAll('.audio-player, .track-item').forEach(el => {
        const originalSrc = el.dataset.src;
        if (originalSrc) {
            // Get the filename from the path
            const filename = originalSrc.split('/').pop();
            
            // Update the source if we have a fallback for it
            if (fallbackAudios[filename]) {
                console.log(`Replacing ${originalSrc} with fallback ${fallbackAudios[filename]}`);
                el.dataset.src = fallbackAudios[filename];
                
                // Also update any audio elements directly
                const audioEl = el.querySelector('audio');
                if (audioEl) {
                    audioEl.src = fallbackAudios[filename];
                    audioEl.load();
                }
            }
        }
    });
    
    // Reinitialize all players
    if (window.featuredAudioPlayer) {
        try {
            window.featuredAudioPlayer.init();
        } catch (e) {
            console.error('Error reinitializing featured player:', e);
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Handle any resize-specific logic here
    console.log('Window resized');
}, 250));

// Handle scroll events
window.addEventListener('scroll', throttle(() => {
    // Handle any scroll-specific logic here
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class to body for styling
    if (scrollTop > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}, 100));

// Export functions for use in other modules
window.MacWayneUtils = {
    showNotification,
    debounce,
    throttle,
    isValidEmail
};
