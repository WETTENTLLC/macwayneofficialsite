# MacWayneBatteredCoin Deployment Checklist

## Pre-Deployment Setup ✅

- [x] Contract compiles successfully in Remix
- [x] Zero compilation errors
- [x] Zero compilation warnings
- [ ] Prepare fund wallet addresses

## Required Addresses

### Accessibility Fund Wallet
```
Address: 0x_________________ (Replace with actual address)
Purpose: Receives 15% of all non-exempt transfers
Access: Should be a secure wallet you control
```

### Mac Wayne Fund Wallet
```
Address: 0x_________________ (Replace with actual address)  
Purpose: Receives 2% of all non-exempt transfers
Access: Should be a secure wallet you control
```

## Deployment Steps

### 1. Network Selection
- [ ] **Testnet First** (Recommended: Sepolia or Goerli)
  - Test all functions
  - Verify fee calculations
  - Test admin controls
- [ ] **Mainnet** (When testing complete)

### 2. Remix Deployment
1. [ ] Open Remix IDE
2. [ ] Paste your working contract code
3. [ ] Verify green checkmark in Solidity Compiler
4. [ ] Switch to "Deploy & Run Transactions" tab
5. [ ] Connect MetaMask (Injected Provider)
6. [ ] Select correct network in MetaMask
7. [ ] Enter constructor parameters:
   - `_accessibilityFundWallet`: Your accessibility fund address
   - `_macWayneWallet`: Your Mac Wayne fund address
8. [ ] Click "Deploy"
9. [ ] Confirm transaction in MetaMask
10. [ ] Wait for deployment confirmation

### 3. Post-Deployment Verification
- [ ] Contract address received
- [ ] Verify owner is deployer address
- [ ] Check initial supply (1,000,000 MWB)
- [ ] Verify fund wallet addresses set correctly
- [ ] Test basic transfer function
- [ ] Verify fee calculations work
- [ ] Test admin functions (if needed)

## Function Testing Checklist

### Basic ERC-20 Functions
- [ ] `name()` returns "Mac Wayne Battered Coin"
- [ ] `symbol()` returns "MWB"  
- [ ] `decimals()` returns 18
- [ ] `totalSupply()` returns 1000000000000000000000000 (1M * 10^18)
- [ ] `balanceOf(owner)` shows full initial supply

### Transfer Functions
- [ ] `transfer()` works with fee deduction
- [ ] `transferFrom()` works with allowance
- [ ] `approve()` sets allowances correctly

### Fee System
- [ ] Non-exempt transfers deduct 17% total fees (15% + 2%)
- [ ] Exempt addresses transfer full amounts
- [ ] Fund wallets receive correct percentages

### Admin Functions
- [ ] `setAccessibilityFundWallet()` works
- [ ] `setMacWayneWallet()` works  
- [ ] `setFeeExempt()` works
- [ ] `setLimitExempt()` works
- [ ] `setPurchaseLimitsEnabled()` works
- [ ] `transferOwnership()` works

### Purchase Limits
- [ ] Default limit is 10,000 MWB per address
- [ ] Limits enforced when enabled
- [ ] Exempt addresses bypass limits
- [ ] `getRemainingPurchaseAllowance()` returns correct values

## Security Considerations

### Contract Security
- [x] Owner-only functions protected
- [x] Zero address checks implemented
- [x] Balance validation prevents errors
- [x] Allowance validation prevents unauthorized transfers

### Wallet Security
- [ ] Use hardware wallet for deployment
- [ ] Secure storage of fund wallet private keys
- [ ] Multi-signature wallets recommended for fund addresses
- [ ] Test with small amounts first

## Gas Estimates

Approximate gas costs (varies by network):
- **Deployment**: ~1,200,000 gas
- **Transfer**: ~65,000 gas
- **Transfer with fees**: ~85,000 gas
- **Admin functions**: ~45,000 gas

## Emergency Procedures

### If Issues Found
1. [ ] Document the issue
2. [ ] Stop recommending usage
3. [ ] Deploy corrected version if needed
4. [ ] Notify users of new contract address

### Owner Key Security
- [ ] Backup private keys securely
- [ ] Consider multi-sig for owner functions
- [ ] Plan ownership transfer procedure

## Success Metrics

### Day 1
- [ ] Successful deployment
- [ ] Basic functions working
- [ ] First transfers completed

### Week 1  
- [ ] Fee system functioning correctly
- [ ] Fund wallets receiving payments
- [ ] No critical issues reported

### Month 1
- [ ] Significant transaction volume
- [ ] Accessibility fund growing
- [ ] Community adoption

## Contract Information Template

Once deployed, save this information:

```
Contract Name: MacWayneBatteredCoin
Symbol: MWB
Network: _________ 
Contract Address: 0x_________________
Deployment Block: _________
Owner Address: 0x_________________
Accessibility Fund: 0x_________________
Mac Wayne Fund: 0x_________________
Deployment Date: _________
Deployment TX: 0x_________________
```

---

**Ready for deployment! Your contract is Remix-optimized and production-ready.** 🚀
