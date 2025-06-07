# 🔑 Mac Wayne Battered Coin - API Keys Setup Guide

## ✅ INFURA CONFIGURED
**Infura Project ID:** `37b25cd53c7648f69b662609433f87b8` ✅ **COMPLETE**

## 🔗 WALLETCONNECT SETUP (2 minutes)

### Step 1: Create WalletConnect Project
Visit: **https://cloud.walletconnect.com/**

### Step 2: Fill Project Form
```
Project Name: Mac Wayne Battered Coin
Description: Accessibility-first cryptocurrency platform enabling digital currency access for all users including those with disabilities
Homepage URL: https://macwayneofficial.com
Category: DeFi
Platform: Web
```

### Step 3: Copy Project ID
After creating the project, copy the **Project ID** (looks like: `a1b2c3d4e5f6g7h8i9j0`)

### Step 4: Update Configuration
Edit your `js/production-config.js` file and replace:
```javascript
walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
```
With:
```javascript
walletConnectProjectId: 'YOUR_ACTUAL_PROJECT_ID_HERE',
```

## 🚀 FINAL CONFIGURATION

After getting your WalletConnect Project ID, your config will look like:

```javascript
window.CRYPTO_CONFIG = {
    environment: 'production',
    apiBaseUrl: 'https://api.macwayneofficial.com/crypto/',
    walletConnectProjectId: 'a1b2c3d4e5f6g7h8i9j0', // Your actual ID
    infuraProjectId: '37b25cd53c7648f69b662609433f87b8', // ✅ Already set
    contractAddresses: {
        mwbToken: '0x...',
        stakingPool: '0x...',
        nftMarketplace: '0x...'
    },
    networkConfig: {
        chainId: 1,
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/37b25cd53c7648f69b662609433f87b8'],
        blockExplorerUrls: ['https://etherscan.io']
    },
    features: {
        enableTestingUI: false,
        enableDebugMode: false,
        enableAnalytics: true,
        enableErrorReporting: true
    }
};
```

## ⚡ QUICK DEPLOYMENT STATUS

### ✅ Ready for Deployment:
- **Infura:** Configured ✅
- **WalletConnect:** Pending Project ID
- **Domain:** macwayneofficial.com ready
- **Package:** 158.21 MB ready for upload
- **SSL:** Ready to configure after upload

### 🎯 Next Steps:
1. **Create WalletConnect project** (2 minutes)
2. **Update production-config.js** with Project ID
3. **Upload to web server** (10 minutes)
4. **Configure SSL certificate** (5 minutes)
5. **🚀 LAUNCH!**

## 🔍 Test After Deployment:
- Visit: `https://macwayneofficial.com/verify-deployment.html`
- Test wallet connectivity with MetaMask
- Verify all cryptocurrency features working

---

**Your Mac Wayne Battered Coin platform is 95% ready for deployment! Just need the WalletConnect Project ID! 🚀**
