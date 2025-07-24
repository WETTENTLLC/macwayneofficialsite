/* Mac Wayne Crypto - WalletConnect Integration Setup */

/**
 * REOWN PROJECT ID CONFIGURED: 8108c677f442f0194701b6076df5c1a6
 * Project Name: Mac Wayne Battered Coin
 * Domain: macwayneofficial.com
 */

import { Core } from '@walletconnect/core';
import { WalletKit } from '@reown/walletkit';

class WalletConnectManager {
    constructor(config) {
        this.projectId = config.walletConnectProjectId;
        this.infuraUrl = `https://mainnet.infura.io/v3/${config.infuraProjectId}`;
        this.walletKit = null;
        this.core = null;
        this.web3Provider = null;
        this.isConnected = false;
        this.currentAccount = null;
    }

    async initializeWalletConnect() {
        try {
            // Initialize Core with your Project ID
            this.core = new Core({
                projectId: this.projectId
            });

            // Mac Wayne Battered Coin metadata
            const metadata = {
                name: 'Mac Wayne Battered Coin',
                description: 'Accessibility-First Cryptocurrency Platform for the Visually Impaired',
                url: 'https://macwayneofficial.com',
                icons: ['https://macwayneofficial.com/img/mac-wayne-logo.png']
            };

            // Initialize WalletKit
            this.walletKit = await WalletKit.init({
                core: this.core,
                metadata
            });

            return true;
        } catch (error) {
            console.error('WalletConnect initialization failed:', error);
            return false;
        }
    }

    async connectWallet() {
        try {
            if (!this.walletConnectModal) {
                const initialized = await this.initializeWalletConnect();
                if (!initialized) return false;
            }

            // Open WalletConnect modal
            const session = await this.walletConnectModal.connect();
            
            if (session) {
                this.isConnected = true;
                this.currentAccount = session.accounts[0];
                
                // Update UI
                this.updateConnectionUI(true);
                
                // Announce success for accessibility
                this.announceToScreenReader('Wallet connected successfully');
                
                return true;
            }
        } catch (error) {
            console.error('Wallet connection failed:', error);
            this.announceToScreenReader('Wallet connection failed. Please try again.');
            return false;
        }
    }

    async disconnectWallet() {
        try {
            if (this.walletConnectModal && this.isConnected) {
                await this.walletConnectModal.disconnect();
                this.isConnected = false;
                this.currentAccount = null;
                this.updateConnectionUI(false);
                this.announceToScreenReader('Wallet disconnected');
            }
        } catch (error) {
            console.error('Wallet disconnection failed:', error);
        }
    }

    updateConnectionUI(connected) {
        const connectBtn = document.getElementById('connect-wallet-btn');
        const walletStatus = document.getElementById('wallet-status');
        const accountDisplay = document.getElementById('account-display');

        if (connected && this.currentAccount) {
            connectBtn.textContent = 'Disconnect Wallet';
            connectBtn.setAttribute('aria-label', 'Disconnect crypto wallet');
            walletStatus.textContent = 'Connected';
            walletStatus.className = 'wallet-status connected';
            accountDisplay.textContent = `${this.currentAccount.slice(0, 6)}...${this.currentAccount.slice(-4)}`;
        } else {
            connectBtn.textContent = 'Connect Wallet';
            connectBtn.setAttribute('aria-label', 'Connect crypto wallet');
            walletStatus.textContent = 'Not Connected';
            walletStatus.className = 'wallet-status disconnected';
            accountDisplay.textContent = '';
        }
    }

    announceToScreenReader(message) {
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

    showProjectIdInstructions() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" role="dialog" aria-labelledby="setup-title" aria-describedby="setup-instructions">
                <h2 id="setup-title">WalletConnect Setup Required</h2>
                <div id="setup-instructions">
                    <p>To enable wallet connections, please complete the following steps:</p>
                    <ol>
                        <li>Visit <a href="https://cloud.reown.com/" target="_blank" rel="noopener">cloud.reown.com</a></li>
                        <li>Create a new project named "Mac Wayne Battered Coin"</li>
                        <li>Copy your Project ID</li>
                        <li>Update the Project ID in production-config.js</li>
                        <li>Add macwayneofficial.com to your domain whitelist</li>
                    </ol>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                    Close Instructions
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Utility method to get current wallet balance
    async getWalletBalance() {
        if (!this.isConnected || !this.currentAccount) return null;
        
        try {
            const response = await fetch(this.infuraUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getBalance',
                    params: [this.currentAccount, 'latest'],
                    id: 1
                })
            });
            
            const data = await response.json();
            const balanceWei = parseInt(data.result, 16);
            const balanceEth = balanceWei / Math.pow(10, 18);
            
            return balanceEth.toFixed(4);
        } catch (error) {
            console.error('Balance fetch failed:', error);
            return null;
        }
    }
}

// Global wallet manager instance
window.MacWayneWalletManager = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    if (window.CRYPTO_CONFIG) {
        window.MacWayneWalletManager = new WalletConnectManager(window.CRYPTO_CONFIG);
        
        // Setup wallet connection button
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', async () => {
                if (window.MacWayneWalletManager.isConnected) {
                    await window.MacWayneWalletManager.disconnectWallet();
                } else {
                    await window.MacWayneWalletManager.connectWallet();
                }
            });
        }
    }
});
