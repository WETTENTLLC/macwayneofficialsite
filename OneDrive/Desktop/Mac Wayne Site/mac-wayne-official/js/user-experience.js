/**
 * Mac Wayne Battered Coin - Enhanced User Experience System
 * Handles wallet setup wizard, purchase flows, customer support, and mobile compatibility
 */

class UserExperienceManager {
    constructor() {
        this.currentStep = 0;
        this.setupWizardSteps = [
            {
                id: 'welcome',
                title: 'Welcome to Mac Wayne Battered Coin',
                description: 'Let\'s get you started with your accessibility-focused cryptocurrency journey.',
                accessibility: true
            },
            {
                id: 'wallet-choice',
                title: 'Choose Your Wallet',
                description: 'Select a cryptocurrency wallet to store your MWB tokens.',
                accessibility: true
            },
            {
                id: 'wallet-setup',
                title: 'Set Up Your Wallet',
                description: 'Follow the steps to configure your chosen wallet.',
                accessibility: true
            },
            {
                id: 'security',
                title: 'Secure Your Account',
                description: 'Enable security features to protect your investment.',
                accessibility: true
            },
            {
                id: 'first-purchase',
                title: 'Make Your First Purchase',
                description: 'Buy your first MWB tokens and join the accessibility revolution.',
                accessibility: true
            },
            {
                id: 'completion',
                title: 'Welcome to the Community!',
                description: 'You\'re all set! Explore staking, trading, and accessibility features.',
                accessibility: true
            }
        ];
        
        this.purchaseFlow = {
            currentStep: 0,
            steps: [
                { id: 'amount', title: 'Select Amount', completed: false },
                { id: 'payment', title: 'Payment Method', completed: false },
                { id: 'confirmation', title: 'Confirm Purchase', completed: false },
                { id: 'processing', title: 'Processing', completed: false },
                { id: 'success', title: 'Success!', completed: false }
            ],
            selectedAmount: 0,
            selectedPayment: null,
            transactionHash: null
        };
        
        this.customerSupport = {
            chatEnabled: false,
            ticketSystem: true,
            knowledgeBase: true,
            accessibilitySupport: true,
            supportChannels: [
                {
                    name: 'Live Chat',
                    description: 'Instant help with screen reader support',
                    available: true,
                    accessibility: ['Screen Reader', 'Keyboard Navigation', 'High Contrast']
                },
                {
                    name: 'Email Support',
                    description: 'Detailed assistance within 24 hours',
                    available: true,
                    accessibility: ['Plain Text', 'Audio Descriptions', 'Large Text']
                },
                {
                    name: 'Video Call',
                    description: 'Personal assistance with accessibility features',
                    available: true,
                    accessibility: ['Sign Language', 'Audio Description', 'Captions']
                },
                {
                    name: 'Phone Support',
                    description: 'Voice assistance for all questions',
                    available: true,
                    accessibility: ['Voice Only', 'TTY Compatible']
                }
            ]
        };
        
        this.mobileCompatibility = {
            wallets: {
                metamask: { supported: true, features: ['Touch ID', 'Face ID', 'Voice Control'] },
                trustwallet: { supported: true, features: ['Biometric Auth', 'Voice Commands'] },
                coinbase: { supported: true, features: ['Accessibility Menu', 'Large Text'] },
                walletconnect: { supported: true, features: ['QR Code', 'Audio Feedback'] }
            },
            features: {
                voiceNavigation: true,
                gestureControl: true,
                largeTextSupport: true,
                highContrastMode: true,
                screenReaderOptimized: true
            }
        };
        
        this.notifications = {
            enabled: false,
            preferences: {
                priceAlerts: true,
                stakingRewards: true,
                securityUpdates: true,
                marketingUpdates: false,
                accessibilityNews: true
            },
            channels: ['push', 'email', 'sms'],
            accessibility: {
                audioNotifications: true,
                visualIndicators: true,
                vibrationPatterns: true
            }
        };
        
        this.userPreferences = {
            accessibility: {
                screenReader: false,
                highContrast: false,
                largeText: false,
                keyboardNavigation: true,
                voiceControl: false,
                reducedMotion: false
            },
            language: 'en',
            currency: 'USD',
            timezone: 'UTC',
            theme: 'auto'
        };
        
        this.onboardingProgress = {
            walletSetup: false,
            firstPurchase: false,
            securitySetup: false,
            stakingIntro: false,
            communityJoined: false
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Load user preferences
            this.loadUserPreferences();
            
            // Apply accessibility settings
            this.applyAccessibilitySettings();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize mobile compatibility
            this.initializeMobileFeatures();
            
            // Check if user needs onboarding
            this.checkOnboardingStatus();
            
            console.log('User Experience Manager initialized');
            
        } catch (error) {
            console.error('User Experience initialization error:', error);
        }
    }
    
