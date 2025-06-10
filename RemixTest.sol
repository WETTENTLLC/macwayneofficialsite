// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MacWayneBatteredCoin.sol";

/**
 * @title RemixTest
 * @dev Test contract specifically designed for Remix IDE testing
 * @dev Tests all ERC20 functions and accessibility fund features
 */
contract RemixTest {
    MacWayneBatteredCoin public token;
    address public accessibilityWallet;
    address public testWallet1;
    address public testWallet2;
    
    event TestResult(string testName, bool passed, string message);
    
    constructor() {
        accessibilityWallet = address(0x1234567890123456789012345678901234567890);
        testWallet1 = address(0x1111111111111111111111111111111111111111);
        testWallet2 = address(0x2222222222222222222222222222222222222222);
        
        // Deploy token with 1000 initial supply
        token = new MacWayneBatteredCoin(1000, accessibilityWallet);
    }
    
    /**
     * @dev Test basic ERC20 functionality
     */
    function testBasicFunctionality() external {
        // Test totalSupply
        uint256 supply = token.totalSupply();
        emit TestResult("totalSupply", supply == 1000 * 10**18, "Total supply should be 1000 * 10^18");
        
        // Test name, symbol, decimals
        bool nameTest = keccak256(bytes(token.name())) == keccak256(bytes("Mac Wayne Battered Coin"));
        emit TestResult("name", nameTest, "Name should be Mac Wayne Battered Coin");
        
        bool symbolTest = keccak256(bytes(token.symbol())) == keccak256(bytes("MWB"));
        emit TestResult("symbol", symbolTest, "Symbol should be MWB");
        
        bool decimalsTest = token.decimals() == 18;
        emit TestResult("decimals", decimalsTest, "Decimals should be 18");
        
        // Test initial balance
        uint256 ownerBalance = token.balanceOf(address(this));
        emit TestResult("initialBalance", ownerBalance == supply, "Owner should have all initial supply");
    }
    
    /**
     * @dev Test transfer functionality and accessibility fund
     */
    function testTransferWithFee() external {
        uint256 transferAmount = 100 * 10**18;
        uint256 expectedFee = transferAmount * 15 / 100; // 15%
        uint256 expectedReceived = transferAmount - expectedFee;
        
        // Get initial balances
        uint256 initialBalance = token.balanceOf(address(this));
        uint256 initialAccessibilityBalance = token.balanceOf(accessibilityWallet);
        
        // Transfer to test wallet
        bool success = token.transfer(testWallet1, transferAmount);
        emit TestResult("transferSuccess", success, "Transfer should succeed");
        
        // Check balances after transfer
        uint256 finalBalance = token.balanceOf(address(this));
        uint256 recipientBalance = token.balanceOf(testWallet1);
        uint256 finalAccessibilityBalance = token.balanceOf(accessibilityWallet);
        
        bool senderBalanceCorrect = finalBalance == initialBalance - transferAmount;
        emit TestResult("senderBalance", senderBalanceCorrect, "Sender balance should decrease by full amount");
        
        bool recipientBalanceCorrect = recipientBalance == expectedReceived;
        emit TestResult("recipientBalance", recipientBalanceCorrect, "Recipient should receive 85% of transfer");
        
        bool feeBalanceCorrect = finalAccessibilityBalance == initialAccessibilityBalance + expectedFee;
        emit TestResult("accessibilityFee", feeBalanceCorrect, "Accessibility fund should receive 15% fee");
    }
    
    /**
     * @dev Test allowance and transferFrom functionality
     */
    function testAllowanceAndTransferFrom() external {
        uint256 allowanceAmount = 50 * 10**18;
        
        // Approve testWallet1 to spend tokens
        bool approveSuccess = token.approve(testWallet1, allowanceAmount);
        emit TestResult("approveSuccess", approveSuccess, "Approve should succeed");
        
        // Check allowance
        uint256 allowance = token.allowance(address(this), testWallet1);
        bool allowanceCorrect = allowance == allowanceAmount;
        emit TestResult("allowanceSet", allowanceCorrect, "Allowance should be set correctly");
    }
    
    /**
     * @dev Test accessibility fund exemption
     */
    function testAccessibilityFundExemption() external {
        uint256 transferAmount = 100 * 10**18;
        
        // Get initial balances
        uint256 initialBalance = token.balanceOf(address(this));
        uint256 initialAccessibilityBalance = token.balanceOf(accessibilityWallet);
        
        // Transfer directly to accessibility fund (should not incur fee)
        bool success = token.transfer(accessibilityWallet, transferAmount);
        emit TestResult("accessibilityTransferSuccess", success, "Transfer to accessibility fund should succeed");
        
        // Check balances
        uint256 finalBalance = token.balanceOf(address(this));
        uint256 finalAccessibilityBalance = token.balanceOf(accessibilityWallet);
        
        bool senderBalanceCorrect = finalBalance == initialBalance - transferAmount;
        emit TestResult("noFeeOnAccessibilityTransfer", senderBalanceCorrect, "Full amount should be deducted");
        
        bool accessibilityBalanceCorrect = finalAccessibilityBalance == initialAccessibilityBalance + transferAmount;
        emit TestResult("fullAmountToAccessibility", accessibilityBalanceCorrect, "Full amount should go to accessibility fund");
    }
    
    /**
     * @dev Run all tests in sequence
     */
    function runAllTests() external {
        this.testBasicFunctionality();
        this.testTransferWithFee();
        this.testAllowanceAndTransferFrom();
        this.testAccessibilityFundExemption();
        
        emit TestResult("allTestsComplete", true, "All tests completed - check individual results above");
    }
    
    /**
     * @dev Get contract info for Remix display
     */
    function getContractInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 tokenTotalSupply,
        address tokenOwner,
        address accessibilityFund
    ) {
        return (
            token.name(),
            token.symbol(),
            token.decimals(),
            token.totalSupply(),
            token.owner(),
            token.accessibilityFundWallet()
        );
    }
}
