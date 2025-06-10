// NFT Marketplace - Mac Wayne Official
// Placeholder for future NFT marketplace integration

class NFTMarketplace {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.userAccount = null;
    this.init();
  }

  async init() {
    this.createMarketplaceUI();
    this.bindEvents();
    await this.checkWeb3();
  }

  createMarketplaceUI() {
    const marketplaceHTML = `
      <div id="nft-marketplace" class="nft-marketplace">
        <div class="marketplace-header">
          <h2>Mac Wayne NFT Collection</h2>
          <p>Exclusive digital collectibles and experiences</p>
          <button id="connect-wallet" class="btn btn-primary">Connect Wallet</button>
        </div>
        <div class="marketplace-grid">
          <div class="nft-card placeholder">
            <div class="nft-image">
              <img src="images/nft-placeholder-1.jpg" alt="Mac Wayne NFT #1">
            </div>
            <div class="nft-info">
              <h3>Accessibility Anthem #1</h3>
              <p>Exclusive track with visual art</p>
              <div class="nft-price">0.1 ETH</div>
              <button class="btn btn-secondary">Coming Soon</button>
            </div>
          </div>
          <div class="nft-card placeholder">
            <div class="nft-image">
              <img src="images/nft-placeholder-2.jpg" alt="Mac Wayne NFT #2">
            </div>
            <div class="nft-info">
              <h3>Behind the Beats #1</h3>
              <p>Studio session recording</p>
              <div class="nft-price">0.05 ETH</div>
              <button class="btn btn-secondary">Coming Soon</button>
            </div>
          </div>
          <div class="nft-card placeholder">
            <div class="nft-image">
              <img src="images/nft-placeholder-3.jpg" alt="Mac Wayne NFT #3">
            </div>
            <div class="nft-info">
              <h3>Concert Experience #1</h3>
              <p>VIP access token</p>
              <div class="nft-price">0.2 ETH</div>
              <button class="btn btn-secondary">Coming Soon</button>
            </div>
          </div>
        </div>
        <div class="marketplace-footer">
          <p>NFT marketplace coming soon. Join our newsletter to be notified when it launches!</p>
        </div>
      </div>
    `;
    
    const container = document.querySelector('.nft-container') || document.body;
    container.insertAdjacentHTML('beforeend', marketplaceHTML);
  }

  bindEvents() {
    const connectBtn = document.getElementById('connect-wallet');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => this.connectWallet());
    }
  }

  async checkWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask detected');
      this.web3 = window.ethereum;
    } else {
      console.log('No Web3 provider detected');
      this.showWeb3Warning();
    }
  }

  async connectWallet() {
    if (!this.web3) {
      this.showWeb3Warning();
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      this.userAccount = accounts[0];
      this.updateUI();
      console.log('Wallet connected:', this.userAccount);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }

  updateUI() {
    const connectBtn = document.getElementById('connect-wallet');
    if (this.userAccount && connectBtn) {
      connectBtn.textContent = `Connected: ${this.userAccount.slice(0, 6)}...${this.userAccount.slice(-4)}`;
      connectBtn.disabled = true;
    }
  }

  showWeb3Warning() {
    const warning = `
      <div class="web3-warning">
        <h3>Web3 Wallet Required</h3>
        <p>To participate in the NFT marketplace, you'll need a Web3 wallet like MetaMask.</p>
        <a href="https://metamask.io/" target="_blank" class="btn btn-primary">Install MetaMask</a>
      </div>
    `;
    
    const marketplace = document.getElementById('nft-marketplace');
    if (marketplace) {
      marketplace.insertAdjacentHTML('afterbegin', warning);
    }
  }

  // Placeholder methods for future implementation
  async loadNFTs() {
    // Load NFTs from blockchain
    console.log('Loading NFTs...');
  }

  async purchaseNFT(tokenId) {
    // Purchase NFT logic
    console.log('Purchasing NFT:', tokenId);
  }

  async listNFT(tokenId, price) {
    // List NFT for sale
    console.log('Listing NFT:', tokenId, 'for', price);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.nft-container') || document.querySelector('#nft-marketplace')) {
    new NFTMarketplace();
  }
});