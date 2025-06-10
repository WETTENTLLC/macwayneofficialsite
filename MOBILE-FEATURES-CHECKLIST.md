# Mobile Testing Checklist for Live Features

## Overview
This checklist focuses specifically on testing the Mac Wayne site's live features and user assistance functionality on mobile devices. Mobile testing is particularly critical for these features as many users will access them while on the go.

## Testing Devices

Test on at least these mobile devices/configurations:

1. **iOS Devices**:
   - iPhone (latest model)
   - iPhone (older model, 2-3 years old)
   - iPad (if available)

2. **Android Devices**:
   - Samsung Galaxy (or other flagship)
   - Mid-range Android phone
   - Android tablet (if available)

3. **Mobile Browsers**:
   - Safari (iOS)
   - Chrome (iOS & Android)
   - Firefox (Android)
   - Samsung Internet (if applicable)

## 1. Device Detection & Optimization

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ Device detection | Verify site detects mobile devices | | | |
| ☐ Mobile UI | Check optimized interface loads | | | |
| ☐ Portrait orientation | Test in portrait mode | | | |
| ☐ Landscape orientation | Test in landscape mode | | | |
| ☐ Different screen sizes | Test on various screen sizes | | | |
| ☐ Touch targets | Verify buttons/links are appropriately sized | | | |

## 2. Help The Blind Man Mobile Experience

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ Touch navigation | Test interactive journey via touch | | | |
| ☐ Direction choices | Check direction selections work | | | |
| ☐ Mobile share story | Test story sharing on mobile | | | |
| ☐ Encouragement modal | Verify modal displays properly | | | |
| ☐ Voice commands | Test voice recognition on mobile | | | |
| ☐ Feedback notifications | Check notification visibility | | | |

## 3. Live Performances on Mobile

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ Video playback | Test performance videos on mobile | | | |
| ☐ Mobile video controls | Verify video controls are usable | | | |
| ☐ Performance filtering | Test category filtering on mobile | | | |
| ☐ Mobile purchase flow | Test buying performances on mobile | | | |
| ☐ Booking form | Check form usability on small screens | | | |
| ☐ Form validation | Test error messages on mobile | | | |

## 4. Mobile User Support

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ Support widget | Verify widget appears on mobile | | | |
| ☐ Support modal | Check support options modal display | | | |
| ☐ Live chat on mobile | Test chat interface on small screens | | | |
| ☐ Knowledge base | Verify knowledge articles are readable | | | |
| ☐ Video tutorials | Test tutorial playback on mobile | | | |
| ☐ Contact methods | Check phone/email contact functionality | | | |

## 5. Mobile Accessibility

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ VoiceOver (iOS) | Test with VoiceOver screen reader | | | |
| ☐ TalkBack (Android) | Test with TalkBack screen reader | | | |
| ☐ Mobile zoom | Test content with screen zoomed | | | |
| ☐ Text resizing | Verify text adapts to system text size | | | |
| ☐ High contrast | Test high contrast mode on mobile | | | |
| ☐ Touch targets | Verify touch targets meet accessibility size | | | |

## 6. Mobile Payment Features

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ Mobile wallet detection | Verify wallet detection works | | | |
| ☐ Mobile payment methods | Test all payment options on mobile | | | |
| ☐ Payment forms | Check payment form usability | | | |
| ☐ Error handling | Test payment error scenarios | | | |
| ☐ Confirmations | Verify payment confirmations | | | |
| ☐ Receipt display | Check receipt rendering on mobile | | | |

## 7. Performance on Mobile

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ Page load time | Measure mobile load performance | | | |
| ☐ Network conditions | Test on slow/unstable connections | | | |
| ☐ Memory usage | Check performance over extended use | | | |
| ☐ Battery impact | Monitor battery drain during use | | | |
| ☐ Background behavior | Test app behavior when in background | | | |

## 8. Device-Specific Features

| Test | Description | iOS | Android | Notes |
|------|-------------|-----|---------|-------|
| ☐ Touch ID/Face ID | Test biometric payment auth if used | | | |
| ☐ Native sharing | Verify sharing to social apps works | | | |
| ☐ App handoff | Test handoff to native apps if applicable | | | |
| ☐ Notifications | Check notification permissions/display | | | |
| ☐ Add to home screen | Test PWA/bookmark functionality | | | |

## 9. Cross-Device Experience

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| ☐ Session continuity | Test resuming session across devices | | |
| ☐ Account sync | Verify account data syncs properly | | |
| ☐ Purchase history | Check purchase history across devices | | |
| ☐ Preferences sync | Test user preference synchronization | | |

## 10. Common Mobile Issues to Watch For

1. **Touch Issues**:
   - Double-tap registration problems
   - Swipe gesture conflicts
   - Touch targets too small or too close together

2. **Visual Issues**:
   - Text overflow or truncation
   - Elements extending beyond viewport
   - Poor contrast in outdoor lighting conditions

3. **Input Issues**:
   - Form fields obscured by virtual keyboard
   - Difficult form navigation
   - Auto-correct issues with specialized terms

4. **Network Issues**:
   - Poor behavior on intermittent connections
   - Excessive data usage
   - No offline functionality for key features

## Testing Notes

Document issues with the following information:

1. **Device details**: Model, OS version, screen size
2. **Browser details**: Browser type and version
3. **Connectivity**: WiFi/cellular, connection quality
4. **Reproducibility**: Steps to reproduce the issue
5. **Screenshots/recordings**: Visual evidence (critical for mobile issues)

## Testing Completion Signoff

- **Tester Name:** _______________________
- **Testing Date:** _______________________
- **Devices Tested:** _______________________
- **Signoff:** _______________________

---

*This mobile testing checklist was created on June 8, 2025*
