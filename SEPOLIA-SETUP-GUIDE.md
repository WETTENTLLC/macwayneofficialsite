# Sepolia Testnet Setup Guide

## Step 1: Add Sepolia Network to MetaMask

### Option A: Automatic Addition
1. Go to https://chainlist.org/
2. Search for "Sepolia"
3. Click "Add to MetaMask" for Ethereum Testnet Sepolia
4. Confirm in MetaMask popup

### Option B: Manual Addition
If automatic doesn't work, add manually:
1. Open MetaMask
2. Click network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   ```
   Network Name: Sepolia Test Network
   New RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer URL: https://sepolia.etherscan.io
   ```
5. Save and switch to Sepolia network

## Step 2: Get Test ETH

### Primary Faucets (Choose one):
1. **Sepolia Faucet (Alchemy)**: https://sepoliafaucet.com/
2. **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia
3. **Infura Faucet**: https://www.infura.io/faucet/sepolia

### How to Use Faucets:
1. Copy your MetaMask wallet address
2. Paste into faucet website
3. Complete any verification (captcha, etc.)
4. Wait for test ETH (usually 0.1-0.5 ETH)
5. Check MetaMask balance

### Backup Faucets:
- **PoW Faucet**: https://sepolia-faucet.pk910.de/ (requires mining)
- **Ethereum Faucets**: https://ethereum.org/en/developers/docs/networks/#sepolia

## Step 3: Verify Setup
✅ **Checklist**:
- [ ] MetaMask shows "Sepolia Test Network"
- [ ] Wallet has test ETH (minimum 0.01 ETH needed)
- [ ] Can see balance in MetaMask

## Next: Deploy Contract
Once you have test ETH, we'll deploy your MacWayneBatteredCoin contract!
