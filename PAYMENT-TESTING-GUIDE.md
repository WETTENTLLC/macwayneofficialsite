# Payment & Donation Features Testing Guide

## Overview
This guide provides detailed instructions for testing the payment and donation features of the Mac Wayne site before deployment to GitHub Pages. The payment system includes both the Battered Coin (MWB) purchase functionality and the donation system.

## Payment Features to Test

### 1. Battered Coin (MWB) Purchase System

#### 1.1 Purchase Section UI
- **Coming Soon Card**: Verify the "Coming Soon" card displays correctly
- **Token Information**: Check all token details are accurate
- **Contract Status**: Verify status indicators show correct information
- **Progress Tracking**: Test the progress bar functionality
- **Visual Elements**: Check all icons, buttons, and UI elements

#### 1.2 Smart Contract Integration (if enabled)
- **Contract Connection**: Verify connection to Ethereum network
- **Wallet Connection**: Test MetaMask integration
- **Transaction Flow**: Verify purchase transaction process
- **Error Handling**: Test error scenarios and messages
- **Transaction Status**: Check confirmation and status updates

### 2. Donation System

#### 2.1 Donation UI
- **Donation Tiers**: Verify all tier cards display correctly
- **Visual Design**: Check styling, hover effects, and animations
- **Mobile Responsiveness**: Test display on different screen sizes
- **Accessibility**: Verify keyboard navigation and screen reader support

#### 2.2 Payment Method Selection
- **Payment Options**: Test all available payment methods
- **Method Selection**: Verify method switching works correctly
- **Method-specific UI**: Check appropriate UI elements for each method

#### 2.3 Ethereum Donations
- **Address Display**: Verify ETH address shows correctly
- **Copy Function**: Test clipboard copying functionality
- **QR Code**: Verify QR code generation (if implemented)
- **Confirmation**: Check donation confirmation process

#### 2.4 Other Payment Methods
- **Credit Card**: Test credit card form and validation
- **PayPal**: Verify PayPal integration
- **Other Methods**: Test any additional payment options
- **Redirects**: Check any payment redirects work correctly

#### 2.5 Notification System
- **Success Messages**: Verify donation success notifications
- **Error Messages**: Test error handling and notifications
- **Visual Appearance**: Check notification styling and animations
- **Dismissal**: Test notification dismissal functionality

### 3. Shop Functionality (if applicable)

#### 3.1 Product Listings
- **Product Display**: Verify all products show correctly
- **Product Details**: Check prices, descriptions, and images
- **Filtering**: Test category and price filters

#### 3.2 Shopping Cart
- **Add to Cart**: Test adding items to cart
- **Remove from Cart**: Verify removing items works
- **Quantity Adjustment**: Test changing item quantities
- **Cart Persistence**: Check cart saves between sessions

#### 3.3 Checkout Process
- **Checkout Flow**: Verify entire checkout process
- **Form Validation**: Test input validation on forms
- **Payment Processing**: Verify payment method integration
- **Order Confirmation**: Check confirmation and receipts

## Testing Methodology

### 1. Simulated Transactions

For each payment method, follow this process:

1. **Preparation**:
   - Set up test wallets or accounts
   - Prepare test payment information
   - Open browser console to monitor for errors

2. **Test Flow**:
   - Navigate to relevant page (battered-coin.html, shop.html)
   - Select payment method
   - Enter test payment details
   - Initiate transaction
   - Monitor response and confirmation

3. **Verification**:
   - Check transaction status updates
   - Verify visual feedback to user
   - Confirm any receipt or confirmation
   - Check for appropriate database/backend updates (if applicable)

### 2. Cross-Browser Testing

Test payment features across these browsers:

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  |         |        |       |
| Firefox |         |        |       |
| Safari  |         |        |       |
| Edge    |         |        |       |

### 3. Error Scenario Testing

Test these error scenarios:

| Error Scenario | Expected Behavior | Actual Behavior | Notes |
|----------------|-------------------|-----------------|-------|
| Invalid payment info | Clear error message |  |  |
| Network disconnection | Graceful error handling |  |  |
| Insufficient funds | Appropriate message |  |  |
| Session timeout | Session recovery or clear message |  |  |
| API failure | Fallback behavior |  |  |

