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
        this.targetNetwork = { // Configuration for the target network
            id: '0x1', // Ethereum Mainnet (hexadecimal)
            name: 'Ethereum Mainnet',
            rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', // Replace with your Infura Project ID or other RPC URL
            explorerUrl: 'https://etherscan.io' // Optional: Block explorer
        };
        
        // Contract configuration
        this.contractAddress = '0x...'; // To be deployed
        this.contractABI = [
            // Smart contract ABI will be added after deployment
            // Example: { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" },
            // { "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }
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
                detected: () => typeof window.ethereum !== 'undefined' && (window.ethereum.isTrust || window.ethereum.isTrustWallet)
            },
            walletconnect: {
                name: 'WalletConnect',
                icon: '🔗',
                // WalletConnect needs to be initialized to be "detected" in a functional sense
                detected: () => true 
            },
            coinbase: {
                name: 'Coinbase Wallet',
                icon: '💎',
                detected: () => typeof window.ethereum !== 'undefined' && (window.ethereum.isCoinbaseWallet || (window.ethereum.providers && window.ethereum.providers.find(p => p.isCoinbaseWallet)))
            }
        };
        
        // Ensure this.init() is called after the DOM is ready if it interacts with UI elements early.
        // For now, direct call is fine as initial UI updates are guarded.
        this.init();
    }
    
    async init() {
        const savedWallet = localStorage.getItem('mwb_connected_wallet');
        if (savedWallet) {
            // Attempt to reconnect, but don't block initialization if it fails
            // Ensure UI is updated regardless of auto-connection success
            this.connectWallet(savedWallet).catch(error => {
                console.warn("Failed to auto-reconnect wallet:", error.message);
                localStorage.removeItem('mwb_connected_wallet');
                localStorage.removeItem('mwb_user_address');
            }).finally(() => {
                 this.updateWalletDisplay(); // Always update display after attempt
            });
        } else {
            this.updateWalletDisplay(); // Update display if no saved wallet
        }
        
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
            window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
            window.ethereum.on('disconnect', this.handleDisconnect.bind(this)); // For MetaMask specific disconnect
        }
    }
    
    getAvailableWallets() {
        return Object.entries(this.supportedWallets)
            .filter(([key, wallet]) => wallet.detected())
            .map(([key, wallet]) => ({ key, ...wallet }));
    }
    
    async connectWallet(walletType = 'metamask') {
        try {
            let provider;
            let externalProviderUsed = false; // Flag for WalletConnect or similar that don't use window.ethereum directly for session
            
            if (!this.supportedWallets[walletType] || !this.supportedWallets[walletType].detected()) {
                 if (walletType === 'walletconnect') {
                    // WalletConnect doesn't rely on window.ethereum detection in the same way
                 } else {
                    this.showNotification(`${this.supportedWallets[walletType]?.name || walletType} not detected. Please install it or choose another wallet.`, 'error');
                    throw new Error(`${this.supportedWallets[walletType]?.name || walletType} not detected.`);
                 }
            }

            switch (walletType) {
                case 'metamask':
                    provider = await this.connectMetaMask();
                    break;
                case 'trustwallet':
                    provider = await this.connectTrustWallet();
                    break;
                case 'walletconnect':
                    provider = await this.connectWalletConnect();
                    externalProviderUsed = true;
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

                if (!externalProviderUsed && !(await this.checkNetwork())) {
                    // For providers like MetaMask, checkNetwork handles notifications and switch attempts.
                    // If checkNetwork returns false, it means user is on wrong network and didn't switch.
                    // We throw an error here to stop the connection process.
                    throw new Error(`Please switch to ${this.targetNetwork.name}.`);
                }
                
                const accounts = await this.web3.eth.getAccounts();
                if (accounts.length > 0) {
                    this.userAddress = accounts[0];
                    this.isConnected = true;
                    
                    localStorage.setItem('mwb_connected_wallet', walletType);
                    localStorage.setItem('mwb_user_address', this.userAddress);
                    
                    await this.initializeContract();
                    this.updateWalletDisplay();
                    this.dispatchEvent('walletConnected', {
                        wallet: walletType,
                        address: this.userAddress
                    });
                    this.showNotification(`${this.supportedWallets[walletType].name} connected successfully!`, 'success');
                    return true;
                } else {
                    throw new Error('No accounts found. Please ensure your wallet is unlocked and permissions are granted.');
                }
            }
            throw new Error(`Failed to get provider for ${this.supportedWallets[walletType]?.name || walletType}.`);
        } catch (error) {
            console.error(`Wallet connection error (${walletType}):`, error);
            let userMessage = 'Failed to connect wallet.';
            if (error.message.includes("User rejected the request") || error.code === 4001) {
                userMessage = "Connection request denied. Please try again.";
            } else if (error.message.includes("not detected")) {
                userMessage = error.message; // Use the specific "not detected" message
            } else if (error.message.includes("wrong network") || error.message.includes("Please switch to")) {
                userMessage = error.message; 
            } else if (error.message.includes("No accounts found")) {
                userMessage = error.message;
            } else if (error.message.includes("Modal closed by user")) {
                userMessage = "WalletConnect modal closed. Please try again.";
            }
            
            this.showNotification(userMessage, 'error');
            await this.disconnect(); // Ensure clean state on failure
            return false;
        }
    }
    
    async connectMetaMask() {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error('MetaMask not detected. Please install MetaMask.');
        }
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Network check will be done in connectWallet after provider is set
            return window.ethereum;
        } catch (error) {
            if (error.code === 4001) { // EIP-1193 userRejectedRequest error
                throw new Error('User rejected the request.');
            }
            throw new Error('Could not connect to MetaMask: ' + error.message);
        }
    }

    async connectTrustWallet() {
        const provider = window.ethereum; // Trust Wallet typically uses window.ethereum
        if (!provider || !(provider.isTrust || provider.isTrustWallet)) {
             throw new Error('Trust Wallet not detected. Please use the Trust Wallet app.');
        }
        try {
            await provider.request({ method: 'eth_requestAccounts' });
            return provider;
        } catch (error) {
            if (error.code === 4001) {
                throw new Error('User rejected the request.');
            }
            throw new Error('Could not connect to Trust Wallet: ' + error.message);
        }
    }
    
    async connectCoinbaseWallet() {
        let provider = window.ethereum;
        // Coinbase Wallet might inject itself as window.ethereum or within window.ethereum.providers
        if (provider && provider.providers && Array.isArray(provider.providers)) {
            provider = provider.providers.find(p => p.isCoinbaseWallet) || provider.providers.find(p => p.isMetaMask === false); // Fallback if multiple providers
        }
        if (!provider || !provider.isCoinbaseWallet) {
             // Try the specific SDK if available (requires separate import/setup)
             // For now, rely on window.ethereum injection
            throw new Error('Coinbase Wallet not detected. Please install Coinbase Wallet.');
        }
        try {
            await provider.request({ method: 'eth_requestAccounts' });
            return provider;
        } catch (error) {
            if (error.code === 4001) {
                throw new Error('User rejected the request.');
            }
            throw new Error('Could not connect to Coinbase Wallet: ' + error.message);
        }
    }

    async connectWalletConnect() {
        try {
            // Dynamically import WalletConnect and QRCodeModal
            const { WalletConnectModal } = await import('@walletconnect/modal');
            const { WalletConnectConnector } = await import('@walletconnect/web3-provider');


            const connector = new WalletConnectConnector({
                rpc: { [parseInt(this.targetNetwork.id, 16)]: this.targetNetwork.rpcUrl }, // e.g. { 1: "https://mainnet.mycustomrpc.com" }
                bridge: "https://bridge.walletconnect.org",
                qrcodeModal: new WalletConnectModal({
                    // Required: Your WalletConnect Cloud project ID
                    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // REPLACE THIS
                    // Optional: Chains for WalletConnect modal, should include your target network
                    chains: [`eip155:${parseInt(this.targetNetwork.id, 16)}`]
                }),
            });

            await connector.enable(); // This will open the QR code modal

            // Check if connected to the correct network
            if (connector.chainId !== parseInt(this.targetNetwork.id, 16)) {
                this.showNotification(`WalletConnect connected, but you are on network ID ${connector.chainId}. Please switch to ${this.targetNetwork.name} (ID: ${parseInt(this.targetNetwork.id, 16)}) in your wallet.`, 'warning');
                // WalletConnect v1 doesn't have a programmatic switch post-connection easily.
                // For v2 (using @web3modal/ethereum), this is handled better.
                // For now, we notify and proceed, or could throw an error.
            }
            
            // WalletConnect provider events (optional, for more robust handling)
            connector.on("accountsChanged", (accounts) => this.handleAccountsChanged(accounts));
            connector.on("chainChanged", (chainId) => this.handleChainChanged(Web3.utils.toHex(chainId))); // Ensure hex format
            connector.on("disconnect", (code, reason) => {
                console.log("WalletConnect disconnected:", code, reason);
                this.handleDisconnect();
            });

            return connector;
        } catch (error) {
            console.error("WalletConnect connection error:", error);
            if (error.message && error.message.toLowerCase().includes("modal closed by user")) {
                 throw new Error("Modal closed by user.");
            }
            throw new Error("Could not connect with WalletConnect: " + error.message);
        }
    }
    
    async checkNetwork() {
        if (!this.web3 || !this.web3.currentProvider || typeof this.web3.currentProvider.request !== 'function') {
            console.warn("Web3 provider not available or does not support request method for network check.");
            // For WalletConnect or other providers that manage network internally, this might be less critical
            // or handled differently. Assume true if no standard ethereum.request.
            return this.currentWallet === 'walletconnect' ? true : false; 
        }
        try {
            const currentChainId = await this.web3.currentProvider.request({ method: 'eth_chainId' });
            
            if (currentChainId !== this.targetNetwork.id) {
                this.showNotification(`Incorrect Network. Please switch to ${this.targetNetwork.name}. Your current network ID is ${currentChainId}.`, 'warning');
                try {
                    await this.web3.currentProvider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: this.targetNetwork.id }],
                    });
                    // Re-check chainId after switch attempt
                    const newChainId = await this.web3.currentProvider.request({ method: 'eth_chainId' });
                    if (newChainId === this.targetNetwork.id) {
                        this.showNotification(`Switched to ${this.targetNetwork.name}.`, 'success');
                        return true;
                    } else {
                        this.showNotification(`Failed to switch to ${this.targetNetwork.name}. Please switch manually in your wallet.`, 'error');
                        return false;
                    }
                } catch (switchError) {
                    if (switchError.code === 4902) { // Chain not added
                        this.showNotification(`${this.targetNetwork.name} not found in your wallet. Attempting to add it.`, 'info');
                        try {
                            await this.web3.currentProvider.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: this.targetNetwork.id,
                                    chainName: this.targetNetwork.name,
                                    rpcUrls: [this.targetNetwork.rpcUrl],
                                    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, // Example, adjust if not ETH mainnet
                                    blockExplorerUrls: this.targetNetwork.explorerUrl ? [this.targetNetwork.explorerUrl] : null
                                }],
                            });
                            const newChainId = await this.web3.currentProvider.request({ method: 'eth_chainId' });
                            if (newChainId === this.targetNetwork.id) {
                                this.showNotification(`${this.targetNetwork.name} added and switched.`, 'success');
                                return true;
                            } else {
                                 this.showNotification(`Failed to add or switch to ${this.targetNetwork.name}. Please do it manually.`, 'error');
                                return false;
                            }
                        } catch (addError) {
                            console.error('Failed to add new network:', addError);
                            this.showNotification(`Could not add ${this.targetNetwork.name}. Please add it manually.`, 'error');
                            return false;
                        }
                    } else if (switchError.code === 4001) { // User rejected switch
                        this.showNotification(`Network switch to ${this.targetNetwork.name} rejected. Please switch manually.`, 'warning');
                        return false;
                    }
                    console.error('Failed to switch network:', switchError);
                    this.showNotification(`Could not switch to ${this.targetNetwork.name}. Please do it manually.`, 'error');
                    return false;
                }
            }
            return true; // Already on the correct network
        } catch (error) {
            console.error('Error checking/switching network:', error);
            this.showNotification('Could not verify network status. Please check your wallet connection and refresh.', 'error');
            return false;
        }
    }
    
    async initializeContract() {
        if (!this.web3 || !this.contractAddress || !this.contractABI || this.contractABI.length === 0) {
            console.warn('Web3, contract address, or ABI not set. Contract not initialized.');
            // this.showNotification('Contract information missing. Functionality may be limited.', 'warning');
            return;
        }
        // Ensure user is on the correct network before initializing contract related features
        if (this.web3.currentProvider && typeof this.web3.currentProvider.request === 'function') { // Check if standard provider
            const networkOk = await this.checkNetwork();
            if (!networkOk) {
                this.showNotification(`Cannot initialize contract features. Please connect to ${this.targetNetwork.name}.`, 'error');
                this.contract = null; // Ensure contract is not used if network is wrong
                return;
            }
        }

        try {
            this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
            console.log('Smart contract initialized at address:', this.contractAddress);
            this.dispatchEvent('contractInitialized', { address: this.contractAddress });
        } catch (error) {
            console.error('Contract initialization error:', error);
            this.showNotification('Failed to initialize smart contract. Some features may not work.', 'error');
            this.contract = null;
        }
    }
    
    async disconnect() {
        // For WalletConnect, explicitly close the session if possible
        if (this.currentWallet === 'walletconnect' && this.web3 && this.web3.currentProvider && typeof this.web3.currentProvider.close === 'function') {
            try {
                await this.web3.currentProvider.close(); // For WalletConnect v1 or similar
            } catch (e) {
                console.warn("Error during WalletConnect disconnect:", e);
            }
        }
         if (this.currentWallet === 'walletconnect' && this.web3 && this.web3.currentProvider && typeof this.web3.currentProvider.disconnect === 'function') {
            try {
                await this.web3.currentProvider.disconnect(); // For newer WalletConnect/Web3Modal providers
            } catch (e) {
                console.warn("Error during WalletConnect provider disconnect:", e);
            }
        }


        this.currentWallet = null;
        this.web3 = null;
        this.contract = null;
        this.userAddress = null;
        this.isConnected = false;
        
        localStorage.removeItem('mwb_connected_wallet');
        localStorage.removeItem('mwb_user_address');
        
        this.updateWalletDisplay();
        this.dispatchEvent('walletDisconnected');
        this.showNotification('Wallet disconnected', 'info');
        console.log('Wallet disconnected');
    }
    
    async getBalance() {
        if (!this.web3 || !this.userAddress || !this.isConnected) {
            // this.showNotification('Connect wallet to see balance.', 'info');
            return '0';
        }
        if (!(await this.checkNetwork())) return '0'; // Ensure correct network

        try {
            const balance = await this.web3.eth.getBalance(this.userAddress);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Balance fetch error:', error);
            this.showNotification('Could not fetch ETH balance.', 'error');
            return '0';
        }
    }
    
    async getMWBBalance() {
        if (!this.contract || !this.userAddress || !this.isConnected) {
            // this.showNotification('Connect wallet and initialize contract to see token balance.', 'info');
            return '0';
        }
        if (!(await this.checkNetwork())) return '0'; // Ensure correct network

        try {
            // Ensure the balanceOf method exists in your ABI
            if (typeof this.contract.methods.balanceOf !== 'function') {
                console.warn("balanceOf method not found on contract ABI.");
                return '0';
            }
            const balance = await this.contract.methods.balanceOf(this.userAddress).call();
            return this.web3.utils.fromWei(balance, 'ether'); // Assuming MWB also has 18 decimals
        } catch (error) {
            console.error('MWB balance fetch error:', error);
            this.showNotification('Could not fetch MWB token balance.', 'error');
            return '0';
        }
    }
    
    async purchaseTokens(amount, paymentMethod = 'ETH') {
        if (!this.contract || !this.userAddress || !this.isConnected) {
            this.showNotification('Please connect your wallet to purchase tokens.', 'error');
            throw new Error('Wallet not connected or contract not initialized.');
        }
        if (!(await this.checkNetwork())) {
             throw new Error(`Purchase failed: Please switch to ${this.targetNetwork.name}.`);
        }
        if (typeof this.contract.methods.buyTokens !== 'function') {
            this.showNotification('buyTokens function not available on the smart contract.', 'error');
            throw new Error('buyTokens function not available.');
        }

        try {
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            this.showNotification('Preparing transaction... Please confirm in your wallet.', 'info');
            const transaction = await this.contract.methods.buyTokens() // Assuming buyTokens is payable and takes no args other than msg.value
                .send({
                    from: this.userAddress,
                    value: amountWei, // Value in Wei for ETH payment
                    // Gas estimation can be tricky. Let wallet estimate, or set a safe limit.
                    // gas: await this.contract.methods.buyTokens().estimateGas({ from: this.userAddress, value: amountWei })
                });
            
            this.showNotification(`Purchase successful! Transaction: ${transaction.transactionHash.substring(0,10)}...`, 'success');
            this.dispatchEvent('tokensPurchased', { amount, transactionHash: transaction.transactionHash });
            this.updateWalletDisplay(); // Refresh balances
            return transaction;
            
        } catch (error) {
            console.error('Purchase error:', error);
            let message = 'Purchase failed.';
            if (error.code === 4001) message = 'Transaction rejected by user.';
            else if (error.message) message = `Purchase failed: ${error.message.substring(0,100)}`;
            this.showNotification(message, 'error');
            throw error;
        }
    }
    
    async stakeTokens(amount, duration) {
        if (!this.contract || !this.userAddress || !this.isConnected) {
            this.showNotification('Please connect your wallet to stake tokens.', 'error');
            throw new Error('Wallet not connected or contract not initialized.');
        }
         if (!(await this.checkNetwork())) {
             throw new Error(`Staking failed: Please switch to ${this.targetNetwork.name}.`);
        }
        if (typeof this.contract.methods.stake !== 'function') {
            this.showNotification('stake function not available on the smart contract.', 'error');
            throw new Error('stake function not available.');
        }

        try {
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            this.showNotification('Preparing staking transaction... Please confirm in your wallet.', 'info');
            const transaction = await this.contract.methods.stake(amountWei, duration) // Assuming stake(amount, duration)
                .send({
                    from: this.userAddress,
                    // gas: await this.contract.methods.stake(amountWei, duration).estimateGas({ from: this.userAddress })
                });
            
            this.showNotification(`Tokens staked successfully! Transaction: ${transaction.transactionHash.substring(0,10)}...`, 'success');
            this.dispatchEvent('tokensStaked', { amount, duration, transactionHash: transaction.transactionHash });
            this.updateWalletDisplay(); // Refresh balances
            return transaction;
            
        } catch (error) {
            console.error('Staking error:', error);
            let message = 'Staking failed.';
            if (error.code === 4001) message = 'Transaction rejected by user.';
            else if (error.message) message = `Staking failed: ${error.message.substring(0,100)}`;
            this.showNotification(message, 'error');
            throw error;
        }
    }
    
    handleAccountsChanged(accounts) {
        console.log('Wallet accounts changed:', accounts);
        if (!this.isConnected && accounts.length > 0) {
            // This could happen if the user connected an account, then switched in MM before site fully registered.
            // Or if they disconnected and then re-enabled an account.
            // Re-initiate connection logic for the new account.
            console.log("Account detected while not formally connected. Attempting to re-establish session.");
            // Re-trigger connection with current wallet type, if known, or default.
            const walletToReconnect = this.currentWallet || localStorage.getItem('mwb_connected_wallet') || 'metamask';
            this.connectWallet(walletToReconnect); 
            return;
        }

        if (accounts.length === 0) {
            this.showNotification('Wallet account disconnected or locked. Please reconnect.', 'warning');
            this.disconnect(); // Full disconnect if no accounts available
        } else if (accounts[0] !== this.userAddress) {
            this.userAddress = accounts[0];
            localStorage.setItem('mwb_user_address', this.userAddress);
            this.showNotification(`Account switched to: ${this.formatAddress(this.userAddress)}`, 'info');
            // Re-initialize contract and update UI for the new account
            this.initializeContract().then(() => {
                this.updateWalletDisplay();
                this.dispatchEvent('accountChanged', { address: this.userAddress });
            });
        }
    }
    
    async handleChainChanged(chainIdHex) {
        const chainId = parseInt(chainIdHex, 16).toString(); // Convert hex to decimal string if needed, or keep hex
        console.log('Wallet network chain changed to:', chainIdHex);
        this.showNotification(`Network changed to ID: ${chainIdHex}. Verifying...`, 'info');
        
        const networkOk = await this.checkNetwork(); // This will attempt switch/add if not targetNetwork.id
        if (networkOk) {
            this.showNotification(`Connected to ${this.targetNetwork.name}.`, 'success');
            if (this.isConnected) {
                // Re-initialize contract as ABIs or addresses might change per network (though unlikely for same contract)
                // Or simply refresh data that might be network-specific.
                await this.initializeContract(); 
                this.updateWalletDisplay(); // Refresh balance, etc.
                this.dispatchEvent('networkChangeAccepted', { chainId: chainIdHex });
            }
        } else {
            // If network is not okay after checkNetwork (e.g., user refused switch)
            // Contract interaction should be disabled or limited.
            this.contract = null; // Nullify contract object to prevent interactions on wrong network
            this.updateWalletDisplay(); // Update UI to reflect potential inability to interact
            this.dispatchEvent('networkChangeRejected', { chainId: chainIdHex });
            // No explicit disconnect here, user might still want to browse site.
            // Wallet is "connected" but on an unsupported network for contract features.
        }
    }
    
    handleDisconnect(error) { // Parameter often provided by provider on disconnect event
        console.log('Wallet disconnected by provider:', error ? error : 'No error details');
        this.showNotification('Wallet has been disconnected.', 'warning');
        this.disconnect(); // Call our internal disconnect logic
    }
    
    updateWalletDisplay() {
        const connectButton = document.getElementById('wallet-connect-btn');
        const walletInfoDiv = document.getElementById('wallet-info');
        const addressDisplay = document.getElementById('wallet-address');
        const balanceDisplay = document.getElementById('wallet-balance'); // ETH balance
        const mwbBalanceDisplay = document.getElementById('mwb-token-balance'); // MWB token balance

        if (this.isConnected && this.userAddress) {
            if (connectButton) connectButton.style.display = 'none';
            if (walletInfoDiv) walletInfoDiv.style.display = 'block'; // Or 'flex', 'grid' depending on CSS
            if (addressDisplay) {
                addressDisplay.textContent = this.formatAddress(this.userAddress);
                addressDisplay.setAttribute('title', this.userAddress); // Show full address on hover
            }
            
            // Update ETH balance
            this.getBalance().then(balance => {
                if (balanceDisplay) {
                    balanceDisplay.textContent = `${parseFloat(balance).toFixed(4)} ETH`;
                }
            }).catch(err => console.error("Error updating ETH balance display:", err));

            // Update MWB token balance
            if (this.contract) { // Only if contract is initialized
                this.getMWBBalance().then(mwbBalance => {
                    if (mwbBalanceDisplay) {
                        mwbBalanceDisplay.textContent = `${parseFloat(mwbBalance).toFixed(4)} MWB`;
                    }
                }).catch(err => console.error("Error updating MWB balance display:", err));
            } else {
                 if (mwbBalanceDisplay) mwbBalanceDisplay.textContent = 'N/A (Contract Error)';
            }
            
        } else {
            if (connectButton) connectButton.style.display = 'block';
            if (walletInfoDiv) walletInfoDiv.style.display = 'none';
            if (addressDisplay) addressDisplay.textContent = '';
            if (balanceDisplay) balanceDisplay.textContent = 'N/A';
            if (mwbBalanceDisplay) mwbBalanceDisplay.textContent = 'N/A';
        }
    }
    
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        // Simple notification, consider using a dedicated library for more complex needs
        const notificationArea = document.getElementById('wallet-notifications') || document.body;
        const notification = document.createElement('div');
        notification.className = `wallet-notification type-${type}`; // e.g., type-info, type-error
        notification.textContent = message;
        
        // Style for visibility
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = type === 'error' ? '#f8d7da' : (type === 'success' ? '#d4edda' : '#cfe2ff');
        notification.style.color = type === 'error' ? '#721c24' : (type === 'success' ? '#155724' : '#0c5460');
        notification.style.border = `1px solid ${type === 'error' ? '#f5c6cb' : (type === 'success' ? '#c3e6cb' : '#b8daff')}`;
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        // Ensure only one notification of this exact message is shown at a time to prevent spam
        const existingNotifications = notificationArea.querySelectorAll('.wallet-notification');
        for (let en of existingNotifications) {
            if (en.textContent === message) {
                en.remove(); // Remove old one if same message
            }
        }

        notificationArea.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300); // Remove after fade out
        }, duration);
    }
    
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(`wallet_${eventName}`, { detail: data });
        window.dispatchEvent(event);
    }
}

