// Cryptocurrency Testing and Validation Suite
// For Mac Wayne Battered Coin System

class CryptoTestingSuite {
    constructor() {
        this.testResults = [];
        this.isRunning = false;
        this.testContainer = null;
        this.initializeTestingInterface();
    }

    initializeTestingInterface() {
        // Create testing interface for development/debugging
        this.createTestingPanel();
        this.setupTestingControls();
    }

    createTestingPanel() {
        const testPanel = document.createElement('div');
        testPanel.id = 'crypto-testing-panel';
        testPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
            max-height: 400px;
            overflow-y: auto;
            display: none;
        `;
        
        testPanel.innerHTML = `
            <h3>🧪 Crypto Testing Suite</h3>
            <button id="run-all-tests" style="margin: 5px;">Run All Tests</button>
            <button id="toggle-test-panel" style="margin: 5px;">Hide Panel</button>
            <div id="test-results"></div>
        `;
        
        document.body.appendChild(testPanel);
        this.testContainer = testPanel;
    }

    setupTestingControls() {
        // Add keyboard shortcut to show/hide testing panel (Ctrl+Shift+T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                this.toggleTestingPanel();
            }
        });

        // Setup test controls
        document.addEventListener('DOMContentLoaded', () => {
            const runTestsBtn = document.getElementById('run-all-tests');
            const toggleBtn = document.getElementById('toggle-test-panel');

            if (runTestsBtn) {
                runTestsBtn.addEventListener('click', () => this.runAllTests());
            }

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggleTestingPanel());
            }
        });
    }

    toggleTestingPanel() {
        if (this.testContainer) {
            const isVisible = this.testContainer.style.display !== 'none';
            this.testContainer.style.display = isVisible ? 'none' : 'block';
        }
    }

    async runAllTests() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.testResults = [];
        this.updateTestDisplay('🔄 Starting comprehensive crypto testing...');

        try {
            // Test wallet integration
            await this.testWalletIntegration();
            
            // Test smart contracts
            await this.testSmartContracts();
            
            // Test market data
            await this.testMarketData();
            
            // Test marketplace integration
            await this.testMarketplaceIntegration();
            
            // Test value generation
            await this.testValueGeneration();
            
            // Test user experience
            await this.testUserExperience();
            
            // Test accessibility
            await this.testAccessibility();
            
            // Performance tests
            await this.testPerformance();
            
            this.generateTestReport();
            
        } catch (error) {
            this.logTest('❌ CRITICAL ERROR', `Testing suite failed: ${error.message}`, false);
        } finally {
            this.isRunning = false;
        }
    }

    async testWalletIntegration() {
        this.updateTestDisplay('Testing wallet integration...');
        
        try {
            // Test wallet connection interface
            const walletSection = document.querySelector('.wallet-section');
            this.logTest('Wallet UI', 'Wallet section exists', !!walletSection);
            
            // Test wallet provider detection
            if (typeof window.walletIntegration !== 'undefined') {
                const hasProviders = window.walletIntegration.providers && 
                                   Object.keys(window.walletIntegration.providers).length > 0;
                this.logTest('Wallet Providers', 'Wallet providers loaded', hasProviders);
                
                // Test wallet state management
                const hasState = typeof window.walletIntegration.isConnected === 'function';
                this.logTest('Wallet State', 'State management functions exist', hasState);
            } else {
                this.logTest('Wallet Integration', 'Wallet integration module not loaded', false);
            }
            
            // Test wallet UI components
            const connectButtons = document.querySelectorAll('.wallet-connect-btn');
            this.logTest('Connect Buttons', `${connectButtons.length} wallet connect buttons found`, connectButtons.length > 0);
            
        } catch (error) {
            this.logTest('Wallet Integration', `Error: ${error.message}`, false);
        }
    }

    async testSmartContracts() {
        this.updateTestDisplay('Testing smart contracts...');
        
        try {
            if (typeof window.smartContracts !== 'undefined') {
                // Test contract initialization
                const hasContracts = window.smartContracts.contracts && 
                                   Object.keys(window.smartContracts.contracts).length > 0;
                this.logTest('Smart Contracts', 'Contract definitions loaded', hasContracts);
                
                // Test staking functions
                const hasStaking = typeof window.smartContracts.stakeTokens === 'function';
                this.logTest('Staking Functions', 'Staking functions available', hasStaking);
                
                // Test token operations
                const hasTokenOps = typeof window.smartContracts.getTokenBalance === 'function';
                this.logTest('Token Operations', 'Token operation functions available', hasTokenOps);
                
                // Test event listeners
                const hasEvents = window.smartContracts.eventListeners && 
                                window.smartContracts.eventListeners.length > 0;
                this.logTest('Event Listeners', 'Contract event listeners configured', hasEvents);
                
            } else {
                this.logTest('Smart Contracts', 'Smart contracts module not loaded', false);
            }
            
        } catch (error) {
            this.logTest('Smart Contracts', `Error: ${error.message}`, false);
        }
    }

    async testMarketData() {
        this.updateTestDisplay('Testing market data...');
        
        try {
            if (typeof window.marketData !== 'undefined') {
                // Test data fetching capabilities
                const hasDataFetch = typeof window.marketData.fetchPriceData === 'function';
                this.logTest('Market Data Fetch', 'Price data fetching available', hasDataFetch);
                
                // Test real-time updates
                const hasRealTime = typeof window.marketData.startRealTimeUpdates === 'function';
                this.logTest('Real-time Updates', 'Real-time update functions available', hasRealTime);
                
                // Test chart integration
                const chartElements = document.querySelectorAll('.price-chart, .market-chart');
                this.logTest('Chart Elements', `${chartElements.length} chart elements found`, chartElements.length > 0);
                
                // Test data caching
                const hasCache = window.marketData.cache !== undefined;
                this.logTest('Data Caching', 'Data caching system available', hasCache);
                
            } else {
                this.logTest('Market Data', 'Market data module not loaded', false);
            }
            
        } catch (error) {
            this.logTest('Market Data', `Error: ${error.message}`, false);
        }
    }

    async testMarketplaceIntegration() {
        this.updateTestDisplay('Testing marketplace integration...');
        
        try {
            if (typeof window.marketplaceIntegration !== 'undefined') {
                // Test exchange integrations
                const hasExchanges = window.marketplaceIntegration.exchanges && 
                                   Object.keys(window.marketplaceIntegration.exchanges).length > 0;
                this.logTest('Exchange Integration', 'Exchange APIs configured', hasExchanges);
                
                // Test NFT marketplace
                const hasNFT = typeof window.marketplaceIntegration.getNFTCollections === 'function';
                this.logTest('NFT Marketplace', 'NFT marketplace functions available', hasNFT);
                
                // Test trading pairs
                const hasTradingPairs = window.marketplaceIntegration.tradingPairs && 
                                      window.marketplaceIntegration.tradingPairs.length > 0;
                this.logTest('Trading Pairs', 'Trading pairs configured', hasTradingPairs);
                
            } else {
                this.logTest('Marketplace Integration', 'Marketplace integration module not loaded', false);
            }
            
        } catch (error) {
            this.logTest('Marketplace Integration', `Error: ${error.message}`, false);
        }
    }

    async testValueGeneration() {
        this.updateTestDisplay('Testing value generation mechanisms...');
        
        try {
            if (typeof window.valueGeneration !== 'undefined') {
                // Test staking pools
                const hasStakingPools = window.valueGeneration.stakingPools && 
                                      window.valueGeneration.stakingPools.length > 0;
                this.logTest('Staking Pools', 'Staking pools configured', hasStakingPools);
                
                // Test liquidity pools
                const hasLiquidityPools = typeof window.valueGeneration.addLiquidity === 'function';
                this.logTest('Liquidity Pools', 'Liquidity pool functions available', hasLiquidityPools);
                
                // Test yield farming
                const hasYieldFarming = typeof window.valueGeneration.startYieldFarming === 'function';
                this.logTest('Yield Farming', 'Yield farming functions available', hasYieldFarming);
                
                // Test trading strategies
                const hasTradingStrategies = window.valueGeneration.tradingStrategies && 
                                           window.valueGeneration.tradingStrategies.length > 0;
                this.logTest('Trading Strategies', 'Trading strategies available', hasTradingStrategies);
                
            } else {
                this.logTest('Value Generation', 'Value generation module not loaded', false);
            }
            
        } catch (error) {
            this.logTest('Value Generation', `Error: ${error.message}`, false);
        }
    }

    async testUserExperience() {
        this.updateTestDisplay('Testing user experience...');
        
        try {
            if (typeof window.userExperience !== 'undefined') {
                // Test wallet setup wizard
                const hasWizard = typeof window.userExperience.startWalletSetup === 'function';
                this.logTest('Setup Wizard', 'Wallet setup wizard available', hasWizard);
                
                // Test purchase flow
                const hasPurchaseFlow = typeof window.userExperience.optimizePurchaseFlow === 'function';
                this.logTest('Purchase Flow', 'Optimized purchase flow available', hasPurchaseFlow);
                
                // Test mobile compatibility
                const hasMobileSupport = typeof window.userExperience.detectMobileWallet === 'function';
                this.logTest('Mobile Support', 'Mobile wallet support available', hasMobileSupport);
                
                // Test customer support
                const hasSupport = window.userExperience.supportChannels && 
                                 window.userExperience.supportChannels.length > 0;
                this.logTest('Customer Support', 'Support channels configured', hasSupport);
                
            } else {
                this.logTest('User Experience', 'User experience module not loaded', false);
            }
            
        } catch (error) {
            this.logTest('User Experience', `Error: ${error.message}`, false);
        }
    }

    async testAccessibility() {
        this.updateTestDisplay('Testing accessibility features...');
        
        try {
            // Test ARIA labels
            const elementsWithAria = document.querySelectorAll('[aria-label], [aria-describedby], [role]');
            this.logTest('ARIA Labels', `${elementsWithAria.length} elements with ARIA attributes`, elementsWithAria.length > 0);
            
            // Test keyboard navigation
            const focusableElements = document.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
            this.logTest('Keyboard Navigation', `${focusableElements.length} focusable elements`, focusableElements.length > 0);
            
            // Test color contrast (basic check)
            const highContrastElements = document.querySelectorAll('.high-contrast, .accessibility-mode');
            this.logTest('High Contrast Mode', 'High contrast elements available', highContrastElements.length > 0);
            
            // Test screen reader support
            const srElements = document.querySelectorAll('.sr-only, [aria-live]');
            this.logTest('Screen Reader Support', `${srElements.length} screen reader elements`, srElements.length > 0);
            
            // Test font scaling
            const scalableElements = document.querySelectorAll('[data-font-scale], .scalable-text');
            this.logTest('Font Scaling', 'Font scaling support available', scalableElements.length > 0);
            
        } catch (error) {
            this.logTest('Accessibility', `Error: ${error.message}`, false);
        }
    }

    async testPerformance() {
        this.updateTestDisplay('Testing performance...');
        
        try {
            // Test page load performance
            if (performance && performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.logTest('Page Load Time', `${loadTime}ms`, loadTime < 5000);
            }
            
            // Test memory usage (basic check)
            if (performance.memory) {
                const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                this.logTest('Memory Usage', `${memoryUsage.toFixed(2)}MB`, memoryUsage < 100);
            }
            
            // Test script loading
            const scripts = document.querySelectorAll('script[src*="js/"]');
            this.logTest('Script Loading', `${scripts.length} JavaScript files loaded`, scripts.length > 0);
            
            // Test CSS loading
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            this.logTest('CSS Loading', `${stylesheets.length} stylesheets loaded`, stylesheets.length > 0);
            
        } catch (error) {
            this.logTest('Performance', `Error: ${error.message}`, false);
        }
    }

    logTest(category, description, passed) {
        const result = {
            category,
            description,
            passed,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        // Update display in real-time
        const status = passed ? '✅' : '❌';
        this.updateTestDisplay(`${status} ${category}: ${description}`);
    }

    updateTestDisplay(message) {
        const resultsDiv = document.getElementById('test-results');
        if (resultsDiv) {
            resultsDiv.innerHTML += `<div>${message}</div>`;
            resultsDiv.scrollTop = resultsDiv.scrollHeight;
        }
    }

    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        const report = `
            <div style="margin-top: 15px; padding: 10px; border: 1px solid #333;">
                <h4>📊 Test Report</h4>
                <div>Total Tests: ${totalTests}</div>
                <div style="color: #4CAF50;">Passed: ${passedTests}</div>
                <div style="color: #F44336;">Failed: ${failedTests}</div>
                <div>Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%</div>
            </div>
        `;
        
        this.updateTestDisplay(report);
        
        // Log to console for debugging
        console.log('🧪 Crypto Testing Report:', {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: (passedTests / totalTests) * 100,
            results: this.testResults
        });
    }

    // Utility function to validate cryptocurrency addresses
    validateCryptoAddress(address, type = 'ethereum') {
        if (!address || typeof address !== 'string') return false;
        
        switch (type.toLowerCase()) {
            case 'ethereum':
                return /^0x[a-fA-F0-9]{40}$/.test(address);
            case 'bitcoin':
                return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
            default:
                return false;
        }
    }

    // Utility function to validate transaction hashes
    validateTransactionHash(hash) {
        return /^0x[a-fA-F0-9]{64}$/.test(hash);
    }

    // Mock data generator for testing
    generateMockData() {
        return {
            wallet: {
                address: '0x742d35Cc6634C0532925a3b8D84a9f5ea6b42f54',
                balance: '1250.75',
                network: 'ethereum'
            },
            token: {
                symbol: 'MWB',
                balance: '5000.00',
                price: '0.125',
                change24h: '+5.2%'
            },
            staking: {
                staked: '2500.00',
                rewards: '125.50',
                apr: '12.5%'
            }
        };
    }
}

// Initialize testing suite when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize in development mode
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.search.includes('debug=true')) {
        
        window.cryptoTestingSuite = new CryptoTestingSuite();
        console.log('🧪 Crypto Testing Suite initialized. Press Ctrl+Shift+T to show testing panel.');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoTestingSuite;
}