    // Wallet Setup Wizard
    async startWalletWizard() {
        try {
            this.currentStep = 0;
            this.showWizardStep(this.setupWizardSteps[0]);
            
            // Track wizard start
            this.trackEvent('wizard_started', { step: 'welcome' });
            
        } catch (error) {
            console.error('Error starting wallet wizard:', error);
        }
    }
    
    showWizardStep(step) {
        const wizardContainer = document.getElementById('wallet-wizard');
        if (!wizardContainer) {
            this.createWizardModal();
            return;
        }
        
        const stepHTML = this.generateWizardStepHTML(step);
        wizardContainer.innerHTML = stepHTML;
        
        // Apply accessibility features
        this.enhanceWizardAccessibility(step);
        
        // Update progress indicator
        this.updateWizardProgress();
    }
    
    generateWizardStepHTML(step) {
        const progressPercent = ((this.currentStep + 1) / this.setupWizardSteps.length) * 100;
        
        let contentHTML = '';
        
        switch (step.id) {
            case 'welcome':
                contentHTML = this.generateWelcomeStepHTML();
                break;
            case 'wallet-choice':
                contentHTML = this.generateWalletChoiceHTML();
                break;
            case 'wallet-setup':
                contentHTML = this.generateWalletSetupHTML();
                break;
            case 'security':
                contentHTML = this.generateSecurityStepHTML();
                break;
            case 'first-purchase':
                contentHTML = this.generateFirstPurchaseHTML();
                break;
            case 'completion':
                contentHTML = this.generateCompletionHTML();
                break;
        }
        
        return `
            <div class="wizard-modal" role="dialog" aria-labelledby="wizard-title" aria-describedby="wizard-description">
                <div class="wizard-header">
                    <h2 id="wizard-title">${step.title}</h2>
                    <p id="wizard-description">${step.description}</p>
                    <div class="wizard-progress" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: ${progressPercent}%"></div>
                        <span class="progress-text">${this.currentStep + 1} of ${this.setupWizardSteps.length}</span>
                    </div>
                </div>
                <div class="wizard-content">
                    ${contentHTML}
                </div>
                <div class="wizard-actions">
                    ${this.currentStep > 0 ? '<button class="wizard-btn secondary" onclick="userExperienceManager.previousWizardStep()">Previous</button>' : ''}
                    ${this.currentStep < this.setupWizardSteps.length - 1 ? '<button class="wizard-btn primary" onclick="userExperienceManager.nextWizardStep()">Next</button>' : ''}
                    ${this.currentStep === this.setupWizardSteps.length - 1 ? '<button class="wizard-btn primary" onclick="userExperienceManager.completeWizard()">Get Started</button>' : ''}
                </div>
            </div>
        `;
    }
    
    generateWelcomeStepHTML() {
        return `
            <div class="welcome-content">
                <div class="welcome-icon" aria-hidden="true">
                    <img src="public/Images/macwayne-coin.png" alt="Mac Wayne Coin" class="coin-icon">
                </div>
                <div class="welcome-text">
                    <h3>The World's First Accessibility-Focused Cryptocurrency</h3>
                    <ul class="benefits-list">
                        <li>🎯 Built for screen readers and assistive technology</li>
                        <li>🤝 Direct partnerships with accessibility companies</li>
                        <li>🔬 15% of transactions fund accessibility research</li>
                        <li>🌍 Making blockchain technology accessible to everyone</li>
                    </ul>
                </div>
                <div class="accessibility-notice">
                    <p><strong>Accessibility First:</strong> This wizard is fully compatible with screen readers, keyboard navigation, and other assistive technologies.</p>
                </div>
            </div>
        `;
    }
    