## Common Payment Issues to Check

### 1. UI/UX Issues
- **Clarity**: Are payment instructions clear and unambiguous?
- **Feedback**: Is there appropriate feedback during processing?
- **Errors**: Are error messages helpful and actionable?
- **Confirmation**: Is success confirmation clear and reassuring?

### 2. Technical Issues
- **Browser Compatibility**: Do payment forms work across browsers?
- **Mobile Responsiveness**: Do forms display correctly on mobile?
- **JavaScript Errors**: Are there any console errors during payment?
- **API Integration**: Are payment APIs properly integrated?

### 3. Security Concerns
- **HTTPS**: Is all payment communication over secure connections?
- **Data Validation**: Is input properly validated server-side?
- **Information Storage**: Is sensitive data handled securely?
- **Compliance**: Do forms meet PCI compliance standards?

## Technical Implementation Testing

### Donation System JavaScript

Verify these aspects of the donation implementation:

1. **Method Selection Logic**
   ```javascript
   // Check implementation of payment method selection
   function showDonationMethod(method) {
     // This should hide all method containers and show the selected one
     document.querySelectorAll('.donation-method-container').forEach(container => {
       container.classList.add('hidden');
     });
     document.getElementById(`${method}-donation-container`).classList.remove('hidden');
   }
   ```

2. **Clipboard Functionality**
   ```javascript
   // Verify clipboard copy function for ETH address
   function copyToClipboard(elementId) {
     // Should copy text to clipboard and show confirmation
     const element = document.getElementById(elementId);
     const text = element.innerText || element.value;
     // Check clipboard API implementation
   }
   ```

3. **Notification System**
   ```javascript
   // Check notification display implementation
   function showNotification(message, type = 'info') {
     // Should create and display notification element
     // with appropriate styling based on type
   }
   ```

## Donation Testing Checklist

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| ☐ Donation tiers | All tier options display correctly |  |  |
| ☐ Method selection | Payment method switching works |  |  |
| ☐ ETH address copy | Clipboard copying functions |  |  |
| ☐ Notifications | Success/error messages display |  |  |
| ☐ Progress updates | Donation progress bar updates |  |  |
| ☐ Mobile display | Responsive on small screens |  |  |
| ☐ Keyboard navigation | Can navigate with keyboard |  |  |
| ☐ Screen reader | Accessible with screen readers |  |  |

## Purchase System Testing Checklist

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| ☐ Token info | All token details display correctly |  |  |
| ☐ Coming soon | Status and timeline accurate |  |  |
| ☐ Contract status | Development indicators accurate |  |  |
| ☐ Purchase buttons | All buttons function correctly |  |  |
| ☐ Mobile display | Responsive on small screens |  |  |
| ☐ Wallet connection | MetaMask integration works |  |  |
| ☐ Error handling | Payment errors handled gracefully |  |  |

## Manual Testing Record

Use this table to record manual testing results:

| Date | Tester | Feature | Browser/Device | Result | Notes |
|------|--------|---------|----------------|--------|-------|
|      |        |         |                |        |       |
|      |        |         |                |        |       |
|      |        |         |                |        |       |

## Testing Edge Cases

1. **Network Conditions**
   - Test payments on slow connections
   - Test behavior when network disconnects during payment
   - Test with high latency connections

2. **User Interactions**
   - Test rapid button clicking
   - Test browser back/forward during payment
   - Test page refresh during payment process

3. **Device-Specific**
   - Test on low-end devices
   - Test with browser zoom levels changed
   - Test with different browser font sizes

## Security Testing

Verify these security aspects:

1. **Data Transmission**
   - All payment data transmitted over HTTPS
   - No sensitive data in URL parameters
   - Appropriate data encryption used

2. **Data Validation**
   - Input validation on all form fields
   - Protection against XSS and injection attacks
   - CSRF protection implemented

3. **Payment Processing**
   - PCI compliance (if processing credit cards)
   - Use of trusted payment processors
   - Minimal data storage on your servers

## Final Notes

- Payment systems are critical site components requiring thorough testing
- The donation system should be intuitive and frictionless
- Ensure clear communication during payment processes
- Document any workarounds implemented for specific browser issues
- Prioritize security and user trust in all payment implementations
