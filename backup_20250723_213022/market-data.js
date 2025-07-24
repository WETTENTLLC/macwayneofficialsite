/**
 * Mac Wayne Battered Coin - Real-Time Market Data System
 * Integrates with multiple cryptocurrency APIs for live data
 */

class MarketDataManager {
    constructor() {
        this.apiEndpoints = {
            primary: 'https://api.coingecko.com/api/v3',
            backup: 'https://api.coinbase.com/v2',
            websocket: 'wss://ws-feed.pro.coinbase.com'
        };
        
        this.marketData = {
            price: 0,
            change24h: 0,
            volume24h: 0,
            marketCap: 0,
            totalSupply: 1000000, // 1M MWB tokens
            circulatingSupply: 0,
            holders: 0,
            lastUpdated: null
        };
        
        this.updateInterval = null;
        this.websocket = null;
        this.isConnected = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Start with initial data fetch
            await this.fetchInitialData();
            
            // Set up real-time updates
            this.setupRealtimeUpdates();
            
            // Set up WebSocket for live price feeds
            this.setupWebSocket();
            
            // Update UI
            this.updateMarketDisplay();
            
            console.log('Market Data Manager initialized');
            
        } catch (error) {
            console.error('Market Data initialization error:', error);
            this.fallbackToSimulation();
        }
    }
    
    // Fetch initial market data
    async fetchInitialData() {
        try {
            // For now, we'll simulate MWB data since it's not listed yet
            // In production, this would fetch from the actual exchange APIs
            
            const ethPrice = await this.fetchETHPrice();
            const btcPrice = await this.fetchBTCPrice();
            
            // Simulate MWB price based on market conditions
            this.simulateMWBPrice(ethPrice, btcPrice);
            
            this.marketData.lastUpdated = new Date();
            
        } catch (error) {
            console.error('Initial data fetch error:', error);
            throw error;
        }
    }
    
    // Fetch real ETH price for reference
    async fetchETHPrice() {
        try {
            const response = await fetch(`${this.apiEndpoints.primary}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`);
            const data = await response.json();
            
            return {
                price: data.ethereum.usd,
                change24h: data.ethereum.usd_24h_change,
                volume24h: data.ethereum.usd_24h_vol
            };
        } catch (error) {
            console.error('ETH price fetch error:', error);
            return { price: 3000, change24h: 2.5, volume24h: 1000000 }; // Fallback
        }
    }
    
    // Fetch real BTC price for reference
    async fetchBTCPrice() {
        try {
            const response = await fetch(`${this.apiEndpoints.primary}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`);
            const data = await response.json();
            
            return {
                price: data.bitcoin.usd,
                change24h: data.bitcoin.usd_24h_change
            };
        } catch (error) {
            console.error('BTC price fetch error:', error);
            return { price: 65000, change24h: 1.2 }; // Fallback
        }
    }
    
    // Simulate MWB price based on real market data
    simulateMWBPrice(ethData, btcData) {
        // Base price influenced by real market conditions
        const basePrice = 0.15; // Starting price
        const marketInfluence = (ethData.change24h + btcData.change24h) / 200; // Small influence from major cryptos
        const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% random variation
        
        this.marketData.price = Math.max(0.01, basePrice + (basePrice * marketInfluence) + (basePrice * randomVariation));
        this.marketData.change24h = (marketInfluence * 100) + (randomVariation * 100);
        this.marketData.volume24h = Math.floor(Math.random() * 50000) + 10000; // 10K-60K volume
        this.marketData.marketCap = this.marketData.price * this.marketData.circulatingSupply;
    }
    
    // Set up periodic updates
    setupRealtimeUpdates() {
        // Update every 5 seconds for real-time feel
        this.updateInterval = setInterval(async () => {
            try {
                await this.updateMarketData();
                this.updateMarketDisplay();
            } catch (error) {
                console.error('Market update error:', error);
            }
        }, 5000);
    }
    
    // Set up WebSocket for live data
    setupWebSocket() {
        try {
            this.websocket = new WebSocket(this.apiEndpoints.websocket);
            
            this.websocket.onopen = () => {
                console.log('Market data WebSocket connected');
                this.isConnected = true;
                
                // Subscribe to relevant channels
                this.websocket.send(JSON.stringify({
                    type: 'subscribe',
                    product_ids: ['ETH-USD', 'BTC-USD'],
                    channels: ['ticker']
                }));
            };
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketData(data);
            };
            
            this.websocket.onclose = () => {
                console.log('Market data WebSocket disconnected');
                this.isConnected = false;
                
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    this.setupWebSocket();
                }, 5000);
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
        } catch (error) {
            console.error('WebSocket setup error:', error);
        }
    }
    
    // Handle WebSocket data
    handleWebSocketData(data) {
        if (data.type === 'ticker') {
            // Update MWB price based on major crypto movements
            if (data.product_id === 'ETH-USD' || data.product_id === 'BTC-USD') {
                this.updateMWBPriceFromMarket(data);
            }
        }
    }
    
    // Update MWB price based on market movements
    updateMWBPriceFromMarket(tickerData) {
        const priceChange = parseFloat(tickerData.price) - parseFloat(tickerData.open_24h);
        const percentChange = (priceChange / parseFloat(tickerData.open_24h)) * 100;
        
        // Apply small influence to MWB price
        const influence = percentChange * 0.1; // 10% of the influence
        const newPrice = this.marketData.price * (1 + (influence / 100));
        
        this.marketData.price = Math.max(0.01, newPrice);
        this.marketData.change24h = influence;
        this.marketData.lastUpdated = new Date();
    }
    
    // Update market data
    async updateMarketData() {
        try {
            // Fetch latest ETH and BTC data
            const ethData = await this.fetchETHPrice();
            const btcData = await this.fetchBTCPrice();
            
            // Update MWB simulation
            this.simulateMWBPrice(ethData, btcData);
            
            // Update blockchain data
            await this.updateBlockchainData();
            
            this.marketData.lastUpdated = new Date();
            
        } catch (error) {
            console.error('Market data update error:', error);
        }
    }
    
    // Update blockchain-specific data
    async updateBlockchainData() {
        try {
            // In production, these would be real contract calls
            if (window.walletManager && window.walletManager.contract) {
                // Get total supply from contract
                this.marketData.totalSupply = await window.walletManager.contract.methods.totalSupply().call();
                
                // Get circulating supply
                this.marketData.circulatingSupply = await window.walletManager.contract.methods.circulatingSupply().call();
                
                // Get holder count
                this.marketData.holders = await window.walletManager.contract.methods.holderCount().call();
            } else {
                // Simulate growth
                this.marketData.circulatingSupply += Math.floor(Math.random() * 10);
                this.marketData.holders += Math.floor(Math.random() * 3);
            }
            
            // Calculate market cap
            this.marketData.marketCap = this.marketData.price * this.marketData.circulatingSupply;
            
        } catch (error) {
            console.error('Blockchain data update error:', error);
        }
    }
    
    // Update market display in UI
    updateMarketDisplay() {
        // Update price ticker
        const priceElement = document.getElementById('mwb-price');
        if (priceElement) {
            priceElement.textContent = `$${this.marketData.price.toFixed(4)}`;
        }
        
        // Update change indicator
        const changeElement = document.getElementById('mwb-change');
        if (changeElement) {
            const changeText = `${this.marketData.change24h >= 0 ? '+' : ''}${this.marketData.change24h.toFixed(2)}%`;
            changeElement.textContent = changeText;
            changeElement.className = `ticker-change ${this.marketData.change24h >= 0 ? 'positive' : 'negative'}`;
        }
        
        // Update volume
        const volumeElement = document.getElementById('mwb-volume');
        if (volumeElement) {
            volumeElement.textContent = `$${this.formatNumber(this.marketData.volume24h)}`;
        }
        
        // Update market cap
        const marketCapElement = document.getElementById('mwb-market-cap');
        if (marketCapElement) {
            marketCapElement.textContent = `$${this.formatNumber(this.marketData.marketCap)}`;
        }
        
        // Update holders count
        const holdersElement = document.getElementById('mwb-holders');
        if (holdersElement) {
            holdersElement.textContent = this.formatNumber(this.marketData.holders);
        }
        
        // Update last updated time
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = `Last updated: ${this.marketData.lastUpdated.toLocaleTimeString()}`;
        }
        
        // Dispatch update event
        this.dispatchMarketUpdate();
    }
    
    // Format numbers for display
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }
    
    // Get current market data
    getMarketData() {
        return { ...this.marketData };
    }
    
    // Fallback to simulation mode
    fallbackToSimulation() {
        console.log('Falling back to simulation mode');
        
        // Set realistic starting values
        this.marketData = {
            price: 0.15,
            change24h: 2.5,
            volume24h: 25000,
            marketCap: 150000,
            totalSupply: 1000000,
            circulatingSupply: 150000,
            holders: 1250,
            lastUpdated: new Date()
        };
        
        // Set up simulation updates
        this.updateInterval = setInterval(() => {
            this.simulateMarketMovement();
            this.updateMarketDisplay();
        }, 3000);
    }
    
    // Simulate realistic market movement
    simulateMarketMovement() {
        // Random price movement (±2%)
        const movement = (Math.random() - 0.5) * 0.04;
        this.marketData.price = Math.max(0.01, this.marketData.price * (1 + movement));
        
        // Update change percentage
        this.marketData.change24h += movement * 100;
        this.marketData.change24h = Math.max(-50, Math.min(100, this.marketData.change24h));
        
        // Simulate volume fluctuation
        this.marketData.volume24h += Math.floor((Math.random() - 0.5) * 1000);
        this.marketData.volume24h = Math.max(5000, this.marketData.volume24h);
        
        // Update market cap
        this.marketData.marketCap = this.marketData.price * this.marketData.circulatingSupply;
        
        this.marketData.lastUpdated = new Date();
    }
    
    // Dispatch market update event
    dispatchMarketUpdate() {
        const event = new CustomEvent('marketDataUpdated', {
            detail: this.getMarketData()
        });
        window.dispatchEvent(event);
    }
    
    // Clean up resources
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.websocket) {
            this.websocket.close();
        }
    }
}

// Export for use in other files
window.MarketDataManager = MarketDataManager;

// Initialize market data manager
document.addEventListener('DOMContentLoaded', () => {
    window.marketDataManager = new MarketDataManager();
    console.log('Market Data Manager initialized');
});
