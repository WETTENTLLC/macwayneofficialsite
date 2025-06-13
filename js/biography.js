// Mac Wayne Biography Page - Accessible JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle with accessibility
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            
            // Update ARIA attributes
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('aria-hidden', isExpanded);
            
            // Focus management
            if (!isExpanded) {
                // Menu is opening - focus first menu item
                const firstMenuItem = navMenu.querySelector('a');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            }
        });
        
        // Handle Escape key to close menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                mobileMenuToggle.focus();
            }
        });
    }

    // Timeline animation with reduced motion support
    const observeTimeline = () => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length === 0) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (prefersReducedMotion) {
                        // Just show the item without animation
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'none';
                    } else {
                        // Apply animation class
                        entry.target.classList.add('animate');
                    }
                    
                    // Announce to screen readers
                    const title = entry.target.querySelector('h3, h4');
                    if (title) {
                        announceToScreenReader(`Timeline item visible: ${title.textContent}`);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        timelineItems.forEach(item => {
            observer.observe(item);
            
            // Ensure items are keyboard focusable if they contain interactive content
            const interactiveContent = item.querySelector('button, a, input, select, textarea');
            if (interactiveContent && !item.hasAttribute('tabindex')) {
                item.setAttribute('tabindex', '0');
            }
        });
    };

    // Screen reader announcement function
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Initialize timeline observation
    observeTimeline();

    // Enhanced keyboard navigation for timeline
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        timelineContainer.addEventListener('keydown', function(e) {
            const focusableItems = timelineContainer.querySelectorAll('.timeline-item[tabindex="0"]');
            const currentIndex = Array.from(focusableItems).indexOf(document.activeElement);
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % focusableItems.length;
                    focusableItems[nextIndex].focus();
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
                    focusableItems[prevIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    focusableItems[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    focusableItems[focusableItems.length - 1].focus();
                    break;
            }
        });
    }

    // Add focus indicators for timeline items
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item:focus {
            outline: 3px solid #cc0000;
            outline-offset: 2px;
            background-color: rgba(204, 0, 0, 0.1);
        }
        
        .timeline-item:focus-visible {
            outline: 3px solid #cc0000;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});