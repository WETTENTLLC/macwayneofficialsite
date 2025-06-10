# MetaMask Security & Testnet Setup Verification

## ⚠️ CRITICAL SECURITY WARNING ⚠️

**NEVER share:**
- Private keys
- Seed phrases (12/24 words)
- Wallet passwords
- Any sensitive wallet data

## Safe Wallet Verification Steps

### 1. Check Your MetaMask Setup (Safe Method)

**What you can safely share:**
- Your public wallet address (starts with 0x...)
- Network you're connected to
- ETH balance amount

**What to check privately:**
1. Open MetaMask extension
2. Verify you're on the correct network
3. Check your public address format
4. Confirm ETH balance

### 2. Testnet Setup Verification

#### Step A: Network Check
- [ ] MetaMask shows "Sepolia Test Network" at the top
- [ ] If not, add Sepolia network (see guide below)

#### Step B: Address Format Check
Your public address should:
- [ ] Start with "0x"
- [ ] Be 42 characters long (including 0x)
- [ ] Example format: 0x1234567890123456789012345678901234567890

#### Step C: Test ETH Balance
- [ ] Shows ETH balance (not 0.000)
- [ ] Minimum 0.01 ETH needed for deployment

### 3. Add Sepolia Network (If Missing)

**Method 1: Automatic (Recommended)**
1. Go to: https://chainlist.org/
2. Search "Sepolia"
3. Click "Add to MetaMask" for Ethereum Testnet Sepolia
4. Approve in MetaMask

**Method 2: Manual Setup**
1. MetaMask → Network dropdown → "Add network"
2. Enter these details:
   ```
   Network Name: Sepolia Test Network
   New RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```

### 4. Get Test ETH (If Balance is 0)

**Recommended Faucets:**
1. **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
2. **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia
3. **Infura Faucet**: https://www.infura.io/faucet/sepolia

**How to use:**
1. Copy your public address from MetaMask
2. Paste into faucet website
3. Complete verification (captcha)
4. Wait for test ETH (usually 0.1-0.5 ETH)

### 5. Deployment-Ready Checklist

- [ ] MetaMask connected to Sepolia testnet
- [ ] Public address is valid format (0x...)
- [ ] Test ETH balance > 0.01 ETH
- [ ] Can see network name "Sepolia Test Network"

## Next Steps for Contract Deployment

Once your testnet setup is verified:

1. **Get your public address** (safe to share):
   - Copy from MetaMask (the 0x... address)
   - This will be used for constructor parameters

2. **Use for testing**:
   - Accessibility Fund Wallet: Your public address
   - Mac Wayne Wallet: Your public address
   - (For testnet only - use separate addresses for mainnet)

3. **Deploy in Remix**:
   - Go to https://remix.ethereum.org/
   - Use your MacWayneBatteredCoin.sol contract
   - Connect MetaMask as "Injected Provider"

## Security Best Practices

✅ **Safe to Share:**
- Public wallet address (0x...)
- Network you're using
- ETH balance amounts
- Transaction hashes after deployment

❌ **NEVER Share:**
- Private keys
- Seed phrases
- Wallet passwords
- Any data marked as "private" in wallet

## Need Help?

Share only your:
- Public address (0x...)
- Current network name
- ETH balance amount
- Any error messages you see

This allows safe troubleshooting without security risks!
