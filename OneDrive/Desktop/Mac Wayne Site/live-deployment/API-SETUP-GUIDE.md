# Mac Wayne Battered Coin - API Configuration Guide

## 🔑 Required API Keys & Services Setup

This guide walks you through obtaining and configuring all necessary API keys and services for the Mac Wayne Battered Coin cryptocurrency platform.

---

## 📋 Required Services

### 1. 🌐 Ethereum Network Access
**Purpose:** Connect to Ethereum blockchain for cryptocurrency operations

#### Infura (Primary Provider)
1. Go to [infura.io](https://infura.io)
2. Create free account
3. Create new project
4. Copy Project ID
5. **Add to config:** `INFURA_PROJECT_ID: 'your_project_id_here'`

#### Alchemy (Backup Provider)
1. Go to [alchemy.com](https://alchemy.com)
2. Create free account
3. Create new app (Ethereum Mainnet)
4. Copy API Key
5. **Add to config:** `ALCHEMY_API_KEY: 'your_api_key_here'`

### 2. 👛 Wallet Integration
**Purpose:** Enable wallet connections (MetaMask, WalletConnect, etc.)

#### WalletConnect
1. Go to [walletconnect.com](https://walletconnect.com)
2. Create account
3. Create new project
4. Copy Project ID
5. **Add to config:** `WALLETCONNECT_PROJECT_ID: 'your_project_id_here'`

### 3. 📊 Analytics & Tracking
**Purpose:** Monitor site usage and user behavior

#### Google Analytics 4
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create account or use existing
3. Create new GA4 property
4. Copy Measurement ID (starts with G-)
5. **Add to config:** `GOOGLE_ANALYTICS_ID: 'G-XXXXXXXXXX'`

### 4. 🔗 Smart Contract Deployment
**Purpose:** Deploy Mac Wayne Battered Coin smart contracts

#### Contract Addresses (Deploy First)
You'll need to deploy these contracts to Ethereum mainnet:
- **MWB Token Contract:** Main cryptocurrency token
- **Staking Pool Contract:** Token staking functionality  
- **NFT Marketplace Contract:** Digital asset marketplace

**Deployment Tools:**
- [Remix IDE](https://remix.ethereum.org) - Browser-based development
- [Hardhat](https://hardhat.org) - Development framework
- [Truffle](https://trufflesuite.com) - Development suite

---

## ⚙️ Configuration File Setup

### Step 1: Open Configuration File
Edit the file: `/js/production-config.js`

### Step 2: Replace Placeholder Values
```javascript
/* Mac Wayne Crypto System - Production Configuration */
window.CRYPTO_CONFIG = {
    environment: 'production',
    
    // 🌐 Blockchain Access
    infuraProjectId: 'YOUR_INFURA_PROJECT_ID',        // ← Replace this
    alchemyApiKey: 'YOUR_ALCHEMY_API_KEY',            // ← Replace this
    
    // 👛 Wallet Integration
    walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // ← Replace this
    
    // 📊 Analytics
    googleAnalyticsId: 'G-XXXXXXXXXX',                // ← Replace this
    
    // 🔗 Smart Contracts (Deploy these first!)
    contractAddresses: {
        mwbToken: '0x1234567890123456789012345678901234567890',      // ← Replace
        stakingPool: '0x1234567890123456789012345678901234567890',   // ← Replace  
        nftMarketplace: '0x1234567890123456789012345678901234567890' // ← Replace
    },
    
    // 🌍 Network Configuration
    networkConfig: {
        chainId: 1, // Ethereum Mainnet
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'], // ← Update
        blockExplorerUrls: ['https://etherscan.io']
    },
    
    // 🎛️ Feature Flags
    features: {
        enableTestingUI: false,     // Disable for production
        enableDebugMode: false,     // Disable for production
        enableAnalytics: true,      // Enable for production
        enableErrorReporting: true  // Enable for production
    },
    
    // 🏠 Domain Configuration
    domain: 'macwayneofficial.com',    // ← Update with your domain
    apiBaseUrl: 'https://api.macwayneofficial.com/crypto/'
};
```

### Step 3: Security Considerations
- ✅ **Safe to include:** Public API keys, contract addresses, analytics IDs
- ❌ **Never include:** Private keys, secret API keys, admin passwords
- 🔒 **Server-side only:** Database credentials, admin API keys

---

## 🚀 Quick Setup Commands

### For Linux/macOS:
```bash
# Navigate to deployment folder
cd live-deployment

# Make verification script executable
chmod +x quick-verify.sh

# Run verification after upload
./quick-verify.sh
```

### For Windows:
```powershell
# Navigate to deployment folder
cd live-deployment

# Run verification after upload
.\quick-verify.ps1
```

---

## 🧪 Testing Your Configuration

### 1. Local Testing
Before uploading to production, test locally:
```bash
# Start local server
python -m http.server 8000
# OR
npx serve .

# Visit http://localhost:8000/verify-deployment.html
```

### 2. Production Testing
After uploading and configuring:
1. Visit `https://yourdomain.com/verify-deployment.html`
2. Run all automated tests
3. Verify all green checkmarks
4. Test wallet connectivity
5. Check cryptocurrency data feeds

---

## 🔧 Troubleshooting

### Common Issues

#### "Contract not found" Error
- ✅ Verify contract addresses are correct
- ✅ Ensure contracts are deployed to mainnet (not testnet)
- ✅ Check contract ABI matches deployed version

#### "RPC connection failed" Error
- ✅ Verify Infura/Alchemy API keys are valid
- ✅ Check API rate limits not exceeded
- ✅ Ensure correct network (mainnet vs testnet)

#### "Wallet connection failed" Error
- ✅ Verify WalletConnect Project ID is correct
- ✅ Check domain is approved in WalletConnect dashboard
- ✅ Ensure HTTPS is properly configured

#### Analytics not tracking
- ✅ Verify Google Analytics ID format (starts with G-)
- ✅ Check domain is configured in GA property
- ✅ Ensure tracking code loads without errors

---

## 📞 Support Resources

### Official Documentation
- [Infura Docs](https://docs.infura.io)
- [Alchemy Docs](https://docs.alchemy.com)
- [WalletConnect Docs](https://docs.walletconnect.com)
- [Google Analytics Help](https://support.google.com/analytics)

### Community Support
- Mac Wayne Discord: [Discord Link]
- GitHub Issues: [Repository Link]
- Technical Support: support@macwayneofficial.com

---

**🎉 Once all API keys are configured, your Mac Wayne Battered Coin platform will be fully functional and ready for public launch! 🎉**
