/* Mac Wayne Crypto System - Production Configuration */
window.CRYPTO_CONFIG = {
    environment: 'production',
    apiBaseUrl: 'https://api.macwayneofficial.com/crypto/',
    walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
    infuraProjectId: 'YOUR_INFURA_PROJECT_ID',
    contractAddresses: {
        mwbToken: '0x...',
        stakingPool: '0x...',
        nftMarketplace: '0x...'
    },
    networkConfig: {
        chainId: 1,
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
        blockExplorerUrls: ['https://etherscan.io']
    },
    features: {
        enableTestingUI: false,
        enableDebugMode: false,
        enableAnalytics: true,
        enableErrorReporting: true
    }
};
