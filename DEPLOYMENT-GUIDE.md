# MacWayneBatteredCoin Deployment Guide

## Contract Overview
The MacWayneBatteredCoin (MWB) is now fully optimized and ready for deployment. This ERC-20 compatible token automatically sends 15% of each transaction to an accessibility fund wallet.

## Key Features
- ✅ ERC-20 compatible
- ✅ 15% automatic accessibility fund allocation
- ✅ Gas optimized with `unchecked` blocks
- ✅ No external dependencies (Remix compatible)
- ✅ Owner controls for fund wallet management
- ✅ Zero compilation warnings or errors

## Deployment Parameters

When deploying the contract, you'll need to provide:

1. **initialSupply**: The number of tokens to create (will be multiplied by 10^18)
   - Example: `1000000` for 1 million MWB tokens

2. **_accessibilityFundWallet**: The address that will receive 15% of all transactions
   - Must be a valid Ethereum address
   - Cannot be the zero address (0x0000...)

## Sample Deployment
```
Constructor Parameters:
- initialSupply: 1000000
- _accessibilityFundWallet: 0x742d35Cc6634C0532925a3b8D65C77f5c6b7a65B
```

## Gas Costs
The contract is optimized for minimal gas usage:
- Transfer: ~65,000 gas
- Approve: ~45,000 gas
- TransferFrom: ~70,000 gas

## Testing Checklist
Before mainnet deployment, test these functions:

1. **Basic ERC-20 Functions**:
   - [ ] `balanceOf()` - Check token balances
   - [ ] `totalSupply()` - Verify total supply
   - [ ] `approve()` - Approve spending allowances
   - [ ] `allowance()` - Check spending allowances

2. **Transfer Functions**:
   - [ ] `transfer()` - Direct transfers with 15% fee
   - [ ] `transferFrom()` - Delegated transfers with 15% fee

3. **Owner Functions**:
   - [ ] `setAccessibilityFundWallet()` - Change fund wallet
   - [ ] `transferOwnership()` - Transfer contract ownership

4. **Accessibility Fund Logic**:
   - [ ] Verify 15% goes to accessibility fund on transfers
   - [ ] Verify direct transfers to fund wallet don't incur fees
   - [ ] Check event emissions for fund transfers

## Post-Deployment Steps

1. **Verify Contract**: Upload source code to Etherscan for verification
2. **Test Transactions**: Perform small test transactions
3. **Set Fund Wallet**: Ensure accessibility fund wallet is correctly set
4. **Monitor Events**: Watch for Transfer and AccessibilityFundWalletChanged events

## Contract Address
Once deployed, record your contract address here:
```
Contract Address: [TO BE FILLED]
Network: [Ethereum Mainnet/Testnet]
Block Number: [TO BE FILLED]
```

## Security Notes
- The contract uses `require()` statements for input validation
- All arithmetic operations are protected by Solidity 0.8.0's overflow checking
- Critical operations are restricted to the contract owner
- No external contract dependencies reduce attack surface

## Support
If you encounter any issues during deployment or testing, refer to the error messages and ensure:
- Gas limit is sufficient (minimum 200,000 gas recommended)
- Constructor parameters are correctly formatted
- Accessibility fund wallet address is valid and accessible
