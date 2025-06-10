# MacWayneBatteredCoin Deployment Script
# Automates testing and deployment process

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("test", "deploy", "verify")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("sepolia", "goerli", "mainnet")]
    [string]$Network = "sepolia",
    
    [Parameter(Mandatory=$false)]
    [string]$AccessibilityWallet = "",
    
    [Parameter(Mandatory=$false)]
    [string]$MacWayneWallet = ""
)

Write-Host "=== MacWayneBatteredCoin Deployment Assistant ===" -ForegroundColor Cyan
Write-Host "Action: $Action" -ForegroundColor Yellow
Write-Host "Network: $Network" -ForegroundColor Yellow
Write-Host ""

# Check if Solidity files exist
$contractPath = ".\MacWayneBatteredCoin.sol"
$testSuitePath = ".\MWBTestSuite.sol"

if (-not (Test-Path $contractPath)) {
    Write-Host "ERROR: MacWayneBatteredCoin.sol not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $testSuitePath)) {
    Write-Host "ERROR: MWBTestSuite.sol not found!" -ForegroundColor Red
    exit 1
}

switch ($Action) {
    "test" {
        Write-Host "🧪 TESTING MODE" -ForegroundColor Green
        Write-Host ""
        Write-Host "Pre-deployment Testing Checklist:" -ForegroundColor Cyan
        Write-Host ""
        
        # Compile main contract
        Write-Host "1. Compiling MacWayneBatteredCoin.sol..." -ForegroundColor Yellow
        try {
            # Use solc if available, otherwise provide Remix instructions
            if (Get-Command solc -ErrorAction SilentlyContinue) {
                solc --version
                solc --optimize --bin --abi $contractPath
                Write-Host "✅ Compilation successful" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Local Solidity compiler not found" -ForegroundColor Yellow
                Write-Host "   Please compile in Remix IDE:" -ForegroundColor Cyan
                Write-Host "   1. Open https://remix.ethereum.org" -ForegroundColor Cyan
                Write-Host "   2. Create new file: MacWayneBatteredCoin.sol" -ForegroundColor Cyan
                Write-Host "   3. Paste contract code" -ForegroundColor Cyan
                Write-Host "   4. Compile and look for green checkmark ✅" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "❌ Compilation failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "2. Testing Contract Functions..." -ForegroundColor Yellow        Write-Host "   📋 Contract Features to Test:" -ForegroundColor Cyan
        Write-Host "   • Basic ERC-20 functions (name, symbol, decimals, totalSupply)" -ForegroundColor White
        Write-Host "   • Transfer with 17 percent total fees (15 percent accessibility + 2 percent Mac Wayne)" -ForegroundColor White
        Write-Host "   • Fee exemption system" -ForegroundColor White
        Write-Host "   • Purchase limit enforcement" -ForegroundColor White
        Write-Host "   • Admin controls (owner functions)" -ForegroundColor White
        Write-Host "   • Approval and allowance system" -ForegroundColor White
        
        Write-Host ""
        Write-Host "3. Deploy Test Suite..." -ForegroundColor Yellow
        Write-Host "   📝 Use MWBTestSuite.sol in Remix to run comprehensive tests" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "4. Manual Testing Steps:" -ForegroundColor Yellow
        Write-Host "   a) Deploy contract with test wallet addresses" -ForegroundColor Cyan
        Write-Host "   b) Verify initial supply (1,000,000 MWB)" -ForegroundColor Cyan
        Write-Host "   c) Test transfer between non-exempt addresses" -ForegroundColor Cyan
        Write-Host "   d) Verify 15% goes to accessibility fund" -ForegroundColor Cyan
        Write-Host "   e) Verify 2% goes to Mac Wayne fund" -ForegroundColor Cyan
        Write-Host "   f) Test admin functions" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "✅ Testing checklist complete!" -ForegroundColor Green
        Write-Host "Ready for deployment when all tests pass." -ForegroundColor Green
    }
    
    "deploy" {
        Write-Host "🚀 DEPLOYMENT MODE" -ForegroundColor Green
        Write-Host ""
        
        # Validate wallet addresses
        if ([string]::IsNullOrEmpty($AccessibilityWallet) -or [string]::IsNullOrEmpty($MacWayneWallet)) {
            Write-Host "❌ ERROR: Both wallet addresses required for deployment!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Usage:" -ForegroundColor Yellow
            Write-Host ".\deploy-mwb.ps1 -Action deploy -Network sepolia -AccessibilityWallet 0x... -MacWayneWallet 0x..." -ForegroundColor Cyan
            exit 1
        }
        
        # Validate Ethereum addresses
        $addressPattern = "^0x[a-fA-F0-9]{40}$"
        if ($AccessibilityWallet -notmatch $addressPattern) {
            Write-Host "❌ ERROR: Invalid accessibility wallet address format!" -ForegroundColor Red
            exit 1
        }
        if ($MacWayneWallet -notmatch $addressPattern) {
            Write-Host "❌ ERROR: Invalid Mac Wayne wallet address format!" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "📋 Deployment Configuration:" -ForegroundColor Cyan
        Write-Host "Network: $Network" -ForegroundColor White
        Write-Host "Accessibility Fund Wallet: $AccessibilityWallet" -ForegroundColor White
        Write-Host "Mac Wayne Fund Wallet: $MacWayneWallet" -ForegroundColor White
        Write-Host ""
        
        Write-Host "🔧 Deployment Steps:" -ForegroundColor Yellow
        Write-Host ""
        
        Write-Host "1. Open Remix IDE (https://remix.ethereum.org)" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "2. Create and paste MacWayneBatteredCoin.sol" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "3. Compile contract (ensure green checkmark ✅)" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "4. Deploy & Run Transactions tab" -ForegroundColor Cyan
        Write-Host "   • Environment: Injected Provider (MetaMask)" -ForegroundColor White
        Write-Host "   • Account: Select deployment account" -ForegroundColor White
        Write-Host "   • Contract: MacWayneBatteredCoin" -ForegroundColor White
        Write-Host ""
        
        Write-Host "5. Constructor Parameters:" -ForegroundColor Cyan
        Write-Host "   _ACCESSIBILITYFUNDWALLET: $AccessibilityWallet" -ForegroundColor Green
        Write-Host "   _MACWAYNEWALLET: $MacWayneWallet" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "6. Click Deploy and confirm transaction" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "7. Save deployment information:" -ForegroundColor Cyan
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $deploymentInfo = @"

=== DEPLOYMENT RECORD ===
Timestamp: $timestamp
Network: $Network
Contract: MacWayneBatteredCoin (MWB)
Accessibility Wallet: $AccessibilityWallet  
Mac Wayne Wallet: $MacWayneWallet
Contract Address: [TO BE FILLED AFTER DEPLOYMENT]
Deployment TX: [TO BE FILLED AFTER DEPLOYMENT]
Deployer: [YOUR WALLET ADDRESS]
Gas Used: [TO BE FILLED AFTER DEPLOYMENT]

Initial Configuration:
- Total Supply: 1,000,000 MWB
- Decimals: 18
- Accessibility Fee: 15%
- Mac Wayne Fee: 2%
- Purchase Limit: 10,000 MWB per address
- Purchase Limits: Enabled

"@
        
        $deploymentInfo | Out-File -FilePath "DEPLOYMENT-RECORD-$Network.txt" -Encoding UTF8
        Write-Host "   📝 Deployment record template created: DEPLOYMENT-RECORD-$Network.txt" -ForegroundColor Green
        Write-Host "   📝 Fill in contract address and transaction hash after deployment" -ForegroundColor Yellow
        
        Write-Host ""
        Write-Host "⚠️  IMPORTANT POST-DEPLOYMENT STEPS:" -ForegroundColor Yellow
        Write-Host "1. Verify contract address and transaction" -ForegroundColor Cyan
        Write-Host "2. Test basic functions (name, symbol, totalSupply)" -ForegroundColor Cyan
        Write-Host "3. Test transfer functionality" -ForegroundColor Cyan
        Write-Host "4. Verify fee distribution" -ForegroundColor Cyan
        Write-Host "5. Update DEPLOYMENT-RECORD-$Network.txt with actual values" -ForegroundColor Cyan
    }
    
    "verify" {
        Write-Host "🔍 VERIFICATION MODE" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Post-Deployment Verification Checklist:" -ForegroundColor Cyan
        Write-Host ""
        
        $verificationSteps = @(
            "✅ Contract deployed successfully",
            "✅ Contract address obtained", 
            "✅ Deployment transaction confirmed",
            "✅ Contract name returns 'Mac Wayne Battered Coin'",
            "✅ Contract symbol returns 'MWB'",
            "✅ Contract decimals returns 18",
            "✅ Total supply is 1,000,000 * 10^18",
            "✅ Owner is deployer address",
            "✅ Accessibility wallet set correctly",
            "✅ Mac Wayne wallet set correctly",
            "✅ Owner has fee exemption",
            "✅ Fund wallets have fee exemption",
            "✅ Purchase limits enabled",
            "✅ Max purchase per address is 10,000 MWB",
            "✅ Owner has limit exemption",
            "✅ Test transfer works",
            "✅ Fees calculated correctly (17% total)",
            "✅ Accessibility fund receives 15%",
            "✅ Mac Wayne fund receives 2%",
            "✅ Admin functions work (owner only)",
            "✅ Emergency functions present"
        )
        
        foreach ($step in $verificationSteps) {
            Write-Host "□ $step" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "📝 Verification Commands (use in Remix or web3 console):" -ForegroundColor Cyan
        Write-Host ""
        
        $verificationCommands = @"
// Basic Info Verification
contract.name()                    // Should return "Mac Wayne Battered Coin"
contract.symbol()                  // Should return "MWB"  
contract.decimals()                // Should return 18
contract.totalSupply()             // Should return 1000000000000000000000000

// Wallet Verification
contract.owner()                   // Should return deployer address
contract.accessibilityFundWallet() // Should return accessibility wallet
contract.macWayneWallet()         // Should return Mac Wayne wallet

// Balance Verification  
contract.balanceOf(owner)          // Should return total supply
contract.balanceOf(accessibilityWallet) // Should return 0 initially
contract.balanceOf(macWayneWallet)      // Should return 0 initially

// Settings Verification
contract.feeExempt(owner)          // Should return true
contract.feeExempt(accessibilityWallet) // Should return true  
contract.feeExempt(macWayneWallet)      // Should return true
contract.purchaseLimitsEnabled()   // Should return true
contract.maxPurchasePerAddress()   // Should return 10000000000000000000000

// Test Transfer (replace addresses with actual values)
contract.transfer("0x...", "1000000000000000000") // Transfer 1 MWB
// Check balances after transfer to verify fees
"@
        
        $verificationCommands | Out-File -FilePath "VERIFICATION-COMMANDS.txt" -Encoding UTF8
        Write-Host "📝 Verification commands saved to: VERIFICATION-COMMANDS.txt" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎯 Success Criteria:" -ForegroundColor Green
        Write-Host "• All basic info functions return correct values" -ForegroundColor White
        Write-Host "• Fund wallets are set correctly" -ForegroundColor White  
        Write-Host "• Fee exemptions work as expected" -ForegroundColor White
        Write-Host "• 17% total fees are distributed correctly (15% + 2%)" -ForegroundColor White
        Write-Host "• Admin functions are owner-protected" -ForegroundColor White
        Write-Host "• Purchase limits function properly" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=== Deployment Assistant Complete ===" -ForegroundColor Cyan
Write-Host ""

if ($Action -eq "deploy") {
    Write-Host "🚀 Ready to deploy to $Network network!" -ForegroundColor Green
    Write-Host "📋 Use the steps above to deploy via Remix IDE" -ForegroundColor Yellow
} elseif ($Action -eq "test") {
    Write-Host "🧪 Complete testing before proceeding to deployment" -ForegroundColor Yellow
    Write-Host "📋 Run: .\deploy-mwb.ps1 -Action deploy -Network sepolia -AccessibilityWallet 0x... -MacWayneWallet 0x..." -ForegroundColor Cyan
} else {
    Write-Host "🔍 Use verification steps to confirm successful deployment" -ForegroundColor Yellow
}

Write-Host ""
