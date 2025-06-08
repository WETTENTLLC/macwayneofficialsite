/**
 * Mac Wayne Battered Coin - Wallet Integration System
 * Supports MetaMask, Trust Wallet, WalletConnect, and other major wallets
 */

class WalletManager {
    constructor() {
        this.currentWallet = null;
        this.web3 = null;
        this.contract = null;
        this.userAddress = null;
        this.isConnected = false;
        
        // Contract configuration
        this.contractAddress = '0x...'; // To be deployed
        this.contractABI = [
            // Smart contract ABI will be added after deployment
        ];
        
        this.supportedWallets = {
            metamask: {
                name: 'MetaMask',
                icon: '🦊',
                detected: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
            },
            trustwallet: {
                name: 'Trust Wallet',
                icon: '🛡️',
                detected: () => typeof window.ethereum !== 'undefined' && window.ethereum.isTrust
            },
            walletconnect: {
                name: 'WalletConnect',
                icon: '🔗',
                detected: () => true // WalletConnect works universally
            },
            coinbase: {
                name: 'Coinbase Wallet',
                icon: '💎',
                detected: () => typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet
            }
        };
        
        this.init();
    }
    
    async init() {
        // Check for previously connected wallet
        const savedWallet = localStorage.getItem('mwb_connected_wallet');
        if (savedWallet) {
            await this.connectWallet(savedWallet);
        }
        
        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
            window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
            window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
        }
        