// Initialize wallet manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!window.Web3) {
        console.error("Web3.js is not loaded. Wallet functionality will be impaired.");
        // Optionally, display a message to the user or try to load it dynamically.
        const body = document.querySelector('body');
        if (body) {
            const errorMsg = document.createElement('div');
            errorMsg.textContent = "Critical Error: Web3.js library not found. Wallet features are disabled.";
            errorMsg.style.color = "red";
            errorMsg.style.backgroundColor = "white";
            errorMsg.style.padding = "10px";
            errorMsg.style.textAlign = "center";
            errorMsg.style.fontWeight = "bold";
            body.prepend(errorMsg);
        }
        return; // Stop initialization if Web3 is missing
    }

    window.walletManager = new WalletManager();
    console.log('Wallet Manager initialized');

    // Example: Setup connect button if it exists
    const connectBtn = document.getElementById('wallet-connect-btn');
    if (connectBtn) {
        connectBtn.onclick = async () => {
            // Could offer a choice of wallets here if multiple are detected/supported
            // For now, defaults to MetaMask or the first available/preferred.
            // Let's try to connect with MetaMask by default if available.
            if (window.walletManager.supportedWallets.metamask.detected()) {
                await window.walletManager.connectWallet('metamask');
            } else {
                // If MetaMask not detected, try WalletConnect as a common fallback
                // This part could be expanded to show a modal with wallet choices
                const availableWallets = window.walletManager.getAvailableWallets();
                if (availableWallets.length > 0) {
                    // Prioritize injected browser wallets, then WalletConnect
                    const preferredOrder = ['metamask', 'coinbase', 'trustwallet', 'walletconnect'];
                    let connected = false;
                    for (const walletKey of preferredOrder) {
                        if (availableWallets.find(w => w.key === walletKey)) {
                            if (await window.walletManager.connectWallet(walletKey)) {
                                connected = true;
                                break;
                            }
                        }
                    }
                    if (!connected && availableWallets.find(w => w.key === 'walletconnect')) {
                         // Fallback to WalletConnect if direct providers fail or aren't chosen
                        await window.walletManager.connectWallet('walletconnect');
                    } else if (!connected) {
                        window.walletManager.showNotification("No compatible wallet found or connection failed.", "error");
                    }
                } else {
                     window.walletManager.showNotification("No web3 wallets detected. Please install a wallet like MetaMask or use WalletConnect.", "error");
                }
            }
        };
    }
    
    // Example: Setup disconnect button
    const disconnectBtn = document.getElementById('wallet-disconnect-btn'); // Assuming you have a button with this ID
    if (disconnectBtn) {
        disconnectBtn.onclick = async () => {
            await window.walletManager.disconnect();
        };
    }
});

