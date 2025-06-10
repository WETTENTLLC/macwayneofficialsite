# Audio Player Detailed Testing Checklist

This document provides detailed test cases specifically for the audio player functionality, which was identified as having potential issues in the automated testing.

## Setup

1. **Test Environment**
   - [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
   - [ ] Mobile browsers (iOS Safari, Android Chrome)
   - [ ] Screen readers (NVDA/JAWS/VoiceOver)

2. **Test Files**
   - [ ] Verify all audio files in the `/audio` directory
   - [ ] Ensure a mix of file formats (MP3, WAV) if applicable
   - [ ] Prepare sample tracks for both preview and full playback

## Core Audio Player Functionality

### Basic Controls

| Test | Expected Behavior | Chrome | Firefox | Safari | Edge | Mobile | Notes |
|------|-------------------|--------|---------|--------|------|--------|-------|
| ☐ Load player | Player initializes without errors | | | | | | |
| ☐ Play button | Clicking play starts audio playback | | | | | | |
| ☐ Pause button | Clicking pause stops audio playback | | | | | | |
| ☐ Play after pause | Playback resumes from paused position | | | | | | |
| ☐ Volume control | Volume slider adjusts audio volume | | | | | | |
| ☐ Mute button | Mutes/unmutes audio | | | | | | |
| ☐ Progress bar | Shows current playback position | | | | | | |
| ☐ Seek functionality | Clicking progress bar jumps to position | | | | | | |
| ☐ Time display | Shows current and total time | | | | | | |

### Preview Mode

| Test | Expected Behavior | Chrome | Firefox | Safari | Edge | Mobile | Notes |
|------|-------------------|--------|---------|--------|------|--------|-------|
| ☐ Preview mode | Playback stops at 30 seconds | | | | | | |
| ☐ Preview indicator | UI shows preview mode is active | | | | | | |
| ☐ Preview ending | Appropriate message when preview ends | | | | | | |
| ☐ Purchase prompt | Shows upgrade option after preview | | | | | | |
| ☐ Multiple previews | Can play multiple track previews | | | | | | |

### Track Navigation

| Test | Expected Behavior | Chrome | Firefox | Safari | Edge | Mobile | Notes |
|------|-------------------|--------|---------|--------|------|--------|-------|
| ☐ Next track | Advances to next track | | | | | | |
| ☐ Previous track | Returns to previous track | | | | | | |
| ☐ First/last track | Proper behavior at playlist boundaries | | | | | | |
| ☐ Track selection | Clicking track in list selects it | | | | | | |
| ☐ Active track indicator | Shows which track is currently playing | | | | | | |

### Playlist Functionality

| Test | Expected Behavior | Chrome | Firefox | Safari | Edge | Mobile | Notes |
|------|-------------------|--------|---------|--------|------|--------|-------|
| ☐ Track listing | All tracks display in playlist | | | | | | |
| ☐ Track metadata | Shows title, artist, duration | | | | | | |
| ☐ Filter functionality | Playlist filtering works | | | | | | |
| ☐ Sorting | Playlist sorting functions | | | | | | |
| ☐ Scrolling | Long playlists scroll properly | | | | | | |

## Advanced Features

### Purchase Integration

| Test | Expected Behavior | Chrome | Firefox | Safari | Edge | Mobile | Notes |
|------|-------------------|--------|---------|--------|------|--------|-------|
| ☐ Buy button | Purchase button appears for previews | | | | | | |
| ☐ Purchase flow | Clicking buy launches purchase flow | | | | | | |
| ☐ Post-purchase | Full track plays after purchase | | | | | | |
| ☐ Purchased indicator | Shows which tracks are purchased | | | | | | |

### Accessibility

| Test | Expected Behavior | Chrome | Firefox | Safari | Edge | Mobile | Notes |
|------|-------------------|--------|---------|--------|------|--------|-------|
| ☐ Keyboard controls | Space = play/pause, arrows = seek | | | | | | |
| ☐ Screen reader | Player announces status changes | | | | | | |
| ☐ Focus management | Controls receive focus correctly | | | | | | |
| ☐ ARIA attributes | ARIA implemented correctly | | | | | | |
| ☐ High contrast | Player visible in high contrast mode | | | | | | |

### Mobile-Specific

| Test | Expected Behavior | iOS | Android | Notes |
|------|-------------------|-----|---------|-------|
| ☐ Touch controls | Controls respond to touch | | | |
| ☐ Gesture support | Swipe gestures work if implemented | | | |
| ☐ Orientation change | Player adapts to orientation changes | | | |
| ☐ Lock screen controls | Media controls on lock screen | | | |

## Error Handling

| Test | Expected Behavior | Status | Notes |
|------|-------------------|--------|-------|
| ☐ Missing audio file | Shows error message | | |
| ☐ Unsupported format | Graceful fallback/message | | |
| ☐ Network interruption | Handles connection loss | | |
| ☐ Autoplay blocking | Handles autoplay restrictions | | |

## Performance

| Test | Expected Behavior | Status | Notes |
|------|-------------------|--------|-------|
| ☐ Initial load time | Player loads in under 2 seconds | | |
| ☐ Track switching | Smooth transition between tracks | | |
| ☐ Memory usage | No memory leaks during extended use | | |
| ☐ CPU usage | Player doesn't cause high CPU usage | | |

## Specific Audio Player Issues from Automated Testing

The automated testing identified potential issues in `audio-player.js`. These specific areas should be examined:

1. **Preview Mode Implementation**
   - [ ] Verify the `previewMode` variable is correctly set
   - [ ] Check the timer implementation for the 30-second cutoff
   - [ ] Test the purchase prompt after preview ends

2. **Event Listeners**
   - [ ] Check for any duplicate event listeners causing memory leaks
   - [ ] Verify all event listeners are properly removed when not needed
   - [ ] Test event propagation behavior

3. **Audio Resource Loading**
   - [ ] Verify the correct paths are used for audio file loading
   - [ ] Check error handling when audio resources are missing
   - [ ] Test preloading behavior if implemented

## Test Procedure

1. Open the site in each test browser
2. Navigate to pages with audio player functionality
3. Perform each test in the checklist
4. Document any issues found
5. For any failing tests:
   - Capture screenshots
   - Note specific browser/device
   - Document exact steps to reproduce
   - Check browser console for errors

## JavaScript Debugging Steps

If issues are found, follow these debugging steps:

1. Open browser developer tools
2. Check the console for JavaScript errors
3. Use the debugger to set breakpoints in the audio-player.js file
4. Step through the code execution to identify the problem
5. Check network tab for failed audio file requests
6. Verify the audio file paths in the code

## Common Audio Player Issues to Watch For

1. **Audio not playing**
   - Check file paths and formats
   - Verify autoplay policies
   - Check for JavaScript errors blocking playback

2. **Controls not working**
   - Check event listener implementation
   - Verify DOM element references
   - Test for CSS overlapping issues

3. **Preview mode not limiting properly**
   - Check timer implementation
   - Verify time calculation logic
   - Test with different track lengths

4. **Purchase flow integration issues**
   - Verify event coordination between player and purchase system
   - Check state management after purchases
   - Test account recognition for purchased tracks

---

**Tester:** _______________________  
**Date:** _______________________  
**Browser/Device:** _______________________
