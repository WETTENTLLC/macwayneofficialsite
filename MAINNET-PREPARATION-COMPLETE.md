# Mainnet Deployment Preparation Checklist
## (Prepare Now, Deploy Later)

## Required Wallet Addresses

### For Your MacWayneBatteredCoin Deployment:
```
Deployer Address: 0x4DfD91770a25E76DaC064Cb3b632aC86dAC08231
Accessibility Fund: [NEED TO CREATE]
Mac Wayne Fund: [NEED TO CREATE]
```

### Wallet Setup Tasks:
- [ ] Create dedicated accessibility fund wallet
- [ ] Create dedicated Mac Wayne fund wallet  
- [ ] Secure private keys/seed phrases
- [ ] Test wallet access
- [ ] Backup wallet information securely

## Deployment Cost Estimation

### Mainnet Deployment Costs:
```
Contract Deployment: ~1.5M gas
Current ETH Price: ~$3,000
Gas Price Options:
- Low (10 gwei): ~0.015 ETH (~$45)
- Medium (25 gwei): ~0.0375 ETH (~$112)
- High (50 gwei): ~0.075 ETH (~$225)
```

### Best Deployment Times:
- **Weekends**: Lower gas prices
- **Late night UTC**: Reduced network activity
- **Tuesday-Thursday**: Generally cheapest weekdays

## Smart Contract Parameters Ready:
```javascript
Constructor Parameters:
_accessibilityFundWallet: "0x[ACCESSIBILITY_WALLET]"
_macWayneWallet: "0x[MAC_WAYNE_WALLET]"

Initial Supply: 1,000,000 MWB
Decimals: 18
Purchase Limit: 10,000 MWB per address
```

## Post-Deployment Tasks Prepared:
- [ ] Verify contract on Etherscan
- [ ] Add liquidity to DEX (if desired)
- [ ] Set up monitoring for fund wallets
- [ ] Create user documentation
- [ ] Announce contract address publicly

## Security Checklist:
- [ ] Contract code audited ✅
- [ ] Test deployment successful ✅
- [ ] Fund wallets secured
- [ ] Backup deployment private keys
- [ ] Test all admin functions

## When Ready to Deploy:
1. Purchase ETH (~0.1 ETH recommended for safety)
2. Ensure MetaMask on Ethereum Mainnet
3. Use prepared wallet addresses
4. Deploy during low gas period
5. Verify deployment successful
6. Test core functions
7. Announce deployment

## Estimated Total Investment:
- **ETH for deployment**: $50-100
- **ETH for testing**: $20-50
- **Total**: $70-150

## Ready Status: ✅ Contract Prepared, ⏳ Awaiting Deployment Decision
