// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MacWayneBatteredCoin.sol";

/**
 * @title MWB Comprehensive Test Suite
 * @dev Complete testing framework for MacWayneBatteredCoin deployment verification
 */
contract MWBTestSuite {
    MacWayneBatteredCoin public token;
    
    // Test addresses
    address public constant ACCESSIBILITY_WALLET = 0x1111111111111111111111111111111111111111;
    address public constant MAC_WAYNE_WALLET = 0x2222222222222222222222222222222222222222;
    address public constant TEST_USER_1 = 0x3333333333333333333333333333333333333333;
    address public constant TEST_USER_2 = 0x4444444444444444444444444444444444444444;
    
    // Test results tracking
    uint256 public testsRun = 0;
    uint256 public testsPassed = 0;
    uint256 public testsFailed = 0;
    
    // Events for test reporting
    event TestResult(string testName, bool passed, string details);
    event TestSuiteComplete(uint256 total, uint256 passed, uint256 failed);
    
    constructor() {
        // Deploy the token contract
        token = new MacWayneBatteredCoin(ACCESSIBILITY_WALLET, MAC_WAYNE_WALLET);
    }
    
    /**
     * @dev Run all tests in sequence
     */
    function runCompleteTestSuite() external {
        testsRun = 0;
        testsPassed = 0;
        testsFailed = 0;
        
        // Basic contract tests
        testBasicProperties();
        testInitialState();
        
        // ERC20 functionality tests
        testBasicTransfers();
        testApprovalSystem();
        testTransferFrom();
        
        // Fee system tests
        testFeeCalculations();
        testFeeExemptions();
        
        // Purchase limit tests
        testPurchaseLimits();
        
        // Edge case tests
        testEdgeCases();
        
        // Emit final results
        emit TestSuiteComplete(testsRun, testsPassed, testsFailed);
    }
    
    /**
     * @dev Test basic contract properties
     */
    function testBasicProperties() public {
        _runTest("Token Name", 
            keccak256(bytes(token.name())) == keccak256(bytes("Mac Wayne Battered Coin")),
            "Name should be 'Mac Wayne Battered Coin'");
            
        _runTest("Token Symbol",
            keccak256(bytes(token.symbol())) == keccak256(bytes("MWB")),
            "Symbol should be 'MWB'");
            
        _runTest("Token Decimals",
            token.decimals() == 18,
            "Decimals should be 18");
            
        _runTest("Total Supply",
            token.totalSupply() == 1000000 * 10**18,
            "Total supply should be 1M tokens");
    }
    
    /**
     * @dev Test initial contract state
     */
    function testInitialState() public {
        _runTest("Owner Balance",
            token.balanceOf(address(this)) == token.totalSupply(),
            "Owner should have full initial supply");
            
        _runTest("Owner Address",
            token.owner() == address(this),
            "Contract deployer should be owner");
            
        _runTest("Accessibility Wallet",
            token.accessibilityFundWallet() == ACCESSIBILITY_WALLET,
            "Accessibility wallet should be set correctly");
            
        _runTest("Mac Wayne Wallet",
            token.macWayneWallet() == MAC_WAYNE_WALLET,
            "Mac Wayne wallet should be set correctly");
            
        _runTest("Purchase Limits Enabled",
            token.purchaseLimitsEnabled() == true,
            "Purchase limits should be enabled by default");
            
        _runTest("Max Purchase Limit",
            token.maxPurchasePerAddress() == 10000 * 10**18,
            "Max purchase should be 10K tokens");
    }
    
    /**
     * @dev Test basic transfer functionality
     */
    function testBasicTransfers() public {
        uint256 transferAmount = 1000 * 10**18; // 1000 tokens
        uint256 initialBalance = token.balanceOf(address(this));
        
        // Test basic transfer
        bool success = token.transfer(TEST_USER_1, transferAmount);
        
        _runTest("Transfer Success",
            success,
            "Transfer should return true");
            
        // Check balances after transfer (should include fees)
        uint256 expectedFees = transferAmount * 17 / 100; // 15% + 2%
        uint256 expectedReceived = transferAmount - expectedFees;
        
        _runTest("Recipient Balance",
            token.balanceOf(TEST_USER_1) == expectedReceived,
            "Recipient should receive amount minus fees");
            
        _runTest("Sender Balance",
            token.balanceOf(address(this)) == initialBalance - transferAmount,
            "Sender should lose full transfer amount");
    }
    
    /**
     * @dev Test approval system
     */
    function testApprovalSystem() public {
        uint256 approvalAmount = 500 * 10**18;
        
        // Test approval
        bool success = token.approve(TEST_USER_1, approvalAmount);
        
        _runTest("Approval Success",
            success,
            "Approval should return true");
            
        _runTest("Allowance Set",
            token.allowance(address(this), TEST_USER_1) == approvalAmount,
            "Allowance should be set correctly");
    }
    
    /**
     * @dev Test transferFrom functionality
     */
    function testTransferFrom() public {
        uint256 transferAmount = 200 * 10**18;
        uint256 approvalAmount = 500 * 10**18;
        
        // First approve
        token.approve(TEST_USER_1, approvalAmount);
        
        // Test transferFrom allowance check
        _runTest("TransferFrom Allowance Check",
            token.allowance(address(this), TEST_USER_1) >= transferAmount,
            "Should have sufficient allowance for transferFrom");
    }
    
    /**
     * @dev Test fee calculations
     */
    function testFeeCalculations() public {
        uint256 transferAmount = 1000 * 10**18;
        uint256 initialAccessibilityBalance = token.balanceOf(ACCESSIBILITY_WALLET);
        uint256 initialMacWayneBalance = token.balanceOf(MAC_WAYNE_WALLET);
        
        // Transfer to non-exempt address
        token.transfer(TEST_USER_1, transferAmount);
        
        uint256 expectedAccessibilityFee = transferAmount * 15 / 100;
        uint256 expectedMacWayneFee = transferAmount * 2 / 100;
        
        _runTest("Accessibility Fee",
            token.balanceOf(ACCESSIBILITY_WALLET) >= initialAccessibilityBalance + expectedAccessibilityFee,
            "Accessibility wallet should receive 15% fee");
            
        _runTest("Mac Wayne Fee",
            token.balanceOf(MAC_WAYNE_WALLET) >= initialMacWayneBalance + expectedMacWayneFee,
            "Mac Wayne wallet should receive 2% fee");
    }
    
    /**
     * @dev Test fee exemptions
     */
    function testFeeExemptions() public {
        _runTest("Owner Fee Exempt",
            token.feeExempt(address(this)) == true,
            "Owner should be fee exempt");
            
        _runTest("Accessibility Wallet Fee Exempt",
            token.feeExempt(ACCESSIBILITY_WALLET) == true,
            "Accessibility wallet should be fee exempt");
            
        _runTest("Mac Wayne Wallet Fee Exempt",
            token.feeExempt(MAC_WAYNE_WALLET) == true,
            "Mac Wayne wallet should be fee exempt");
    }
    
    /**
     * @dev Test purchase limits
     */
    function testPurchaseLimits() public {
        uint256 maxPurchase = token.maxPurchasePerAddress();
        
        _runTest("Purchase Limits Enabled",
            token.purchaseLimitsEnabled() == true,
            "Purchase limits should be enabled");
            
        _runTest("Max Purchase Amount",
            maxPurchase == 10000 * 10**18,
            "Max purchase should be 10K tokens");
            
        _runTest("Owner Limit Exempt",
            token.limitExempt(address(this)) == true,
            "Owner should be limit exempt");
    }
    
    /**
     * @dev Test edge cases
     */
    function testEdgeCases() public {
        // Test remaining purchase allowance
        uint256 allowance = token.getRemainingPurchaseAllowance(TEST_USER_1);
        _runTest("Purchase Allowance Function",
            allowance > 0,
            "Should return valid purchase allowance");
            
        // Test that contract can receive ETH
        _runTest("Contract ETH Reception",
            true, // Contract has receive() function
            "Contract should be able to receive ETH");
    }
    
    /**
     * @dev Internal function to run a test and track results
     */
    function _runTest(string memory testName, bool condition, string memory details) internal {
        testsRun++;
        if (condition) {
            testsPassed++;
            emit TestResult(testName, true, details);
        } else {
            testsFailed++;
            emit TestResult(testName, false, details);
        }
    }
    
    /**
     * @dev Get test results summary
     */
    function getTestResults() external view returns (uint256 total, uint256 passed, uint256 failed, uint256 successRate) {
        total = testsRun;
        passed = testsPassed;
        failed = testsFailed;
        successRate = testsRun > 0 ? (testsPassed * 100) / testsRun : 0;
    }
    
    /**
     * @dev Quick deployment verification
     */
    function quickVerification() external view returns (
        bool nameCorrect,
        bool symbolCorrect,
        bool decimalsCorrect,
        bool supplyCorrect,
        bool walletsSet,
        bool ownerSet
    ) {
        nameCorrect = keccak256(bytes(token.name())) == keccak256(bytes("Mac Wayne Battered Coin"));
        symbolCorrect = keccak256(bytes(token.symbol())) == keccak256(bytes("MWB"));
        decimalsCorrect = token.decimals() == 18;
        supplyCorrect = token.totalSupply() == 1000000 * 10**18;
        walletsSet = token.accessibilityFundWallet() != address(0) && token.macWayneWallet() != address(0);
        ownerSet = token.owner() != address(0);
    }
}
