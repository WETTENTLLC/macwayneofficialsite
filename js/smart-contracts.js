/**
 * Mac Wayne Battered Coin - Smart Contract System
 * Handles MWB token operations, staking, and accessibility fund distribution
 */

class SmartContractManager {
    constructor() {
        this.web3 = null;
        this.contracts = {};
        this.userAddress = null;
        this.networkId = null;
        
        // Contract addresses (to be updated after deployment)
        this.contractAddresses = {
            mainnet: {
                mwbToken: '0x...', // MWB ERC-20 Token
                staking: '0x...', // Staking Contract
                accessibilityFund: '0x...', // Accessibility Fund Distribution
                marketplace: '0x...' // NFT Marketplace
            },
            testnet: {
                mwbToken: '0x...', // Testnet addresses
                staking: '0x...',
                accessibilityFund: '0x...',
                marketplace: '0x...'
            }
        };
        
        // Contract ABIs
        this.contractABIs = {
            mwbToken: [
                {
                    "inputs": [],
                    "name": "name",
                    "outputs": [{"type": "string"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "symbol",
                    "outputs": [{"type": "string"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "decimals",
                    "outputs": [{"type": "uint8"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalSupply",
                    "outputs": [{"type": "uint256"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "address"}],
                    "name": "balanceOf",
                    "outputs": [{"type": "uint256"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "address"}, {"type": "uint256"}],
                    "name": "transfer",
                    "outputs": [{"type": "bool"}],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "address"}, {"type": "address"}, {"type": "uint256"}],
                    "name": "transferFrom",
                    "outputs": [{"type": "bool"}],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "address"}, {"type": "uint256"}],
                    "name": "approve",
                    "outputs": [{"type": "bool"}],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ],
            staking: [
                {
                    "inputs": [{"type": "uint256"}],
                    "name": "stake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "uint256"}],
                    "name": "unstake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "claimRewards",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "address"}],
                    "name": "getStakedAmount",
                    "outputs": [{"type": "uint256"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "address"}],
                    "name": "getPendingRewards",
                    "outputs": [{"type": "uint256"}],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Listen for wallet connection events
            window.addEventListener('walletConnected', (event) => {
                this.onWalletConnected(event.detail);
            });
            
            window.addEventListener('walletDisconnected', () => {
                this.onWalletDisconnected();
            });
            
            console.log('Smart Contract Manager initialized');
        } catch (error) {
            console.error('Smart Contract initialization error:', error);
        }
    }
    
    async onWalletConnected(walletData) {
        try {
            this.web3 = walletData.web3;
            this.userAddress = walletData.address;
            this.networkId = await this.web3.eth.net.getId();
            
            await this.loadContracts();
            await this.updateUserBalance();
            
            // Dispatch contract ready event
            window.dispatchEvent(new CustomEvent('contractsReady', {
                detail: { contracts: this.contracts, userAddress: this.userAddress }
            }));
            
        } catch (error) {
            console.error('Error connecting to contracts:', error);
        }
    }
    
    onWalletDisconnected() {
        this.web3 = null;
        this.contracts = {};
        this.userAddress = null;
        this.networkId = null;
    }
    
    async loadContracts() {
        try {
            const network = this.networkId === 1 ? 'mainnet' : 'testnet';
            const addresses = this.contractAddresses[network];
            
            // Load MWB Token contract
            if (addresses.mwbToken !== '0x...') {
                this.contracts.mwbToken = new this.web3.eth.Contract(
                    this.contractABIs.mwbToken,
                    addresses.mwbToken
                );
            }
            
            // Load Staking contract
            if (addresses.staking !== '0x...') {
                this.contracts.staking = new this.web3.eth.Contract(
                    this.contractABIs.staking,
                    addresses.staking
                );
            }
            
            console.log('Smart contracts loaded successfully');
            
        } catch (error) {
            console.error('Error loading contracts:', error);
            throw error;
        }
    }
    
    // Token Operations
    async getTokenBalance(address = null) {
        try {
            if (!this.contracts.mwbToken) return '0';
            
            const userAddr = address || this.userAddress;
            const balance = await this.contracts.mwbToken.methods.balanceOf(userAddr).call();
            return this.web3.utils.fromWei(balance, 'ether');
            
        } catch (error) {
            console.error('Error getting token balance:', error);
            return '0';
        }
    }
    
    async transferTokens(toAddress, amount) {
        try {
            if (!this.contracts.mwbToken || !this.userAddress) {
                throw new Error('Contract or wallet not connected');
            }
            
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            const tx = await this.contracts.mwbToken.methods
                .transfer(toAddress, amountWei)
                .send({ from: this.userAddress });
                
            return tx;
            
        } catch (error) {
            console.error('Error transferring tokens:', error);
            throw error;
        }
    }
    
    // Staking Operations
    async stakeTokens(amount) {
        try {
            if (!this.contracts.staking || !this.contracts.mwbToken || !this.userAddress) {
                throw new Error('Contracts or wallet not connected');
            }
            
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            // First approve the staking contract to spend tokens
            await this.contracts.mwbToken.methods
                .approve(this.contracts.staking.options.address, amountWei)
                .send({ from: this.userAddress });
            
            // Then stake the tokens
            const tx = await this.contracts.staking.methods
                .stake(amountWei)
                .send({ from: this.userAddress });
                
            return tx;
            
        } catch (error) {
            console.error('Error staking tokens:', error);
            throw error;
        }
    }
    
    async unstakeTokens(amount) {
        try {
            if (!this.contracts.staking || !this.userAddress) {
                throw new Error('Staking contract or wallet not connected');
            }
            
            const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
            
            const tx = await this.contracts.staking.methods
                .unstake(amountWei)
                .send({ from: this.userAddress });
                
            return tx;
            
        } catch (error) {
            console.error('Error unstaking tokens:', error);
            throw error;
        }
    }
    
    async getStakedAmount(address = null) {
        try {
            if (!this.contracts.staking) return '0';
            
            const userAddr = address || this.userAddress;
            const staked = await this.contracts.staking.methods.getStakedAmount(userAddr).call();
            return this.web3.utils.fromWei(staked, 'ether');
            
        } catch (error) {
            console.error('Error getting staked amount:', error);
            return '0';
        }
    }
    
    async getPendingRewards(address = null) {
        try {
            if (!this.contracts.staking) return '0';
            
            const userAddr = address || this.userAddress;
            const rewards = await this.contracts.staking.methods.getPendingRewards(userAddr).call();
            return this.web3.utils.fromWei(rewards, 'ether');
            
        } catch (error) {
            console.error('Error getting pending rewards:', error);
            return '0';
        }
    }
    
    async claimStakingRewards() {
        try {
            if (!this.contracts.staking || !this.userAddress) {
                throw new Error('Staking contract or wallet not connected');
            }
            
            const tx = await this.contracts.staking.methods
                .claimRewards()
                .send({ from: this.userAddress });
                
            return tx;
            
        } catch (error) {
            console.error('Error claiming rewards:', error);
            throw error;
        }
    }
    
    // Utility Functions
    async updateUserBalance() {
        try {
            if (!this.userAddress) return;
            
            const balance = await this.getTokenBalance();
            const stakedAmount = await this.getStakedAmount();
            const pendingRewards = await this.getPendingRewards();
            
            // Update UI elements
            this.updateBalanceDisplay(balance, stakedAmount, pendingRewards);
            
            // Dispatch balance update event
            window.dispatchEvent(new CustomEvent('balanceUpdated', {
                detail: {
                    balance: balance,
                    staked: stakedAmount,
                    rewards: pendingRewards
                }
            }));
            
        } catch (error) {
            console.error('Error updating user balance:', error);
        }
    }
    
    updateBalanceDisplay(balance, staked, rewards) {
        // Update balance displays in UI
        const balanceElement = document.getElementById('user-balance');
        const stakedElement = document.getElementById('staked-amount');
        const rewardsElement = document.getElementById('pending-rewards');
        
        if (balanceElement) balanceElement.textContent = `${parseFloat(balance).toFixed(4)} MWB`;
        if (stakedElement) stakedElement.textContent = `${parseFloat(staked).toFixed(4)} MWB`;
        if (rewardsElement) rewardsElement.textContent = `${parseFloat(rewards).toFixed(4)} MWB`;
    }
    
    // Event Listeners for Contract Events
    setupEventListeners() {
        if (!this.contracts.mwbToken) return;
        
        // Listen for token transfers
        this.contracts.mwbToken.events.Transfer({
            filter: { from: this.userAddress },
            fromBlock: 'latest'
        })
        .on('data', (event) => {
            console.log('Token transfer detected:', event);
            this.updateUserBalance();
        });
        
        // Listen for staking events if staking contract is available
        if (this.contracts.staking) {
            this.contracts.staking.events.Staked({
                filter: { user: this.userAddress },
                fromBlock: 'latest'
            })
            .on('data', (event) => {
                console.log('Staking event detected:', event);
                this.updateUserBalance();
            });
        }
    }
}

// Initialize Smart Contract Manager
window.smartContractManager = new SmartContractManager();
