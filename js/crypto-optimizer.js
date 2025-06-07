// Cryptocurrency Performance Optimization Suite
// For Mac Wayne Battered Coin System

class CryptoOptimizer {
    constructor() {
        this.performanceMetrics = {};
        this.optimizationSettings = {
            enableLazyLoading: true,
            enableCaching: true,
            enableCompression: true,
            enablePreloading: true,
            optimizeImages: true,
            minifyAssets: true
        };
        this.initialize();
    }

    initialize() {
        this.setupPerformanceMonitoring();
        this.optimizeLoadingSequence();
        this.setupResourceOptimization();
        this.implementAccessibilityOptimizations();
        this.setupMobileOptimizations();
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.observePerformanceMetrics();
        
        // Track cryptocurrency-specific metrics
        this.trackCryptoOperations();
        
        // Monitor memory usage
        this.monitorMemoryUsage();
    }

    observePerformanceMetrics() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
                this.optimizeLCP();
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    this.optimizeFID();
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                entryList.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cls = clsValue;
                this.optimizeCLS();
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    trackCryptoOperations() {
        // Monitor wallet connection performance
        const originalConnect = window.walletIntegration?.connectWallet;
        if (originalConnect) {
            window.walletIntegration.connectWallet = async (...args) => {
                const startTime = performance.now();
                try {
                    const result = await originalConnect.apply(window.walletIntegration, args);
                    const duration = performance.now() - startTime;
                    this.logPerformance('wallet_connection', duration);
                    return result;
                } catch (error) {
                    this.logError('wallet_connection', error);
                    throw error;
                }
            };
        }

        // Monitor market data fetching
        const originalFetch = window.marketData?.fetchPriceData;
        if (originalFetch) {
            window.marketData.fetchPriceData = async (...args) => {
                const startTime = performance.now();
                try {
                    const result = await originalFetch.apply(window.marketData, args);
                    const duration = performance.now() - startTime;
                    this.logPerformance('market_data_fetch', duration);
                    return result;
                } catch (error) {
                    this.logError('market_data_fetch', error);
                    throw error;
                }
            };
        }
    }

    monitorMemoryUsage() {
        if (performance.memory) {
            setInterval(() => {
                const memInfo = performance.memory;
                this.performanceMetrics.memory = {
                    used: memInfo.usedJSHeapSize,
                    total: memInfo.totalJSHeapSize,
                    limit: memInfo.jsHeapSizeLimit
                };

                // Alert if memory usage is high
                const usagePercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
                if (usagePercent > 80) {
                    this.optimizeMemoryUsage();
                }
            }, 30000); // Check every 30 seconds
        }
    }

