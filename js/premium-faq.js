// Mac Wayne Premium Page - Accessible JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ functionality
    initializeFAQ();
    
    // Initialize tier card animations
    observeTierCards();
    
    // Initialize mobile menu (if present)
    initializeMobileMenu();
});

function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((button, index) => {
        // Ensure proper ARIA setup
        const answerId = `faq-answer-${index + 1}`;
        const answer = document.getElementById(answerId);
        
        if (!answer) {
            // Create answer ID if it doesn't exist
            const nextElement = button.nextElementSibling;
            if (nextElement && nextElement.classList.contains('faq-answer')) {
                nextElement.id = answerId;
                button.setAttribute('aria-controls', answerId);
            }
        }
        
        // Set initial ARIA states
        button.setAttribute('aria-expanded', 'false');
        if (answer) {
            answer.setAttribute('aria-hidden', 'true');
            answer.style.maxHeight = '0';
        }
        
        // Add click event listener
        button.addEventListener('click', function() {
            toggleFAQ(this);
        });
        
        // Add keyboard event listener
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });
}

function toggleFAQ(button) {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Close all other FAQ items
    const allQuestions = document.querySelectorAll('.faq-question');
    allQuestions.forEach(otherButton => {
        if (otherButton !== button) {
            const otherAnswer = document.getElementById(otherButton.getAttribute('aria-controls'));
            otherButton.setAttribute('aria-expanded', 'false');
            if (otherAnswer) {
                otherAnswer.classList.remove('active');
                otherAnswer.setAttribute('aria-hidden', 'true');
                otherAnswer.style.maxHeight = '0';
            }
        }
    });
    
    // Toggle current FAQ item
    button.setAttribute('aria-expanded', !isExpanded);
    
    if (answer) {
        answer.classList.toggle('active');
        answer.setAttribute('aria-hidden', isExpanded);
        
        if (!isExpanded) {
            // Opening
            answer.style.maxHeight = answer.scrollHeight + 'px';
            
            // Announce to screen readers
            announceToScreenReader(`FAQ expanded: ${button.textContent}`);
        } else {
            // Closing
            answer.style.maxHeight = '0';
            announceToScreenReader('FAQ collapsed');
        }
    }
}

function observeTierCards() {
    const tierCards = document.querySelectorAll('.tier-card');
    if (tierCards.length === 0) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (prefersReducedMotion) {
                    // Just show without animation
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                } else {
                    // Animate in
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    tierCards.forEach(card => {
        // Set initial state for animation
        if (!prefersReducedMotion) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        
        observer.observe(card);
        
        // Make tier cards keyboard accessible
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // Add keyboard interaction
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const button = card.querySelector('button, .strange-button');
                if (button) {
                    e.preventDefault();
                    button.click();
                }
            }
        });
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
        });
    }
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add CSS for enhanced accessibility
const style = document.createElement('style');
style.textContent = `
    .faq-question {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(204, 0, 0, 0.3);
        color: #ffffff;
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
        width: 100%;
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }
    
    .faq-question:hover,
    .faq-question:focus {
        background: rgba(204, 0, 0, 0.2);
        border-color: #cc0000;
        outline: 3px solid #cc0000;
        outline-offset: 2px;
    }
    
    .faq-question[aria-expanded="true"] {
        background: rgba(204, 0, 0, 0.2);
        border-color: #cc0000;
    }
    
    .faq-answer {
        overflow: hidden;
        transition: max-height 0.3s ease-out, padding 0.3s ease-out;
        color: #ccc;
        border-radius: 0 0 8px 8px;
        background: rgba(0, 0, 0, 0.3);
    }
    
    .faq-answer.active {
        padding: 15px 20px;
    }
    
    .tier-card:focus {
        outline: 3px solid #cc0000;
        outline-offset: 2px;
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(204, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);