# Local Hardhat Development Setup
## (No External ETH Required)

## What is Hardhat?
- Professional Ethereum development environment
- Local blockchain simulation
- Comprehensive testing framework
- Used by major DeFi projects

## Setup Steps

### 1. Install Node.js (if not installed)
```powershell
# Check if Node.js is installed
node --version
npm --version
```

### 2. Create Development Project
```powershell
# Navigate to your project directory
cd "c:\Users\wette\OneDrive\Desktop\Mac Wayne Site\deploy-clean"

# Initialize new Node.js project
npm init -y

# Install Hardhat and dependencies
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @openzeppelin/contracts
```

### 3. Initialize Hardhat Project
```powershell
# Create Hardhat project
npx hardhat init

# Select: "Create a JavaScript project"
# Accept all defaults
```

### 4. Add Your Contract
```javascript
// Copy MacWayneBatteredCoin.sol to contracts/ folder
// Create test files in test/ folder
```

### 5. Run Local Tests
```powershell
# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Start local blockchain
npx hardhat node
```

## Benefits:
- ✅ **Professional development workflow**
- ✅ **Comprehensive testing**
- ✅ **Gas estimation**
- ✅ **Deployment simulation**
- ✅ **No external dependencies**

## Time Required: 15-20 minutes
## Cost: $0 (completely free)