    optimizeLoadingSequence() {
        // Prioritize critical cryptocurrency resources
        this.preloadCriticalResources();
        
        // Implement progressive loading
        this.setupProgressiveLoading();
        
        // Optimize script loading order
        this.optimizeScriptLoading();
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/js/wallet-integration.js',
            '/js/smart-contracts.js',
            '/js/market-data.js',
            '/styles/components.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.js') ? 'script' : 'style';
            document.head.appendChild(link);
        });
    }

    setupProgressiveLoading() {
        // Load non-critical features after initial page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadNonCriticalFeatures();
            }, 100);
        });
    }

    loadNonCriticalFeatures() {
        const nonCriticalModules = [
            'marketplace-integration.js',
            'value-generation.js',
            'user-experience.js'
        ];

        nonCriticalModules.forEach((module, index) => {
            setTimeout(() => {
                this.loadScript(`/js/${module}`);
            }, index * 200); // Stagger loading
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    optimizeScriptLoading() {
        // Add async/defer attributes to non-critical scripts
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (!script.src.includes('wallet-integration') && 
                !script.src.includes('smart-contracts')) {
                script.defer = true;
            }
        });
    }

    setupResourceOptimization() {
        // Implement image lazy loading
        this.setupImageLazyLoading();
        
        // Optimize network requests
        this.optimizeNetworkRequests();
        
        // Setup service worker for caching
        this.setupServiceWorker();
    }

    setupImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeNetworkRequests() {
        // Implement request batching
        this.setupRequestBatching();
        
        // Add request caching
        this.setupRequestCaching();
        
        // Implement connection optimization
        this.optimizeConnections();
    }

    setupRequestBatching() {
        let pendingRequests = [];
        let batchTimeout = null;

        window.batchRequest = (url, options = {}) => {
            return new Promise((resolve, reject) => {
                pendingRequests.push({ url, options, resolve, reject });
                
                if (batchTimeout) clearTimeout(batchTimeout);
                
                batchTimeout = setTimeout(() => {
                    this.processBatchedRequests(pendingRequests);
                    pendingRequests = [];
                }, 50); // 50ms batching window
            });
        };
    }

    async processBatchedRequests(requests) {
        // Group requests by domain
        const groupedRequests = requests.reduce((groups, request) => {
            const domain = new URL(request.url, window.location.origin).origin;
            if (!groups[domain]) groups[domain] = [];
            groups[domain].push(request);
            return groups;
        }, {});

        // Process each group in parallel
        const promises = Object.values(groupedRequests).map(group => 
            this.processRequestGroup(group)
        );

        await Promise.all(promises);
    }

    async processRequestGroup(requests) {
        for (const request of requests) {
            try {
                const response = await fetch(request.url, request.options);
                request.resolve(response);
            } catch (error) {
                request.reject(error);
            }
        }
    }

    setupRequestCaching() {
        const cache = new Map();
        const originalFetch = window.fetch;

        window.fetch = async (url, options = {}) => {
            // Only cache GET requests
            if (options.method && options.method !== 'GET') {
                return originalFetch(url, options);
            }

            const cacheKey = `${url}:${JSON.stringify(options)}`;
            
            // Check cache first
            if (cache.has(cacheKey)) {
                const cached = cache.get(cacheKey);
                if (Date.now() - cached.timestamp < 300000) { // 5 minutes
                    return Promise.resolve(cached.response.clone());
                }
            }

            // Fetch and cache
            const response = await originalFetch(url, options);
            cache.set(cacheKey, {
                response: response.clone(),
                timestamp: Date.now()
            });

            return response;
        };
    }

    optimizeConnections() {
        // Add DNS prefetch for external domains
        const externalDomains = [
            'api.coingecko.com',
            'api.coinbase.com',
            'api.binance.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }

    implementAccessibilityOptimizations() {
        // Optimize for screen readers
        this.optimizeScreenReaderExperience();
        
        // Enhance keyboard navigation
        this.optimizeKeyboardNavigation();
        
        // Implement focus management
        this.optimizeFocusManagement();
    }

    optimizeScreenReaderExperience() {
        // Add live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // Announce important changes
        window.announceToScreenReader = (message) => {
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        };
    }

    optimizeKeyboardNavigation() {
        // Implement skip links
        this.addSkipLinks();
        
        // Optimize tab order
        this.optimizeTabOrder();
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
    }

    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#wallet-section" class="skip-link">Skip to wallet</a>
            <a href="#trading-section" class="skip-link">Skip to trading</a>
        `;
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    optimizeTabOrder() {
        // Ensure logical tab order for crypto interfaces
        const cryptoElements = document.querySelectorAll(
            '.wallet-connect-btn, .stake-btn, .trade-btn, .buy-btn'
        );
        
        cryptoElements.forEach((element, index) => {
            element.tabIndex = index + 1;
        });
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + W: Focus wallet section
            if (e.altKey && e.key === 'w') {
                e.preventDefault();
                document.querySelector('.wallet-section')?.focus();
            }
            
            // Alt + T: Focus trading section
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                document.querySelector('.trading-section')?.focus();
            }
            
            // Alt + S: Focus staking section
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                document.querySelector('.staking-section')?.focus();
            }
        });
    }

    optimizeFocusManagement() {
        // Track focus for better UX
        let lastFocusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            lastFocusedElement = e.target;
        });

        // Return focus after modal closes
        window.returnFocus = () => {
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };
    }

    setupMobileOptimizations() {
        // Optimize touch interactions
        this.optimizeTouchInteractions();
        
        // Implement mobile-specific features
        this.addMobileFeatures();
        
        // Optimize for mobile wallets
        this.optimizeMobileWallets();
    }

    optimizeTouchInteractions() {
        // Add touch feedback
        const touchElements = document.querySelectorAll('button, .clickable');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 100);
            });
        });
    }

    addMobileFeatures() {
        // Add mobile navigation
        if (window.innerWidth <= 768) {
            this.setupMobileNavigation();
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
    }

    setupMobileNavigation() {
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-crypto-nav';
        mobileNav.innerHTML = `
            <div class="nav-item" data-section="wallet">
                <span class="icon">👛</span>
                <span class="label">Wallet</span>
            </div>
            <div class="nav-item" data-section="stake">
                <span class="icon">🏦</span>
                <span class="label">Stake</span>
            </div>
            <div class="nav-item" data-section="trade">
                <span class="icon">📈</span>
                <span class="label">Trade</span>
            </div>
            <div class="nav-item" data-section="nft">
                <span class="icon">🎨</span>
                <span class="label">NFTs</span>
            </div>
        `;
        
        document.body.appendChild(mobileNav);
        
        // Add navigation functionality
        mobileNav.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                const section = navItem.dataset.section;
                this.scrollToSection(section);
            }
        });
    }

    scrollToSection(sectionName) {
        const section = document.querySelector(`[data-section="${sectionName}"], .${sectionName}-section`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleOrientationChange() {
        // Adjust layouts for orientation changes
        const cryptoSections = document.querySelectorAll('.crypto-section');
        cryptoSections.forEach(section => {
            section.classList.toggle('landscape-mode', window.innerWidth > window.innerHeight);
        });
    }

    optimizeMobileWallets() {
        // Deep link support for mobile wallets
        this.setupDeepLinks();
        
        // Optimize for mobile wallet UX
        this.optimizeMobileWalletUX();
    }

    setupDeepLinks() {
        window.openMobileWallet = (walletName, action = 'connect') => {
            const deepLinks = {
                metamask: `https://metamask.app.link/dapp/${window.location.href}`,
                trust: `trust://app_link?url=${encodeURIComponent(window.location.href)}`,
                coinbase: `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`
            };
            
            if (deepLinks[walletName.toLowerCase()]) {
                window.location.href = deepLinks[walletName.toLowerCase()];
            }
        };
    }

    optimizeMobileWalletUX() {
        // Show mobile-optimized wallet connection UI
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            document.body.classList.add('mobile-device');
            
            // Add mobile-specific wallet buttons
            const walletSection = document.querySelector('.wallet-section');
            if (walletSection) {
                const mobileWalletBtn = document.createElement('button');
                mobileWalletBtn.className = 'mobile-wallet-btn';
                mobileWalletBtn.textContent = 'Open in Mobile Wallet';
                mobileWalletBtn.onclick = () => this.showMobileWalletOptions();
                walletSection.appendChild(mobileWalletBtn);
            }
        }
    }

    showMobileWalletOptions() {
        const modal = document.createElement('div');
        modal.className = 'mobile-wallet-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Choose Your Mobile Wallet</h3>
                <button onclick="window.openMobileWallet('metamask')">MetaMask</button>
                <button onclick="window.openMobileWallet('trust')">Trust Wallet</button>
                <button onclick="window.openMobileWallet('coinbase')">Coinbase Wallet</button>
                <button onclick="this.closest('.mobile-wallet-modal').remove()">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Performance optimization methods
    optimizeLCP() {
        if (this.performanceMetrics.lcp > 2500) {
            // LCP is too slow, optimize largest content
            this.preloadLargestContent();
            this.optimizeImages();
        }
    }

    optimizeFID() {
        if (this.performanceMetrics.fid > 100) {
            // FID is too slow, reduce main thread blocking
            this.deferNonCriticalTasks();
            this.optimizeEventHandlers();
        }
    }

    optimizeCLS() {
        if (this.performanceMetrics.cls > 0.1) {
            // CLS is too high, stabilize layout
            this.addDimensionsToImages();
            this.reserveSpaceForDynamicContent();
        }
    }

    preloadLargestContent() {
        // Identify and preload the largest contentful paint element
        const largeImages = document.querySelectorAll('img[width], img[height]');
        largeImages.forEach(img => {
            if (img.offsetWidth * img.offsetHeight > 50000) { // Large images
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = img.src;
                link.as = 'image';
                document.head.appendChild(link);
            }
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for below-fold images
            if (img.getBoundingClientRect().top > window.innerHeight) {
                img.loading = 'lazy';
            }
            
            // Add appropriate image formats
            if (!img.srcset) {
                this.addResponsiveImages(img);
            }
        });
    }

    addResponsiveImages(img) {
        const src = img.src;
        if (src) {
            const srcset = [
                `${src}?w=480 480w`,
                `${src}?w=768 768w`,
                `${src}?w=1024 1024w`
            ].join(', ');
            
            img.srcset = srcset;
            img.sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, 1024px';
        }
    }

    deferNonCriticalTasks() {
        // Use requestIdleCallback for non-critical tasks
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                this.loadNonCriticalFeatures();
            });
        } else {
            setTimeout(() => {
                this.loadNonCriticalFeatures();
            }, 0);
        }
    }

    optimizeEventHandlers() {
        // Debounce scroll and resize handlers
        let scrollTimeout, resizeTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleOptimizedScroll();
            }, 16); // ~60fps
        }, { passive: true });
        
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleOptimizedResize();
            }, 100);
        });
    }

    handleOptimizedScroll() {
        // Handle scroll events efficiently
        const scrollTop = window.pageYOffset;
        this.updateScrollDependentElements(scrollTop);
    }

    handleOptimizedResize() {
        // Handle resize events efficiently
        this.updateResponsiveElements();
    }

    updateScrollDependentElements(scrollTop) {
        // Update elements that depend on scroll position
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('scrolled', scrollTop > 100);
        }
    }

    updateResponsiveElements() {
        // Update responsive elements on resize
        const cryptoSections = document.querySelectorAll('.crypto-section');
        cryptoSections.forEach(section => {
            this.updateSectionLayout(section);
        });
    }

    updateSectionLayout(section) {
        const width = section.offsetWidth;
        section.classList.toggle('compact', width < 768);
    }

    addDimensionsToImages() {
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            // Add default dimensions to prevent layout shift
            if (!img.width && !img.height) {
                img.style.aspectRatio = '16/9';
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });
    }

    reserveSpaceForDynamicContent() {
        // Add placeholder dimensions for dynamic content
        const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
        dynamicContainers.forEach(container => {
            if (!container.style.minHeight) {
                container.style.minHeight = '200px';
            }
        });
    }

    optimizeMemoryUsage() {
        // Clean up unused event listeners
        this.cleanupEventListeners();
        
        // Clear old cache entries
        this.cleanupCache();
        
        // Optimize DOM nodes
        this.optimizeDOM();
    }

    cleanupEventListeners() {
        // Remove event listeners from removed elements
        const removedElements = document.querySelectorAll('[data-removed]');
        removedElements.forEach(element => {
            element.removeEventListener();
        });
    }

    cleanupCache() {
        // Clear old cache entries
        if (window.caches) {
            window.caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    if (cacheName.includes('old-')) {
                        window.caches.delete(cacheName);
                    }
                });
            });
        }
    }

    optimizeDOM() {
        // Remove hidden or unused DOM nodes
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(element => {
            if (!element.dataset.keepHidden) {
                element.remove();
            }
        });
    }

    logPerformance(operation, duration) {
        if (!this.performanceMetrics.operations) {
            this.performanceMetrics.operations = {};
        }
        
        if (!this.performanceMetrics.operations[operation]) {
            this.performanceMetrics.operations[operation] = [];
        }
        
        this.performanceMetrics.operations[operation].push({
            duration,
            timestamp: Date.now()
        });
        
        // Keep only last 10 measurements
        if (this.performanceMetrics.operations[operation].length > 10) {
            this.performanceMetrics.operations[operation].shift();
        }
    }

    logError(operation, error) {
        console.error(`Crypto operation failed: ${operation}`, error);
        
        if (!this.performanceMetrics.errors) {
            this.performanceMetrics.errors = {};
        }
        
        if (!this.performanceMetrics.errors[operation]) {
            this.performanceMetrics.errors[operation] = 0;
        }
        
        this.performanceMetrics.errors[operation]++;
    }

    getPerformanceReport() {
        return {
            metrics: this.performanceMetrics,
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.performanceMetrics.lcp > 2500) {
            recommendations.push('Optimize Largest Contentful Paint (LCP) - Consider preloading critical resources');
        }
        
        if (this.performanceMetrics.fid > 100) {
            recommendations.push('Optimize First Input Delay (FID) - Consider code splitting and deferring non-critical JavaScript');
        }
        
        if (this.performanceMetrics.cls > 0.1) {
            recommendations.push('Optimize Cumulative Layout Shift (CLS) - Add dimensions to images and reserve space for dynamic content');
        }
        
        if (this.performanceMetrics.memory?.used > this.performanceMetrics.memory?.limit * 0.8) {
            recommendations.push('High memory usage detected - Consider implementing memory cleanup strategies');
        }
        
        return recommendations;
    }
}

// Initialize optimizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoOptimizer = new CryptoOptimizer();
    console.log('🚀 Crypto Performance Optimizer initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoOptimizer;
}