// Make sure you have Web3.js included in your HTML before this script.
// e.g., <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
// And for WalletConnect v2 with Web3Modal (recommended over standalone connector for better UX):
// <script type="module">
//  import { EthereumClient, w3mConnectors, w3mProvider } from 'https://unpkg.com/@web3modal/ethereum@2.7.1'
//  import { Web3Modal } from 'https://unpkg.com/@web3modal/html@2.7.1'
//  import { configureChains, createConfig } from 'https://unpkg.com/@wagmi/core@1.4.2'
//  import { mainnet, arbitrum } from 'https://unpkg.com/@wagmi/core@1.4.2/chains' // choose your chains
//  const chains = [mainnet, arbitrum] // Your chains
//  const projectId = 'YOUR_PROJECT_ID' // Your WalletConnect Cloud Project ID
//  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
//  const wagmiConfig = createConfig({
//    autoConnect: true,
//    connectors: w3mConnectors({ projectId, chains }),
//    publicClient
//  })
//  const ethereumClient = new EthereumClient(wagmiConfig, chains)
//  const web3modal = new Web3Modal({ projectId }, ethereumClient)
// </script>
// The provided `connectWalletConnect` uses an older WalletConnect v1 style connector.
// For a modern setup, consider `@web3modal/ethereum` which simplifies WalletConnect integration.
// You will need to replace 'YOUR_WALLETCONNECT_PROJECT_ID' in the connectWalletConnect method.
// You will also need to replace 'YOUR_INFURA_PROJECT_ID' in the targetNetwork configuration.