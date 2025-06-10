# MacWayneBatteredCoin Mainnet Wallet Setup

## Required Wallet Addresses

### Accessibility Fund Wallet
**Purpose**: Receives 15% of all transfer fees automatically
**Requirements**:
- Must be a secure wallet you control
- Consider using a multi-sig wallet for added security
- Should be a dedicated wallet for accessibility funding

**Setup Options**:
1. **MetaMask Wallet**: Create new account specifically for accessibility fund
2. **Hardware Wallet**: Ledger/Trezor for maximum security
3. **Multi-Sig Wallet**: Gnosis Safe for team control

### Mac Wayne Fund Wallet  
**Purpose**: Receives 2% of all transfer fees automatically
**Requirements**:
- Must be a secure wallet you control
- Should be separate from accessibility wallet for clear accounting
- Consider using hardware wallet for security

## Wallet Security Checklist

### Before Deployment:
- [ ] Create accessibility fund wallet
- [ ] Create Mac Wayne fund wallet  
- [ ] Backup all private keys/seed phrases securely
- [ ] Test wallet access on mainnet
- [ ] Double-check addresses (no typos!)

### Address Format:
```
Accessibility Fund: 0x1234567890123456789012345678901234567890
Mac Wayne Fund:     0x0987654321098765432109876543210987654321
```

## Deployment Cost Estimate
**Mainnet Deployment**:
- Gas needed: ~1,500,000 gas
- At 20 gwei: ~0.03 ETH (~$50-80)
- At 50 gwei: ~0.075 ETH (~$125-200)

**Recommendation**: Deploy during low gas periods (weekends/late night UTC)

## Post-Deployment Actions

1. **Verify Contract**: 
   - Add to Etherscan for transparency
   - Verify source code matches

2. **Set Up Monitoring**:
   - Watch accessibility fund receiving fees
   - Track Mac Wayne fund accumulation
   - Monitor total supply and circulation

3. **Create Documentation**:
   - Share contract address publicly
   - Document fund allocation transparency
   - Create user guides for token holders

## Security Notes

⚠️ **Critical**: 
- Fund wallets cannot be changed after deployment
- Choose addresses carefully
- Test thoroughly on testnet first
- Keep private keys secure

✅ **Built-in Security**:
- Owner can manage exemptions
- Purchase limits prevent large dumps
- Emergency ETH withdrawal function
- No mint/burn functions (fixed supply)
