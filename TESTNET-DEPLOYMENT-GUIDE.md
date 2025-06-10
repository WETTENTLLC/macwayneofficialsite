# MacWayneBatteredCoin Testnet Deployment Guide

## Why Test First?
- ✅ Verify all functions work correctly
- ✅ Test fee calculations (15% + 2%)
- ✅ Validate purchase limits
- ✅ Check admin controls
- ✅ No risk to real funds

## Quick Testnet Setup

### 1. Get Test ETH
**Sepolia Testnet** (Recommended):
- Faucet: https://sepoliafaucet.com/
- MetaMask Network: Add Sepolia if not present

**Alternative - Goerli Testnet**:
- Faucet: https://goerlifaucet.com/
- More faucets available

### 2. Prepare Test Wallet Addresses
For testing, you can use:
- **Accessibility Fund**: Any address you control (can be same as deployer)
- **Mac Wayne Fund**: Any address you control (can be same as deployer)

Example using your deployer address for both:
```
AccessibilityFundWallet: 0xYourAddress
MacWayneWallet: 0xYourAddress
```

### 3. Deploy in Remix
1. Open https://remix.ethereum.org/
2. Paste your `MacWayneBatteredCoin.sol` contract
3. Compile (should show green checkmark)
4. Go to "Deploy & Run Transactions"
5. Set Environment to "Injected Provider - MetaMask"
6. Ensure MetaMask is on Sepolia testnet
7. Enter constructor parameters:
   - `_accessibilityFundWallet`: 0xYourTestAddress
   - `_macWayneWallet`: 0xYourTestAddress
8. Click "Deploy"
9. Confirm in MetaMask

### 4. Test Functions
After deployment, test these functions in Remix:

**Basic ERC-20 Functions:**
- `balanceOf(yourAddress)` → Should show 1,000,000 MWB
- `totalSupply()` → Should show 1,000,000,000,000,000,000,000,000
- `name()` → "Mac Wayne Battered Coin"
- `symbol()` → "MWB"

**Fee Testing:**
1. Transfer 1000 MWB to another address
2. Check recipient balance → Should receive 830 MWB (83% after fees)
3. Check accessibility wallet → Should receive 150 MWB (15%)
4. Check Mac Wayne wallet → Should receive 20 MWB (2%)

**Admin Functions:**
- `setFeeExempt(address, true)` → Exempt an address from fees
- `setMaxPurchasePerAddress(amount)` → Change purchase limits

## Next: Mainnet Deployment
Once testnet testing is successful, proceed with mainnet deployment using real wallet addresses.

## Need Help?
If any function doesn't work as expected, we can debug on testnet without risk.
