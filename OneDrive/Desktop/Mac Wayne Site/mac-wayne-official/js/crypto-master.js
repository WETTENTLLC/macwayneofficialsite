// Master Integration Script for Mac Wayne Battered Coin System
// Coordinates all cryptocurrency functionality and ensures seamless operation

class CryptoMasterController {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.errorCount = 0;
        this.maxErrors = 5;
        this.initializationPromise = null;
        
        // System state
        this.systemState = {
            wallet: { connected: false, address: null, balance: null },
            market: { price: null, change: null, lastUpdate: null },
            staking: { totalStaked: 0, rewards: 0, pools: [] },
            trading: { activeOrders: 0, volume: 0 },
            nft: { collections: [], owned: [] }
        };
        
        // Event system
        this.eventListeners = new Map();
        
        this.initialize();
    }

    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._performInitialization();
        return this.initializationPromise;
    }

    async _performInitialization() {
        try {
            console.log('🚀 Initializing Mac Wayne Crypto Master Controller...');
            
            // Show loading indicator
            this.showLoadingIndicator();
            
            // Load and initialize modules in order
            await this.loadCoreModules();
            await this.initializeWalletSystem();
            await this.initializeMarketData();
            await this.initializeSmartContracts();
            await this.initializeValueGeneration();
            await this.initializeMarketplace();
            await this.initializeUserExperience();
            
            // Setup cross-module communication
            this.setupModuleCommunication();
            
            // Initialize UI components
            this.initializeUI();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Start background services
            this.startBackgroundServices();
            
            // Final system check
            await this.performSystemCheck();
            
            this.isInitialized = true;
            this.hideLoadingIndicator();
            
            console.log('✅ Mac Wayne Crypto System initialized successfully');
            this.emit('system:initialized', this.systemState);
            
        } catch (error) {
            console.error('❌ Failed to initialize crypto system:', error);
            this.handleInitializationError(error);
            throw error;
        }
    }

    async loadCoreModules() {
        console.log('📦 Loading core cryptocurrency modules...');
        
        const modulePromises = [
            this.loadModule('walletIntegration', '/js/wallet-integration.js'),
            this.loadModule('marketData', '/js/market-data.js'),
            this.loadModule('smartContracts', '/js/smart-contracts.js'),
            this.loadModule('valueGeneration', '/js/value-generation.js'),
            this.loadModule('marketplaceIntegration', '/js/marketplace-integration.js'),
            this.loadModule('userExperience', '/js/user-experience.js')
        ];
        
        await Promise.all(modulePromises);
        console.log('✅ All core modules loaded');
    }

    async loadModule(moduleName, scriptPath) {
        try {
            // Check if module is already loaded
            if (window[moduleName]) {
                this.modules[moduleName] = window[moduleName];
                return;
            }
            
            // Load module script
            await this.loadScript(scriptPath);
            
            // Wait for module to be available
            await this.waitForModule(moduleName);
            
            this.modules[moduleName] = window[moduleName];
            console.log(`✅ Module ${moduleName} loaded`);
            
        } catch (error) {
            console.error(`❌ Failed to load module ${moduleName}:`, error);
            throw error;
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    waitForModule(moduleName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkModule = () => {
                if (window[moduleName]) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Module ${moduleName} not loaded within timeout`));
                } else {
                    setTimeout(checkModule, 100);
                }
            };
            
            checkModule();
        });
    }

    async initializeWalletSystem() {
        console.log('💰 Initializing wallet system...');
        
        if (this.modules.walletIntegration) {
            // Initialize wallet providers
            await this.modules.walletIntegration.initialize();
            
            // Setup wallet event listeners
            this.modules.walletIntegration.on('wallet:connected', (walletInfo) => {
                this.systemState.wallet = walletInfo;
                this.emit('wallet:connected', walletInfo);
                this.updateWalletUI(walletInfo);
            });
            
            this.modules.walletIntegration.on('wallet:disconnected', () => {
                this.systemState.wallet = { connected: false, address: null, balance: null };
                this.emit('wallet:disconnected');
                this.updateWalletUI(null);
            });
            
            // Auto-connect if previously connected
            const lastWallet = localStorage.getItem('mwb_last_wallet');
            if (lastWallet) {
                try {
                    await this.modules.walletIntegration.connectWallet(lastWallet);
                } catch (error) {
                    console.log('Failed to auto-connect wallet:', error.message);
                }
            }
        }
    }

    async initializeMarketData() {
        console.log('📊 Initializing market data system...');
        
        if (this.modules.marketData) {
            // Initialize market data fetching
            await this.modules.marketData.initialize();
            
            // Setup market data event listeners
            this.modules.marketData.on('price:updated', (priceData) => {
                this.systemState.market = priceData;
                this.emit('market:updated', priceData);
                this.updateMarketUI(priceData);
            });
            
            // Start real-time price updates
            this.modules.marketData.startRealTimeUpdates();
            
            // Initial price fetch
            try {
                const initialPrice = await this.modules.marketData.fetchPriceData();
                this.systemState.market = initialPrice;
                this.updateMarketUI(initialPrice);
            } catch (error) {
                console.warn('Failed to fetch initial price data:', error.message);
            }
        }
    }

    async initializeSmartContracts() {
        console.log('📋 Initializing smart contracts...');
        
        if (this.modules.smartContracts) {
            // Initialize contract connections
            await this.modules.smartContracts.initialize();
            
            // Setup contract event listeners
            this.modules.smartContracts.on('contract:event', (eventData) => {
                this.handleContractEvent(eventData);
            });
            
            this.modules.smartContracts.on('transaction:confirmed', (txData) => {
                this.emit('transaction:confirmed', txData);
                this.showTransactionSuccess(txData);
            });
            
            this.modules.smartContracts.on('transaction:failed', (error) => {
                this.emit('transaction:failed', error);
                this.showTransactionError(error);
            });
        }
    }

    async initializeValueGeneration() {
        console.log('💎 Initializing value generation systems...');
        
        if (this.modules.valueGeneration) {
            // Initialize staking pools
            await this.modules.valueGeneration.initializeStakingPools();
            
            // Setup value generation event listeners
            this.modules.valueGeneration.on('staking:updated', (stakingData) => {
                this.systemState.staking = stakingData;
                this.emit('staking:updated', stakingData);
                this.updateStakingUI(stakingData);
            });
            
            this.modules.valueGeneration.on('rewards:earned', (rewardData) => {
                this.emit('rewards:earned', rewardData);
                this.showRewardNotification(rewardData);
            });
            
            // Load user's staking data
            if (this.systemState.wallet.connected) {
                this.loadUserStakingData();
            }
        }
    }

    async initializeMarketplace() {
        console.log('🏪 Initializing marketplace integration...');
        
        if (this.modules.marketplaceIntegration) {
            // Initialize exchange connections
            await this.modules.marketplaceIntegration.initialize();
            
            // Setup marketplace event listeners
            this.modules.marketplaceIntegration.on('trade:executed', (tradeData) => {
                this.emit('trade:executed', tradeData);
                this.showTradeNotification(tradeData);
            });
            
            this.modules.marketplaceIntegration.on('nft:purchased', (nftData) => {
                this.systemState.nft.owned.push(nftData);
                this.emit('nft:purchased', nftData);
                this.updateNFTUI();
            });
            
            // Load NFT collections
            this.loadNFTCollections();
        }
    }

    async initializeUserExperience() {
        console.log('👤 Initializing user experience system...');
        
        if (this.modules.userExperience) {
            // Initialize UX optimizations
            await this.modules.userExperience.initialize();
            
            // Setup accessibility features
            this.modules.userExperience.setupAccessibilityFeatures();
            
            // Setup mobile optimizations
            if (this.isMobileDevice()) {
                this.modules.userExperience.enableMobileOptimizations();
            }
            
            // Setup customer support integration
            this.modules.userExperience.initializeSupport();
        }
    }

    setupModuleCommunication() {
        console.log('🔗 Setting up inter-module communication...');
        
        // Wallet connection affects all other modules
        this.on('wallet:connected', async (walletInfo) => {
            // Update smart contracts with wallet
            if (this.modules.smartContracts) {
                await this.modules.smartContracts.connectWallet(walletInfo);
            }
            
            // Load user's staking data
            if (this.modules.valueGeneration) {
                await this.loadUserStakingData();
            }
            
            // Load user's trading data
            if (this.modules.marketplaceIntegration) {
                await this.loadUserTradingData();
            }
        });
        
        // Market price updates affect trading and staking displays
        this.on('market:updated', (priceData) => {
            if (this.modules.valueGeneration) {
                this.modules.valueGeneration.updatePriceData(priceData);
            }
            
            if (this.modules.marketplaceIntegration) {
                this.modules.marketplaceIntegration.updatePriceData(priceData);
            }
        });
        
        // Transaction confirmations update all relevant displays
        this.on('transaction:confirmed', () => {
            this.refreshAllUserData();
        });
    }

    initializeUI() {
        console.log('🎨 Initializing UI components...');
        
        // Setup main navigation
        this.setupMainNavigation();
        
        // Setup wallet connection UI
        this.setupWalletUI();
        
        // Setup trading interface
        this.setupTradingUI();
        
        // Setup staking interface
        this.setupStakingUI();
        
        // Setup NFT marketplace UI
        this.setupNFTUI();
        
        // Setup accessibility controls
        this.setupAccessibilityUI();
        
        // Setup notification system
        this.setupNotificationSystem();
    }

    setupMainNavigation() {
        const navTabs = document.querySelectorAll('.crypto-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const target = tab.dataset.target;
                this.showCryptoSection(target);
            });
        });
    }

    setupWalletUI() {
        // Wallet connection buttons
        const connectButtons = document.querySelectorAll('.wallet-connect-btn');
        connectButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const walletType = button.dataset.wallet;
                try {
                    await this.connectWallet(walletType);
                } catch (error) {
                    this.showError('Failed to connect wallet: ' + error.message);
                }
            });
        });
        
        // Disconnect button
        const disconnectBtn = document.getElementById('disconnect-wallet');
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', () => {
                this.disconnectWallet();
            });
        }
    }

    setupTradingUI() {
        // Buy/Sell buttons
        const buyBtn = document.getElementById('buy-mwb-btn');
        const sellBtn = document.getElementById('sell-mwb-btn');
        
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                this.showBuyInterface();
            });
        }
        
        if (sellBtn) {
            sellBtn.addEventListener('click', () => {
                this.showSellInterface();
            });
        }
        
        // Trading form submissions
        const tradingForms = document.querySelectorAll('.trading-form');
        tradingForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTradeSubmission(form);
            });
        });
    }

    setupStakingUI() {
        // Staking buttons
        const stakeButtons = document.querySelectorAll('.stake-btn');
        stakeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const poolId = button.dataset.pool;
                this.showStakeInterface(poolId);
            });
        });
        
        // Unstaking buttons
        const unstakeButtons = document.querySelectorAll('.unstake-btn');
        unstakeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const poolId = button.dataset.pool;
                this.showUnstakeInterface(poolId);
            });
        });
        
        // Claim rewards buttons
        const claimButtons = document.querySelectorAll('.claim-rewards-btn');
        claimButtons.forEach(button => {
            button.addEventListener('click', () => {
                const poolId = button.dataset.pool;
                this.claimStakingRewards(poolId);
            });
        });
    }

    setupNFTUI() {
        // NFT purchase buttons
        const nftBuyButtons = document.querySelectorAll('.nft-buy-btn');
        nftBuyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nftId = button.dataset.nft;
                this.purchaseNFT(nftId);
            });
        });
        
        // NFT collection tabs
        const collectionTabs = document.querySelectorAll('.nft-collection-tab');
        collectionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const collection = tab.dataset.collection;
                this.showNFTCollection(collection);
            });
        });
    }

    setupAccessibilityUI() {
        // Accessibility settings
        const accessibilityToggle = document.getElementById('accessibility-toggle');
        if (accessibilityToggle) {
            accessibilityToggle.addEventListener('change', (e) => {
                this.toggleAccessibilityMode(e.target.checked);
            });
        }
        
        // Font size controls
        const fontSizeControls = document.querySelectorAll('.font-size-control');
        fontSizeControls.forEach(control => {
            control.addEventListener('click', () => {
                const action = control.dataset.action;
                this.adjustFontSize(action);
            });
        });
        
        // High contrast toggle
        const contrastToggle = document.getElementById('high-contrast-toggle');
        if (contrastToggle) {
            contrastToggle.addEventListener('change', (e) => {
                this.toggleHighContrast(e.target.checked);
            });
        }
    }

    setupNotificationSystem() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'crypto-notifications';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError('JavaScript Error', event.error);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled Promise Rejection', event.reason);
        });
        
        // Network error detection
        window.addEventListener('offline', () => {
            this.showNetworkStatus(false);
        });
        
        window.addEventListener('online', () => {
            this.showNetworkStatus(true);
        });
    }

    startBackgroundServices() {
        // Start periodic data updates
        this.startPeriodicUpdates();
        
        // Start transaction monitoring
        this.startTransactionMonitoring();
        
        // Start reward calculations
        this.startRewardCalculations();
    }

    startPeriodicUpdates() {
        // Update market data every 30 seconds
        setInterval(() => {
            if (this.modules.marketData && navigator.onLine) {
                this.modules.marketData.fetchPriceData().catch(console.warn);
            }
        }, 30000);
        
        // Update user balances every 2 minutes
        setInterval(() => {
            if (this.systemState.wallet.connected) {
                this.refreshUserBalances().catch(console.warn);
            }
        }, 120000);
    }

    startTransactionMonitoring() {
        // Monitor pending transactions
        setInterval(() => {
            if (this.modules.smartContracts) {
                this.modules.smartContracts.checkPendingTransactions().catch(console.warn);
            }
        }, 10000);
    }

    startRewardCalculations() {
        // Calculate staking rewards every minute
        setInterval(() => {
            if (this.modules.valueGeneration && this.systemState.staking.totalStaked > 0) {
                this.modules.valueGeneration.calculateRewards().catch(console.warn);
            }
        }, 60000);
    }

    async performSystemCheck() {
        console.log('🔍 Performing system health check...');
        
        const checks = [
            this.checkWalletSystem(),
            this.checkMarketData(),
            this.checkSmartContracts(),
            this.checkValueGeneration(),
            this.checkMarketplace(),
            this.checkUserExperience()
        ];
        
        const results = await Promise.allSettled(checks);
        const failures = results.filter(result => result.status === 'rejected');
        
        if (failures.length > 0) {
            console.warn(`⚠️ System check completed with ${failures.length} warnings`);
            failures.forEach((failure, index) => {
                console.warn(`Check ${index + 1} failed:`, failure.reason);
            });
        } else {
            console.log('✅ All system checks passed');
        }
    }

    async checkWalletSystem() {
        if (!this.modules.walletIntegration) {
            throw new Error('Wallet integration module not loaded');
        }
        
        const providers = await this.modules.walletIntegration.getAvailableProviders();
        if (providers.length === 0) {
            throw new Error('No wallet providers available');
        }
    }

    async checkMarketData() {
        if (!this.modules.marketData) {
            throw new Error('Market data module not loaded');
        }
        
        // Test market data fetch
        await this.modules.marketData.testConnection();
    }

    async checkSmartContracts() {
        if (!this.modules.smartContracts) {
            throw new Error('Smart contracts module not loaded');
        }
        
        // Test contract connectivity
        await this.modules.smartContracts.testConnection();
    }

    async checkValueGeneration() {
        if (!this.modules.valueGeneration) {
            throw new Error('Value generation module not loaded');
        }
        
        // Check staking pools
        const pools = await this.modules.valueGeneration.getStakingPools();
        if (pools.length === 0) {
            throw new Error('No staking pools available');
        }
    }

    async checkMarketplace() {
        if (!this.modules.marketplaceIntegration) {
            throw new Error('Marketplace integration module not loaded');
        }
        
        // Test exchange connectivity
        await this.modules.marketplaceIntegration.testExchangeConnections();
    }

    async checkUserExperience() {
        if (!this.modules.userExperience) {
            throw new Error('User experience module not loaded');
        }
        
        // Check accessibility features
        this.modules.userExperience.validateAccessibilityFeatures();
    }

    // Event system methods
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // Public API methods
    async connectWallet(walletType) {
        if (!this.modules.walletIntegration) {
            throw new Error('Wallet integration not available');
        }
        
        const walletInfo = await this.modules.walletIntegration.connectWallet(walletType);
        localStorage.setItem('mwb_last_wallet', walletType);
        return walletInfo;
    }

    async disconnectWallet() {
        if (this.modules.walletIntegration) {
            await this.modules.walletIntegration.disconnectWallet();
        }
        localStorage.removeItem('mwb_last_wallet');
    }

    async stakeTokens(poolId, amount) {
        if (!this.modules.valueGeneration) {
            throw new Error('Staking not available');
        }
        
        return await this.modules.valueGeneration.stakeTokens(poolId, amount);
    }

    async unstakeTokens(poolId, amount) {
        if (!this.modules.valueGeneration) {
            throw new Error('Staking not available');
        }
        
        return await this.modules.valueGeneration.unstakeTokens(poolId, amount);
    }

    async buyTokens(amount, paymentMethod) {
        if (!this.modules.marketplaceIntegration) {
            throw new Error('Trading not available');
        }
        
        return await this.modules.marketplaceIntegration.buyTokens(amount, paymentMethod);
    }

    async sellTokens(amount) {
        if (!this.modules.marketplaceIntegration) {
            throw new Error('Trading not available');
        }
        
        return await this.modules.marketplaceIntegration.sellTokens(amount);
    }

    // UI update methods
    updateWalletUI(walletInfo) {
        const walletDisplay = document.getElementById('wallet-display');
        if (walletDisplay) {
            if (walletInfo) {
                walletDisplay.innerHTML = `
                    <div class="wallet-connected">
                        <div class="wallet-address">${this.formatAddress(walletInfo.address)}</div>
                        <div class="wallet-balance">${walletInfo.balance} ETH</div>
                        <button id="disconnect-wallet" class="disconnect-btn">Disconnect</button>
                    </div>
                `;
            } else {
                walletDisplay.innerHTML = `
                    <div class="wallet-disconnected">
                        <p>No wallet connected</p>
                        <div class="wallet-connect-buttons">
                            <button class="wallet-connect-btn" data-wallet="metamask">MetaMask</button>
                            <button class="wallet-connect-btn" data-wallet="walletconnect">WalletConnect</button>
                            <button class="wallet-connect-btn" data-wallet="coinbase">Coinbase Wallet</button>
                        </div>
                    </div>
                `;
            }
        }
    }

    updateMarketUI(marketData) {
        const priceDisplay = document.getElementById('mwb-price');
        const changeDisplay = document.getElementById('price-change');
        
        if (priceDisplay) {
            priceDisplay.textContent = `$${marketData.price}`;
        }
        
        if (changeDisplay) {
            changeDisplay.textContent = marketData.change;
            changeDisplay.className = marketData.change.startsWith('+') ? 'positive' : 'negative';
        }
    }

    updateStakingUI(stakingData) {
        const totalStakedDisplay = document.getElementById('total-staked');
        const totalRewardsDisplay = document.getElementById('total-rewards');
        
        if (totalStakedDisplay) {
            totalStakedDisplay.textContent = `${stakingData.totalStaked} MWB`;
        }
        
        if (totalRewardsDisplay) {
            totalRewardsDisplay.textContent = `${stakingData.rewards} MWB`;
        }
    }

    updateNFTUI() {
        const nftContainer = document.getElementById('user-nfts');
        if (nftContainer) {
            nftContainer.innerHTML = this.systemState.nft.owned.map(nft => `
                <div class="nft-item">
                    <img src="${nft.image}" alt="${nft.name}">
                    <h4>${nft.name}</h4>
                    <p>${nft.description}</p>
                </div>
            `).join('');
        }
    }

    // Utility methods
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    isMobileDevice() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    showLoadingIndicator() {
        const loading = document.getElementById('crypto-loading') || this.createLoadingIndicator();
        loading.style.display = 'flex';
    }

    hideLoadingIndicator() {
        const loading = document.getElementById('crypto-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    createLoadingIndicator() {
        const loading = document.createElement('div');
        loading.id = 'crypto-loading';
        loading.className = 'crypto-loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>Initializing Mac Wayne Crypto System...</p>
            </div>
        `;
        document.body.appendChild(loading);
        return loading;
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('crypto-notifications');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            notification.remove();
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
    }

    showError(message) {
        this.showNotification(message, 'error');
        console.error('Crypto System Error:', message);
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    handleError(type, error) {
        this.errorCount++;
        console.error(`${type}:`, error);
        
        if (this.errorCount > this.maxErrors) {
            this.showError('Multiple errors detected. Please refresh the page.');
        } else {
            this.showError(`${type}: ${error.message}`);
        }
    }

    handleInitializationError(error) {
        this.hideLoadingIndicator();
        
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'crypto-init-error';
        errorDisplay.innerHTML = `
            <div class="error-content">
                <h3>⚠️ Cryptocurrency System Initialization Failed</h3>
                <p>The Mac Wayne crypto system failed to initialize properly.</p>
                <p><strong>Error:</strong> ${error.message}</p>
                <div class="error-actions">
                    <button onclick="location.reload()">Retry</button>
                    <button onclick="this.closest('.crypto-init-error').style.display='none'">Continue without Crypto</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorDisplay);
    }

    // Async helper methods
    async refreshAllUserData() {
        if (!this.systemState.wallet.connected) return;
        
        const promises = [];
        
        if (this.modules.walletIntegration) {
            promises.push(this.refreshUserBalances());
        }
        
        if (this.modules.valueGeneration) {
            promises.push(this.loadUserStakingData());
        }
        
        if (this.modules.marketplaceIntegration) {
            promises.push(this.loadUserTradingData());
        }
        
        await Promise.allSettled(promises);
    }

    async refreshUserBalances() {
        const balances = await this.modules.walletIntegration.getBalances();
        this.systemState.wallet.balance = balances.eth;
        this.updateWalletUI(this.systemState.wallet);
    }

    async loadUserStakingData() {
        const stakingData = await this.modules.valueGeneration.getUserStakingData();
        this.systemState.staking = stakingData;
        this.updateStakingUI(stakingData);
    }

    async loadUserTradingData() {
        const tradingData = await this.modules.marketplaceIntegration.getUserTradingData();
        this.systemState.trading = tradingData;
    }

    async loadNFTCollections() {
        const collections = await this.modules.marketplaceIntegration.getNFTCollections();
        this.systemState.nft.collections = collections;
    }

    // Getter for system status
    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            errors: this.errorCount,
            state: this.systemState,
            modules: Object.keys(this.modules)
        };
    }
}

// Global initialization
let cryptoMasterController;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        cryptoMasterController = new CryptoMasterController();
        await cryptoMasterController.initialize();
        
        // Make controller globally available
        window.cryptoSystem = cryptoMasterController;
        
        console.log('🎉 Mac Wayne Crypto System ready!');
    } catch (error) {
        console.error('🚨 Failed to initialize crypto system:', error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoMasterController;
}
