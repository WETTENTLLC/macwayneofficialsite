// Shop Coming Soon Overlay Functionality
class ShopComingSoon {
    constructor() {
        this.overlay = document.getElementById('coming-soon-overlay');
        this.notifyForm = document.getElementById('notify-form');
        this.browseButton = document.getElementById('browse-anyway');
        this.emailInput = document.getElementById('notify-email');
        
        this.init();
    }
    
    init() {
        // Don't auto-show overlay - let Printify integration control it
        
        // Bind events
        if (this.notifyForm) {
            this.notifyForm.addEventListener('submit', this.handleEmailSignup.bind(this));
        }
        
        if (this.browseButton) {
            this.browseButton.addEventListener('click', this.hideOverlay.bind(this));
        }
        
        // ESC key to close overlay
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOverlayVisible()) {
                this.hideOverlay();
            }
        });
    }
    
    showOverlay() {
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideOverlay() {
        if (this.overlay) {
            this.overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    isOverlayVisible() {
        return this.overlay && !this.overlay.classList.contains('hidden');
    }
    
    async handleEmailSignup(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        try {
            // Check if already signed up
            const existingEmails = JSON.parse(localStorage.getItem('shop-notify-emails') || '[]');
            if (existingEmails.includes(email)) {
                this.showMessage('You\'re already on our notify list!', 'info');
                return;
            }
            
            this.showLoading();
            
            // Send email notification using Formspree
            const formData = new FormData();
            formData.append('email', email);
            formData.append('_subject', 'New Shop Notification Signup - Mac Wayne Official');
            formData.append('message', `New email signup for shop notifications: ${email}`);
            formData.append('_replyto', 'officialmacwayne@gmail.com');
            
            // TODO: Replace 'YOUR_FORM_ID' with your actual Formspree form ID
            const response = await fetch('https://formspree.io/f/mldlyaln', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Store locally to prevent duplicates
                existingEmails.push(email);
                localStorage.setItem('shop-notify-emails', JSON.stringify(existingEmails));
                
                // Send confirmation email to user
                const confirmData = new FormData();
                confirmData.append('email', 'officialmacwayne@gmail.com');
                confirmData.append('_subject', 'Shop Notification Confirmation');
                confirmData.append('message', `Thank you for signing up for Mac Wayne shop notifications! We'll email you at ${email} when our merchandise store launches.`);
                confirmData.append('_replyto', email);
                
                await fetch('https://formspree.io/f/mldlyaln', {
                    method: 'POST',
                    body: confirmData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                this.showMessage('Success! Check your email for confirmation. You\'ll be notified when we launch!', 'success');
                this.emailInput.value = '';
                
                // Auto-hide overlay after successful signup
                setTimeout(() => {
                    this.hideOverlay();
                }, 3000);
            } else {
                throw new Error('Failed to send notification');
            }
            
        } catch (error) {
            console.error('Email signup error:', error);
            this.showMessage('Something went wrong. Please try again later.', 'error');
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showLoading() {
        const submitBtn = this.notifyForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing Up...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.notify-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `notify-message notify-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Insert after form
        this.notifyForm.insertAdjacentElement('afterend', messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    getMessageIcon(type) {
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
    new ShopComingSoon();
});

// Add message styles
const messageStyles = `
.notify-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-size: 0.9rem;
    animation: slideIn 0.3s ease-out;
}

.notify-success {
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    color: #4ade80;
}

.notify-error {
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: #ef4444;
}

.notify-info {
    background: rgba(0, 123, 255, 0.1);
    border: 1px solid rgba(0, 123, 255, 0.3);
    color: #3b82f6;
}

@keyframes slideIn {
    from {
        transform: translateY(-10px);
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
styleSheet.textContent = messageStyles;
document.head.appendChild(styleSheet);