    generateWalletChoiceHTML() {
        const wallets = Object.entries(window.walletManager?.supportedWallets || {});
        
        return `
            <div class="wallet-choice-content">
                <h3>Choose Your Cryptocurrency Wallet</h3>
                <p>Select a wallet to store your MWB tokens. All options are fully accessible.</p>
                <div class="wallet-options" role="radiogroup" aria-labelledby="wallet-choice-title">
                    ${wallets.map(([id, wallet]) => `
                        <div class="wallet-option" role="radio" aria-checked="false" tabindex="0" data-wallet="${id}">
                            <div class="wallet-icon" aria-hidden="true">${wallet.icon}</div>
                            <div class="wallet-info">
                                <h4>${wallet.name}</h4>
                                <p class="wallet-description">${this.getWalletDescription(id)}</p>
                                <div class="accessibility-features">
                                    ${this.getWalletAccessibilityFeatures(id).map(feature => 
                                        `<span class="feature-tag">${feature}</span>`).join('')}
                                </div>
                            </div>
                            <div class="wallet-status">
                                ${wallet.detected() ? '<span class="status-detected">Detected</span>' : '<span class="status-install">Install</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="help-section">
                    <h4>Need Help Choosing?</h4>
                    <p>All wallets support accessibility features. MetaMask is recommended for beginners.</p>
                    <button class="help-btn" onclick="userExperienceManager.showWalletComparison()">Compare Wallets</button>
                </div>
            </div>
        `;
    }
    
    // Purchase Flow Optimization
    async startPurchaseFlow(amount = null) {
        try {
            this.purchaseFlow.currentStep = 0;
            this.purchaseFlow.selectedAmount = amount;
            
            // Reset all steps
            this.purchaseFlow.steps.forEach(step => step.completed = false);
            
            this.showPurchaseStep('amount');
            
            // Track purchase flow start
            this.trackEvent('purchase_flow_started', { amount: amount });
            
        } catch (error) {
            console.error('Error starting purchase flow:', error);
        }
    }
    
    showPurchaseStep(stepId) {
        const step = this.purchaseFlow.steps.find(s => s.id === stepId);
        if (!step) return;
        
        const container = document.getElementById('purchase-flow-container');
        if (!container) {
            this.createPurchaseFlowModal();
            return;
        }
        
        const stepHTML = this.generatePurchaseStepHTML(step);
        container.innerHTML = stepHTML;
        
        // Apply accessibility enhancements
        this.enhancePurchaseAccessibility(step);
        
        // Update progress
        this.updatePurchaseProgress(stepId);
    }
    
    generatePurchaseStepHTML(step) {
        switch (step.id) {
            case 'amount':
                return this.generateAmountStepHTML();
            case 'payment':
                return this.generatePaymentStepHTML();
            case 'confirmation':
                return this.generateConfirmationStepHTML();
            case 'processing':
                return this.generateProcessingStepHTML();
            case 'success':
                return this.generateSuccessStepHTML();
            default:
                return '<div>Step not found</div>';
        }
    }
    
    generateAmountStepHTML() {
        const presetAmounts = [100, 500, 1000, 5000];
        const currentPrice = 0.1; // Mock price
        
        return `
            <div class="amount-selection">
                <h3>How many MWB tokens would you like to buy?</h3>
                <div class="preset-amounts" role="radiogroup" aria-labelledby="amount-title">
                    ${presetAmounts.map(amount => `
                        <button class="amount-btn" role="radio" aria-checked="false" 
                                data-amount="${amount}" onclick="userExperienceManager.selectAmount(${amount})">
                            <span class="amount-tokens">${amount} MWB</span>
                            <span class="amount-price">$${(amount * currentPrice).toFixed(2)}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="custom-amount">
                    <label for="custom-amount-input">Or enter a custom amount:</label>
                    <div class="input-group">
                        <input type="number" id="custom-amount-input" min="1" step="1" 
                               placeholder="Enter amount" aria-describedby="amount-help">
                        <span class="input-suffix">MWB</span>
                    </div>
                    <p id="amount-help" class="help-text">Minimum purchase: 1 MWB</p>
                </div>
                <div class="purchase-summary">
                    <div class="summary-row">
                        <span>Amount:</span>
                        <span id="selected-amount">0 MWB</span>
                    </div>
                    <div class="summary-row">
                        <span>Price per token:</span>
                        <span>$${currentPrice}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span id="total-price">$0.00</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Customer Support Integration
    initializeCustomerSupport() {
        // Initialize support widget
        this.createSupportWidget();
        
        // Set up support event listeners
        this.setupSupportListeners();
        
        // Load support articles
        this.loadSupportArticles();
    }
    
    createSupportWidget() {
        const supportWidget = document.createElement('div');
        supportWidget.id = 'support-widget';
        supportWidget.className = 'support-widget';
        supportWidget.setAttribute('role', 'button');
        supportWidget.setAttribute('aria-label', 'Open customer support');
        supportWidget.setAttribute('tabindex', '0');
        
        supportWidget.innerHTML = `
            <div class="support-widget-content">
                <div class="support-icon" aria-hidden="true">💬</div>
                <span class="support-text">Need Help?</span>
            </div>
        `;
        
        supportWidget.addEventListener('click', () => this.showSupportOptions());
        supportWidget.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showSupportOptions();
            }
        });
        
        document.body.appendChild(supportWidget);
    }
    
    showSupportOptions() {
        const modal = document.createElement('div');
        modal.className = 'support-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'support-title');
        
        modal.innerHTML = `
            <div class="support-modal-content">
                <div class="support-header">
                    <h2 id="support-title">How can we help you?</h2>
                    <button class="close-btn" onclick="this.closest('.support-modal').remove()" aria-label="Close support options">×</button>
                </div>
                <div class="support-channels">
                    ${this.customerSupport.supportChannels.map(channel => `
                        <div class="support-channel" data-channel="${channel.name.toLowerCase().replace(' ', '-')}">
                            <h3>${channel.name}</h3>
                            <p>${channel.description}</p>
                            <div class="accessibility-features">
                                ${channel.accessibility.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                            </div>
                            <button class="support-btn" onclick="userExperienceManager.initiateSupportChannel('${channel.name}')" 
                                    ${!channel.available ? 'disabled' : ''}>
                                ${channel.available ? 'Start Conversation' : 'Currently Unavailable'}
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="support-resources">
                    <h3>Self-Help Resources</h3>
                    <div class="resource-links">
                        <button onclick="userExperienceManager.showKnowledgeBase()">Knowledge Base</button>
                        <button onclick="userExperienceManager.showAccessibilityGuide()">Accessibility Guide</button>
                        <button onclick="userExperienceManager.showVideoTutorials()">Video Tutorials</button>
                        <button onclick="userExperienceManager.showFAQ()">Frequently Asked Questions</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus management
        modal.querySelector('.close-btn').focus();
    }
    
    // Mobile Compatibility
    initializeMobileFeatures() {
        this.detectMobileDevice();
        this.setupMobileWalletIntegration();
        this.optimizeMobileInterface();
        this.enableMobileAccessibilityFeatures();
    }
    
    detectMobileDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
        
        document.body.classList.toggle('mobile-device', isMobile);
        document.body.classList.toggle('tablet-device', isTablet);
        
        if (isMobile || isTablet) {
            this.enableMobileOptimizations();
        }
    }
    
    setupMobileWalletIntegration() {
        // Set up deep links for mobile wallets
        const mobileWalletLinks = {
            metamask: 'https://metamask.app.link/dapp/macwayneofficial.com',
            trustwallet: 'https://link.trustwallet.com/open_url?coin_id=60&url=https://macwayneofficial.com',
            coinbase: 'https://go.cb-w.com/dapp?cb_url=https://macwayneofficial.com'
        };
        
        // Store wallet links for later use
        this.mobileWalletLinks = mobileWalletLinks;
        
        // Add mobile wallet detection
        this.mobileWalletDetection();
    }
    
    mobileWalletDetection() {
        // Detect if user is on mobile and show appropriate wallet options
        if (this.isMobileDevice()) {
            const mobileWallets = Object.keys(this.mobileCompatibility.wallets)
                .filter(wallet => this.mobileCompatibility.wallets[wallet].supported);
            
            // Update wallet selection UI for mobile
            this.updateMobileWalletUI(mobileWallets);
        }
    }
    
    // Accessibility Enhancements
    applyAccessibilitySettings() {
        const settings = this.userPreferences.accessibility;
        
        // High contrast mode
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // Large text mode
        if (settings.largeText) {
            document.body.classList.add('large-text');
        }
        
        // Reduced motion
        if (settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
        
        // Screen reader optimizations
        if (settings.screenReader) {
            this.enableScreenReaderOptimizations();
        }
        
        // Keyboard navigation enhancements
        if (settings.keyboardNavigation) {
            this.enhanceKeyboardNavigation();
        }
    }
    
    enableScreenReaderOptimizations() {
        // Add ARIA live regions for dynamic content
        this.createLiveRegions();
        
        // Enhance form labels and descriptions
        this.enhanceFormAccessibility();
        
        // Add skip links
        this.addSkipLinks();
        
        // Optimize focus management
        this.optimizeFocusManagement();
    }
    
    createLiveRegions() {
        const liveRegions = [
            { id: 'status-updates', politeness: 'polite' },
            { id: 'error-announcements', politeness: 'assertive' },
            { id: 'balance-updates', politeness: 'polite' }
        ];
        
        liveRegions.forEach(region => {
            const element = document.createElement('div');
            element.id = region.id;
            element.setAttribute('aria-live', region.politeness);
            element.setAttribute('aria-atomic', 'true');
            element.className = 'sr-only';
            document.body.appendChild(element);
        });
    }
    
    // Event Tracking and Analytics
    trackEvent(eventName, properties = {}) {
        try {
            // Track user events for analytics (privacy-compliant)
            const eventData = {
                event: eventName,
                timestamp: Date.now(),
                properties: {
                    ...properties,
                    accessibility_enabled: this.userPreferences.accessibility.screenReader,
                    mobile_device: this.isMobileDevice(),
                    user_agent: navigator.userAgent
                }
            };
            
            // Send to analytics (mock implementation)
            console.log('Event tracked:', eventData);
            
            // Store locally for offline analysis
            this.storeEventLocally(eventData);
            
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }
    
    storeEventLocally(eventData) {
        const events = JSON.parse(localStorage.getItem('mwb_analytics') || '[]');
        events.push(eventData);
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('mwb_analytics', JSON.stringify(events));
    }
    
    // Utility Methods
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    getWalletDescription(walletId) {
        const descriptions = {
            metamask: 'Popular browser extension wallet with excellent accessibility features',
            trustwallet: 'Mobile-first wallet with voice control and biometric authentication',
            walletconnect: 'Universal protocol connecting to 200+ wallets with QR code support',
            coinbase: 'User-friendly wallet with built-in accessibility menu and large text support'
        };
        return descriptions[walletId] || 'Secure cryptocurrency wallet';
    }
    
    getWalletAccessibilityFeatures(walletId) {
        const features = {
            metamask: ['Screen Reader', 'Keyboard Navigation', 'High Contrast'],
            trustwallet: ['Voice Control', 'Biometric Auth', 'Large Text'],
            walletconnect: ['QR Code', 'Audio Feedback', 'Simple Interface'],
            coinbase: ['Accessibility Menu', 'Voice Commands', 'Color Blind Support']
        };
        return features[walletId] || ['Basic Accessibility'];
    }
    
    // Navigation and Flow Control
    nextWizardStep() {
        if (this.currentStep < this.setupWizardSteps.length - 1) {
            this.currentStep++;
            this.showWizardStep(this.setupWizardSteps[this.currentStep]);
            this.trackEvent('wizard_step_completed', { step: this.currentStep });
        }
    }
    
    previousWizardStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showWizardStep(this.setupWizardSteps[this.currentStep]);
        }
    }
    
    completeWizard() {
        // Mark wizard as completed
        this.onboardingProgress.walletSetup = true;
        this.saveUserPreferences();
        
        // Close wizard
        const wizardContainer = document.getElementById('wallet-wizard');
        if (wizardContainer) {
            wizardContainer.remove();
        }
        
        // Show success message
        this.showSuccessMessage('Wallet setup completed! Welcome to Mac Wayne Battered Coin.');
        
        // Track completion
        this.trackEvent('wizard_completed', { total_steps: this.setupWizardSteps.length });
    }
    
    // Data Persistence
    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('mwb_user_preferences');
            if (saved) {
                const preferences = JSON.parse(saved);
                Object.assign(this.userPreferences, preferences.userPreferences || {});
                Object.assign(this.onboardingProgress, preferences.onboardingProgress || {});
                Object.assign(this.notifications.preferences, preferences.notifications || {});
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }
    }
    
    saveUserPreferences() {
        try {
            const data = {
                userPreferences: this.userPreferences,
                onboardingProgress: this.onboardingProgress,
                notifications: this.notifications.preferences,
                lastUpdated: Date.now()
            };
            localStorage.setItem('mwb_user_preferences', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }
    
    // Event Listeners
    setupEventListeners() {
        // Wallet connection events
        window.addEventListener('walletConnected', (event) => {
            this.onWalletConnected(event.detail);
        });
        
        // Accessibility preference changes
        document.addEventListener('accessibilityChange', (event) => {
            this.onAccessibilityChange(event.detail);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });
        
        // Window resize for mobile responsiveness
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    onWalletConnected(walletData) {
        this.onboardingProgress.walletSetup = true;
        this.saveUserPreferences();
        
        // Show next steps
        if (!this.onboardingProgress.firstPurchase) {
            this.showOnboardingTip('Make your first purchase to start earning rewards!');
        }
        
        // Log wallet connection data
        console.log('Wallet connected:', walletData);
    }
    
    onAccessibilityChange(settings) {
        Object.assign(this.userPreferences.accessibility, settings);
        this.applyAccessibilitySettings();
        this.saveUserPreferences();
    }
    
    handleKeyboardShortcuts(event) {
        // Alt + S: Open support
        if (event.altKey && event.key === 's') {
            event.preventDefault();
            this.showSupportOptions();
        }
        
        // Alt + W: Open wallet wizard
        if (event.altKey && event.key === 'w') {
            event.preventDefault();
            this.startWalletWizard();
        }
        
        // Alt + P: Start purchase flow
        if (event.altKey && event.key === 'p') {
            event.preventDefault();
            this.startPurchaseFlow();
        }
    }
    
    // UI Helper Methods
    showSuccessMessage(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.setAttribute('role', 'alert');
        successElement.textContent = message;
        
        document.body.appendChild(successElement);
        
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }
    
    showOnboardingTip(message) {
        const tipElement = document.createElement('div');
        tipElement.className = 'onboarding-tip';
        tipElement.setAttribute('role', 'status');
        tipElement.innerHTML = `
            <div class="tip-content">
                <span class="tip-icon">💡</span>
                <span class="tip-message">${message}</span>
            </div>
            <button class="tip-close" onclick="this.parentElement.remove()" aria-label="Close tip">×</button>
        `;
        
        document.body.appendChild(tipElement);
        
        setTimeout(() => {
            if (tipElement.parentElement) {
                tipElement.remove();
            }
        }, 10000);
    }
    
    checkOnboardingStatus() {
        // Check if user needs onboarding
        if (!this.onboardingProgress.walletSetup) {
            // Show onboarding prompt after a delay
            setTimeout(() => {
                this.showOnboardingPrompt();
            }, 3000);
        }
    }
    
    showOnboardingPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'onboarding-prompt';
        prompt.innerHTML = `
            <div class="prompt-content">
                <h3>Welcome to Mac Wayne Battered Coin!</h3>
                <p>Get started with our step-by-step setup wizard.</p>
                <div class="prompt-actions">
                    <button onclick="userExperienceManager.startWalletWizard()" class="btn-primary">Start Setup</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-secondary">Maybe Later</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
    }
}

// Initialize User Experience Manager
window.userExperienceManager = new UserExperienceManager();
