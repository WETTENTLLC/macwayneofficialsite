# MacWayneBatteredCoin Testnet Deployment Tracker

## Pre-Deployment Checklist
- [ ] MetaMask connected to Sepolia testnet
- [ ] Test ETH available (minimum 0.01 ETH)
- [ ] Wallet addresses prepared for constructor

## Test Wallet Addresses
For testnet, you can use your own address for both fund wallets:

```
Your Deployer Address: 0x_________________
Accessibility Fund:    0x_________________ (can be same as deployer)
Mac Wayne Fund:        0x_________________ (can be same as deployer)
```

## Deployment Steps

### 1. Open Remix IDE
- Go to: https://remix.ethereum.org/
- Create new file: `MacWayneBatteredCoin.sol`
- Paste your contract code

### 2. Compile Contract
- Go to "Solidity Compiler" tab
- Select compiler version: `0.8.19+`
- Click "Compile MacWayneBatteredCoin.sol"
- ✅ Verify: Green checkmark with no errors

### 3. Deploy Contract
- Go to "Deploy & Run Transactions" tab
- Environment: "Injected Provider - MetaMask"
- Account: Your address with test ETH
- Contract: "MacWayneBatteredCoin"
- Constructor parameters:
  - `_accessibilityFundWallet`: Your test address
  - `_macWayneWallet`: Your test address
- Click "Deploy"
- Confirm in MetaMask

### 4. Post-Deployment Testing

After deployment, test these functions in Remix:

#### Basic Information:
```javascript
// Should return: "Mac Wayne Battered Coin"
name()

// Should return: "MWB"  
symbol()

// Should return: 18
decimals()

// Should return: 1000000000000000000000000 (1M * 10^18)
totalSupply()

// Should return: 1000000000000000000000000
balanceOf("YOUR_DEPLOYER_ADDRESS")
```

#### Fee Testing:
1. Get a second address (create new MetaMask account)
2. Transfer 1000 MWB to the second address:
   ```javascript
   transfer("SECOND_ADDRESS", "1000000000000000000000")
   ```
3. Check balances:
   ```javascript
   // Second address should have: 830 MWB (83% after fees)
   balanceOf("SECOND_ADDRESS")
   
   // Accessibility fund should have: 150 MWB (15% fee)
   balanceOf("ACCESSIBILITY_FUND_ADDRESS")
   
   // Mac Wayne fund should have: 20 MWB (2% fee)
   balanceOf("MAC_WAYNE_FUND_ADDRESS")
   ```

#### Admin Functions:
```javascript
// Check owner
owner()

// Test exemption setting
setFeeExempt("SOME_ADDRESS", true)

// Test purchase limit changes
setMaxPurchasePerAddress("5000000000000000000000")
```

## Expected Results

### Successful Deployment:
- ✅ Contract deployed with transaction hash
- ✅ Contract address generated
- ✅ All view functions return correct values
- ✅ Fee calculations work correctly (15% + 2% = 17% total)
- ✅ Admin functions accessible to owner only

### Test Transaction Example:
```
Transfer 1000 MWB:
- Sender loses: 1000 MWB
- Recipient gets: 830 MWB  
- Accessibility fund gets: 150 MWB
- Mac Wayne fund gets: 20 MWB
- Total fees: 170 MWB (17%)
```

## Troubleshooting

### Common Issues:
1. **"Insufficient funds"**: Need more test ETH
2. **"Transaction failed"**: Check gas limit (try 3,000,000)
3. **"Invalid address"**: Ensure addresses are valid Ethereum format
4. **"Compilation error"**: Verify Solidity version 0.8.19+

### If Deployment Fails:
1. Check MetaMask is on Sepolia network
2. Verify you have enough test ETH
3. Try increasing gas limit
4. Ensure constructor addresses are valid

## Success Criteria
When all tests pass, your contract is ready for mainnet deployment with real fund wallet addresses!

## Next Steps After Successful Testing:
1. Document contract address
2. Save deployment transaction hash
3. Proceed to mainnet with confidence
4. Set up real accessibility and Mac Wayne fund wallets
