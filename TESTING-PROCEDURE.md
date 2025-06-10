# Mac Wayne Site Testing Procedure

This document outlines the step-by-step procedure for testing the Mac Wayne site before deployment to GitHub Pages, focusing on the most critical areas identified in our automated tests.

## Preparation

1. **Environment Setup**
   - [ ] Chrome (latest version)
   - [ ] Firefox (latest version)
   - [ ] Safari (latest version) 
   - [ ] Edge (latest version)
   - [ ] Mobile device (iOS/Android)
   - [ ] Screen reader software (NVDA/JAWS/VoiceOver)

2. **Test Account Setup**
   - [ ] Create accounts for each service tier (Basic, Premium, VIP)
   - [ ] Set up test payment methods (credit card, PayPal, cryptocurrency)

## Critical Issues Testing

### 1. Audio Files and Directory Structure

- [ ] Verify the audio directory exists at the root level
- [ ] Confirm all required audio files are present in the directory
- [ ] Test audio file loading in the audio player
- [ ] Verify 30-second preview functionality with sample audio files

**Testing Steps:**
1. Navigate to the site's audio player section
2. Attempt to play each sample track
3. Verify the preview limitation to 30 seconds
4. Test upgrading to full tracks with a premium account

### 2. Broken Links

- [ ] Check all internal navigation links
- [ ] Verify favicon.ico is properly referenced and displays
- [ ] Test all anchor links (#music, #tour, #contact)
- [ ] Validate external links open correctly in new tabs

**Testing Steps:**
1. Systematically click each navigation link in the header and footer
2. Check browser tab for favicon display
3. Click all hash links and verify they scroll to the correct section
4. Test social media and external links

### 3. HTML Structure Validation

- [ ] Validate all HTML files with W3C Validator
- [ ] Check for proper HEAD and BODY section tags
- [ ] Verify all required meta tags are present
- [ ] Test structured data with Google's Rich Results Test

**Testing Steps:**
1. Submit each HTML file to the W3C Validator
2. Review and document all validation errors
3. Check browser developer tools for HTML structure warnings
4. Test structured data with Google's Rich Results Test tool

### 4. JavaScript Issues

- [ ] Debug potential issues in audio-player.js
- [ ] Test all JavaScript functionality in the browser
- [ ] Check browser console for JavaScript errors
- [ ] Verify JavaScript features work across browsers

**Testing Steps:**
1. Open browser developer tools and monitor the console
2. Test all interactive features that use JavaScript
3. Check for any error messages or warnings
4. Verify functionality in all required browsers

## Live Features Testing

### 1. Help The Blind Man Interactive Experience

**Functionality to Test:**
- Interactive journey
- Direction choices
- Story sharing
- Encouragement messaging
- Voice commands

**Testing Steps:**
1. Navigate to the Help The Blind Man section
2. Click "HEAR HIS STORY" button and verify audio playback
3. Test each direction choice in the guidance game
4. Attempt to share a story and verify sharing functionality
5. Test the encouragement system by sending encouragement messages
6. Verify voice command functionality if implemented

### 2. Live Performances Access

**Functionality to Test:**
- Performance filtering
- Video playback
- Premium content access
- Booking system

**Testing Steps:**
1. Navigate to the Live Performances section
2. Test each filter button to verify performance filtering
3. Click play buttons to verify YouTube video integration
4. Test premium content access with and without proper account tier
5. Complete the booking form for private performances
6. Verify payment process for premium content

### 3. User Support Features

**Functionality to Test:**
- Support widget
- Support channels
- Knowledge base
- Accessibility options

**Testing Steps:**
1. Locate and open the support widget
2. Test each support channel option (chat, email, video call, phone)
3. Access knowledge base and verify resource availability
4. Test accessibility preference settings
5. Verify all support features work with screen readers

### 4. Mobile Features

**Functionality to Test:**
- Mobile detection
- Touch interactions
- Mobile notifications
- Cross-device sync

**Testing Steps:**
1. Access the site on a mobile device
2. Verify automatic mobile detection and optimization
3. Test all touch-based interactions
4. Verify notification system on mobile
5. Test synchronized experience across desktop and mobile

## Paid Tier Features Testing

### 1. Tier-Specific Access

**Testing Steps:**
1. Log in with a basic tier account and verify access limitations
2. Switch to premium tier and confirm additional features
3. Test VIP tier exclusive content and features
4. Verify the upgrade process between tiers
5. Test downgrade scenarios and feature restrictions

### 2. Payment Verification

**Testing Steps:**
1. Complete a purchase for each tier
2. Verify payment history display
3. Test digital receipt generation
4. Check subscription renewal notifications
5. Attempt to update payment methods

## Accessibility Testing

### 1. Screen Reader Compatibility

**Testing Steps:**
1. Navigate the site using only a screen reader
2. Verify all important content is announced properly
3. Test form completion with screen reader
4. Verify media controls are accessible
5. Check ARIA implementation effectiveness

### 2. Keyboard Navigation

**Testing Steps:**
1. Navigate the site using only keyboard
2. Test tab order and focus indicators
3. Verify all interactive elements can be activated
4. Test keyboard shortcuts
5. Check skip links functionality

## Final Verification

### 1. Cross-Browser Compatibility

**Testing Steps:**
1. Complete core functionality tests in Chrome
2. Repeat tests in Firefox
3. Repeat tests in Safari
4. Repeat tests in Edge
5. Document any browser-specific issues

### 2. Performance Metrics

**Testing Steps:**
1. Test page load times in each browser
2. Measure first contentful paint time
3. Check largest contentful paint time
4. Verify total page size optimization
5. Test performance on low bandwidth connections

## Testing Results Documentation

For each testing area, document:
1. **Feature status**: Working / Partially working / Not working
2. **Issues found**: Detailed description of any problems
3. **Browser compatibility**: Any browser-specific issues
4. **Mobile compatibility**: Any mobile-specific issues
5. **Accessibility concerns**: Any accessibility problems

## Issue Prioritization

Categorize all issues found as:
- **Critical**: Preventing core functionality
- **Major**: Significantly impacting user experience
- **Minor**: Cosmetic or non-essential issues

## Pre-Deployment Final Checklist

- [ ] All critical issues resolved
- [ ] Major issues addressed or documented
- [ ] HTML validation errors fixed
- [ ] JavaScript console errors resolved
- [ ] Audio files correctly implemented
- [ ] All links validated and working
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] Accessibility features working
- [ ] Live features tested and functional

---

**Tester Name:** _______________________  
**Testing Date:** _______________________  
**Signature:** _______________________
