/* Mac Wayne Crypto System - Production Configuration */
window.CRYPTO_CONFIG = {
    environment: 'production',
    apiBaseUrl: 'https://api.macwayneofficial.com/crypto/',
    walletConnectProjectId: '8108c677f442f0194701b6076df5c1a6',
    infuraProjectId: '37b25cd53c7648f69b662609433f87b8',
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

