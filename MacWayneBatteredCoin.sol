// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MacWayneBatteredCoin {
    
    string public name = "Mac Wayne Battered Coin";
    string public symbol = "MWB";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public totalPurchased;
    
    address public owner;
    address public accessibilityFundWallet;
    address public macWayneWallet;
    
    uint256 public maxPurchasePerAddress;
    bool public purchaseLimitsEnabled = true;
    
    mapping(address => bool) public feeExempt;
    mapping(address => bool) public limitExempt;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _accessibilityFundWallet, address _macWayneWallet) {
        require(_accessibilityFundWallet != address(0), "Invalid accessibility wallet");
        require(_macWayneWallet != address(0), "Invalid Mac Wayne wallet");
        
        owner = msg.sender;
        accessibilityFundWallet = _accessibilityFundWallet;
        macWayneWallet = _macWayneWallet;
        
        totalSupply = 1000000 * 10**decimals;
        balanceOf[msg.sender] = totalSupply;
        
        maxPurchasePerAddress = 10000 * 10**decimals;
        
        feeExempt[msg.sender] = true;
        feeExempt[_accessibilityFundWallet] = true;
        feeExempt[_macWayneWallet] = true;
        
        limitExempt[msg.sender] = true;
        
        emit Transfer(address(0), msg.sender, totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        uint256 currentAllowance = allowance[from][msg.sender];
        require(currentAllowance >= amount, "Insufficient allowance");
        
        allowance[from][msg.sender] = currentAllowance - amount;
        _transfer(from, to, amount);
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        
        // Check purchase limits
        if (purchaseLimitsEnabled && !limitExempt[to] && from != to) {
            require(totalPurchased[to] + amount <= maxPurchasePerAddress, "Purchase limit exceeded");
            totalPurchased[to] += amount;
        }
        
        // Apply fees if not exempt
        if (feeExempt[from] || feeExempt[to]) {
            balanceOf[from] -= amount;
            balanceOf[to] += amount;
            emit Transfer(from, to, amount);
        } else {
            uint256 accessibilityFee = amount * 15 / 100;
            uint256 macWayneFee = amount * 2 / 100;
            uint256 transferAmount = amount - accessibilityFee - macWayneFee;
            
            balanceOf[from] -= amount;
            balanceOf[to] += transferAmount;
            balanceOf[accessibilityFundWallet] += accessibilityFee;
            balanceOf[macWayneWallet] += macWayneFee;
            
            emit Transfer(from, to, transferAmount);
            emit Transfer(from, accessibilityFundWallet, accessibilityFee);
            emit Transfer(from, macWayneWallet, macWayneFee);
        }
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        
        feeExempt[owner] = false;
        limitExempt[owner] = false;
        
        feeExempt[newOwner] = true;
        limitExempt[newOwner] = true;
        
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
    
    function setAccessibilityFundWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid address");
        feeExempt[accessibilityFundWallet] = false;
        feeExempt[newWallet] = true;
        accessibilityFundWallet = newWallet;
    }
    
    function setMacWayneWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid address");
        feeExempt[macWayneWallet] = false;
        feeExempt[newWallet] = true;
        macWayneWallet = newWallet;
    }
    
    function setMaxPurchasePerAddress(uint256 newLimit) external onlyOwner {
        maxPurchasePerAddress = newLimit;
    }
    
    function setPurchaseLimitsEnabled(bool enabled) external onlyOwner {
        purchaseLimitsEnabled = enabled;
    }
    
    function setFeeExempt(address account, bool exempt) external onlyOwner {
        feeExempt[account] = exempt;
    }
    
    function setLimitExempt(address account, bool exempt) external onlyOwner {
        limitExempt[account] = exempt;
    }
    
    function getRemainingPurchaseAllowance(address account) external view returns (uint256) {
        if (!purchaseLimitsEnabled || limitExempt[account]) {
            return type(uint256).max;
        }
        
        if (totalPurchased[account] >= maxPurchasePerAddress) {
            return 0;
        }
        
        return maxPurchasePerAddress - totalPurchased[account];
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