        this.updateWalletDisplay();
    }
    
    // Detect available wallets
    getAvailableWallets() {
        return Object.entries(this.supportedWallets)
            .filter(([, wallet]) => wallet.detected())
            .map(([key, wallet]) => ({ key, ...wallet }));
    }
    
    // Connect to specific wallet
    async connectWallet(walletType = 'metamask') {
        try {
            let provider;
            
            switch (walletType) {
                case 'metamask':
                    provider = await this.connectMetaMask();
                    break;
                case 'trustwallet':
                    provider = await this.connectTrustWallet();
                    break;
                case 'walletconnect':
                    provider = await this.connectWalletConnect();
                    break;
                case 'coinbase':
                    provider = await this.connectCoinbaseWallet();
                    break;
                default:
                    throw new Error('Unsupported wallet type');
            }
            
            if (provider) {
                this.web3 = new Web3(provider);
                this.currentWallet = walletType;
                
                // Get user accounts
                const accounts = await this.web3.eth.getAccounts();
                if (accounts.length > 0) {
                    this.userAddress = accounts[0];
                    this.isConnected = true;
                    
                    // Save connection preference
                    localStorage.setItem('mwb_connected_wallet', walletType);
                    localStorage.setItem('mwb_user_address', this.userAddress);
                    
                    // Initialize contract
                    await this.initializeContract();
                    
                    // Update UI
                    this.updateWalletDisplay();
                    
                    // Trigger connected event
                    this.dispatchEvent('walletConnected', {
                        wallet: walletType,
                        address: this.userAddress
                    });
                    
                    return true;
                }
            }
            
            throw new Error('Failed to connect wallet');
            
        } catch (error) {
            console.error('Wallet connection error:', error);
            this.showNotification('Failed to connect wallet: ' + error.message, 'error');
            return false;
        }
    }
    
    // MetaMask connection
    async connectMetaMask() {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask not detected. Please install MetaMask.');
        }
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return window.ethereum;
    }
    
    // Trust Wallet connection
    async connectTrustWallet() {
        if (!window.ethereum || !window.ethereum.isTrust) {
            throw new Error('Trust Wallet not detected. Please install Trust Wallet.');
        }
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return window.ethereum;
    }
    
    // WalletConnect integration
    async connectWalletConnect() {
        // Import WalletConnect dynamically
        const WalletConnect = (await import('@walletconnect/client')).default;
        const QRCodeModal = (await import('@walletconnect/qrcode-modal')).default;
        
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
        });
        
        if (!connector.connected) {
            await connector.createSession();
        }
        
        return connector;
    }
    
    // Coinbase Wallet connection
    async connectCoinbaseWallet() {
        if (!window.ethereum || !window.ethereum.isCoinbaseWallet) {
            throw new Error('Coinbase Wallet not detected. Please install Coinbase Wallet.');
        }
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return window.ethereum;
    }
    
    // Initialize smart contract
    async initializeContract() {
        if (!this.web3 || !this.contractAddress) return;
        
        try {
            this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
            console.log('Smart contract initialized');
        } catch (error) {
            console.error('Contract initialization error:', error);
        }
    }
    
    // Disconnect wallet
    async disconnect() {
        this.currentWallet = null;
        this.web3 = null;
        this.contract = null;
        this.userAddress = null;
        this.isConnected = false;
        
        // Clear storage
        localStorage.removeItem('mwb_connected_wallet');
        localStorage.removeItem('mwb_user_address');
        
        // Update UI
        this.updateWalletDisplay();
        
        // Trigger disconnected event
        this.dispatchEvent('walletDisconnected');
        
        this.showNotification('Wallet disconnected', 'info');
    }
    
    // Get wallet balance
    async getBalance() {
        if (!this.web3 || !this.userAddress) return '0';
        
        try {
            const balance = await this.web3.eth.getBalance(this.userAddress);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Balance fetch error:', error);
            return '0';
        }
    }
    
    // Get MWB token balance
    async getMWBBalance() {
        if (!this.contract || !this.userAddress) return '0';
        
        try {
            const balance = await this.contract.methods.balanceOf(this.userAddress).call();
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('MWB balance fetch error:', error);
            return '0';
        }
    }
    
    // Purchase MWB tokens
    async purchaseTokens(amount, paymentMethod = 'ETH') {
        if (!this.contract || !this.userAddress) {
            throw new Error('Wallet not connected');
        }
        
        // Validate payment method
        if (paymentMethod !== 'ETH') {
            throw new Error('Currently only ETH payment method is supported');
        }
        
        try {
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            const transaction = await this.contract.methods.buyTokens()
                .send({
                    from: this.userAddress,
                    value: amountWei,
                    gas: 200000
                });
            
            this.showNotification('Purchase successful!', 'success');
            return transaction;
            
        } catch (error) {
            console.error('Purchase error:', error);
            this.showNotification('Purchase failed: ' + error.message, 'error');
            throw error;
        }
    }
    
    // Stake tokens
    async stakeTokens(amount, duration) {
        if (!this.contract || !this.userAddress) {
            throw new Error('Wallet not connected');
        }
        
        try {
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            const transaction = await this.contract.methods.stake(amountWei, duration)
                .send({
                    from: this.userAddress,
                    gas: 150000
                });
            
            this.showNotification('Tokens staked successfully!', 'success');
            return transaction;
            
        } catch (error) {
            console.error('Staking error:', error);
            this.showNotification('Staking failed: ' + error.message, 'error');
            throw error;
        }
    }
    
    // Event handlers
    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.disconnect();
        } else if (accounts[0] !== this.userAddress) {
            this.userAddress = accounts[0];
            localStorage.setItem('mwb_user_address', this.userAddress);
            this.updateWalletDisplay();
            this.dispatchEvent('accountChanged', { address: this.userAddress });
        }
    }
    
    handleChainChanged(chainId) {
        console.log(`Network chain changed to: ${chainId}`);
        // Reload the page to reset the dapp state
        window.location.reload();
    }
    
    handleDisconnect() {
        this.disconnect();
    }
    
    // Update wallet display in UI
    updateWalletDisplay() {
        const connectButton = document.getElementById('wallet-connect-btn');
        const walletInfo = document.getElementById('wallet-info');
        const addressDisplay = document.getElementById('wallet-address');
        const balanceDisplay = document.getElementById('wallet-balance');
        
        if (this.isConnected) {
            if (connectButton) connectButton.style.display = 'none';
            if (walletInfo) walletInfo.style.display = 'block';
            if (addressDisplay) {
                addressDisplay.textContent = this.formatAddress(this.userAddress);
            }
            
            // Update balance
            this.getBalance().then(balance => {
                if (balanceDisplay) {
                    balanceDisplay.textContent = `${parseFloat(balance).toFixed(4)} ETH`;
                }
            });
            
        } else {
            if (connectButton) connectButton.style.display = 'block';
            if (walletInfo) walletInfo.style.display = 'none';
        }
    }
    
    // Format wallet address for display
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `wallet-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Dispatch custom events
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(`wallet_${eventName}`, { detail: data });
        window.dispatchEvent(event);
    }
}

// Export for use in other files
window.WalletManager = WalletManager;

// Initialize wallet manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.walletManager = new WalletManager();
    console.log('Wallet Manager initialized');
});
