# Audio Playback Testing Guide

## Overview
This guide focuses specifically on testing the audio playback functionality of the Mac Wayne site, with special attention to the 30-second preview clips feature. Proper audio playback is critical for the site's music experience and should be thoroughly tested before deployment.

## Audio Player Features to Test

### Core Audio Functionality

1. **Player Initialization**
   - Does the audio player load correctly on all pages?
   - Are all control elements visible and properly styled?
   - Does the player initialize without errors in the console?

2. **Basic Playback Controls**
   - **Play/Pause**: Does the play button correctly start playback and toggle to pause?
   - **Volume Control**: Does the volume slider adjust audio levels correctly?
   - **Mute**: Does the mute button properly silence audio without changing volume setting?
   - **Track Position**: Does the progress bar accurately show playback position?
   - **Time Display**: Do current time and duration display correctly?

3. **Track Navigation**
   - **Next/Previous**: Do next and previous buttons navigate between tracks?
   - **Track Selection**: Does clicking on a track in the playlist start playback?
   - **Track Info**: Does track title, artist, and other metadata display correctly?

### 30-Second Preview Functionality

1. **Preview Limitation**
   - Do all tracks properly limit to 30 seconds in preview mode?
   - Is there a clear indication when a track is in preview mode?
   - What happens after the 30-second preview completes? (Should stop or show purchase prompt)

2. **Preview Controls**
   - Can users restart a preview?
   - Can users skip to different points within the 30-second preview?
   - Are there any limitations on preview replays?

3. **Preview UI Elements**
   - Is there a visual indicator showing preview status?
   - Is there a timer showing preview time remaining?
   - Are there clear prompts to purchase the full track?

## Testing Methodology

### 1. Manual Testing Steps

Follow this sequence for each track:

1. Load the page with the audio player
2. Select a track from the playlist
3. Press play and verify playback starts
4. Confirm audio is audible and clear
5. Watch the time display and verify it stops at 30 seconds
6. Test seeking within the preview (drag progress bar)
7. Test volume controls
8. Test pause and resume
9. Verify behavior after preview ends
10. Repeat for all tracks

### 2. Cross-Browser Testing

Test the audio player in each of these browsers:

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  |         |        |       |
| Firefox |         |        |       |
| Safari  |         |        |       |
| Edge    |         |        |       |

### 3. Audio Format Compatibility

Verify that audio plays correctly with these formats:

| Audio Format | Chrome | Firefox | Safari | Edge | Notes |
|--------------|--------|---------|--------|------|-------|
| MP3          |        |         |        |      |       |
| AAC          |        |         |        |      |       |
| OGG          |        |         |        |      |       |
| WAV          |        |         |        |      |       |

## Common Audio Issues to Check

1. **Playback Delays**
   - Is there a noticeable delay between clicking play and audio starting?
   - Does the player preload audio to prevent buffering?

2. **Audio Quality**
   - Is audio free from distortion, clipping, or artifacts?
   - Is volume consistent across different tracks?
   - Is stereo imaging working correctly?

3. **Performance Issues**
   - Does audio playback affect page performance?
   - Is there memory leakage during extended playback?
   - Does the player handle rapid interaction well?

4. **Accessibility**
   - Can the player be controlled via keyboard?
   - Do player controls have proper ARIA attributes?
   - Are there screen reader announcements for player status?

## Technical Implementation Testing

### Audio Player JavaScript

Verify these aspects of the audio player implementation:

1. **Preview Mode Implementation**
   ```javascript
   // Check implementation of preview mode in audio-player.js
   this.previewMode = true; // Should be true by default
   this.previewDuration = 30; // Should be 30 seconds
   
   // Verify the preview time limitation logic works
   // Look for code that handles ending playback at 30 seconds
   ```

2. **Event Handling**
   - Verify event listeners for track end
   - Check for memory leaks (event listeners not being removed)
   - Test rapid clicking on player controls

### Audio Files

1. **File Optimization**
   - Are audio files properly compressed for web delivery?
   - Are preview clips separate files or trimmed from full tracks?
   - Check file sizes to ensure reasonable load times

2. **File Organization**
   - Verify the folder structure for audio files
   - Check that file paths in HTML/JS match actual file locations

## Automated Testing

Run this command in the browser console to test multiple track previews:

```javascript
// Test function to verify 30-second preview functionality
function testAudioPreviews() {
  const player = document.querySelector('.audio-player');
  const audioPlayerInstance = player._audioPlayer;
  const tracks = Array.from(document.querySelectorAll('.track-item'));
  
  console.log(`Testing ${tracks.length} audio previews...`);
  
  let currentTrack = 0;
  
  function testNextTrack() {
    if (currentTrack >= tracks.length) {
      console.log('All track previews tested successfully');
      return;
    }
    
    console.log(`Testing track ${currentTrack + 1}/${tracks.length}: ${tracks[currentTrack].querySelector('.track-title').textContent}`);
    
    // Click on track to start playback
    tracks[currentTrack].click();
    
    // Wait for 32 seconds (30s preview + 2s buffer)
    setTimeout(() => {
      // Check if playback stopped after 30 seconds
      if (!audioPlayerInstance.isPlaying || audioPlayerInstance.audio.currentTime >= 30) {
        console.log(`✅ Track ${currentTrack + 1} preview correctly limited to 30 seconds`);
      } else {
        console.error(`❌ Track ${currentTrack + 1} preview did NOT stop at 30 seconds`);
      }
      
      currentTrack++;
      testNextTrack();
    }, 32000);
  }
  
  testNextTrack();
}

// Run the test
testAudioPreviews();
```

## Edge Cases to Test

1. **Network Conditions**
   - Test playback on slow connections
   - Test behavior when network is disconnected during playback
   - Test with high latency connections

2. **User Interactions**
   - Test rapid clicking on play/pause
   - Test dragging progress bar repeatedly
   - Test changing tracks rapidly

3. **Device-Specific**
   - Test behavior when device is low on memory
   - Test with Bluetooth headphones/speakers
   - Test with device sound muted

## Audio Testing Checklist

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| ☐ Player loads | Audio player initializes without errors |  |  |
| ☐ Play/pause works | Play and pause buttons function correctly |  |  |
| ☐ Volume control | Volume adjustment works |  |  |
| ☐ Mute function | Mute button works |  |  |
| ☐ Track navigation | Next/previous buttons work |  |  |
| ☐ Progress bar | Seeking within track works |  |  |
| ☐ Time display | Current/total time displays correctly |  |  |
| ☐ 30-second limit | Previews stop at 30 seconds |  |  |
| ☐ Preview indication | Clear visual indication of preview mode |  |  |
| ☐ Post-preview | Correct behavior after preview ends |  |  |
| ☐ Keyboard controls | Player can be controlled via keyboard |  |  |
| ☐ Screen reader | Player announcements work with screen readers |  |  |
| ☐ Mobile playback | Audio works on mobile devices |  |  |
| ☐ Background playback | Behavior when browser tab is in background |  |  |
| ☐ Memory usage | No excessive memory usage during playback |  |  |

## Issue Reporting Format

When documenting audio player issues, include:

1. **Issue description**: Clear description of the audio problem
2. **Environment**: Browser, device, and any relevant settings
3. **Steps to reproduce**: Numbered steps to reproduce the issue
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Audio details**: Format, length, and other relevant metadata
7. **Console errors**: Any JavaScript errors in the console
8. **Screenshots/recordings**: If applicable

## Final Notes

- Audio playback is a core feature of the Mac Wayne site and requires thorough testing
- The 30-second preview functionality is particularly important for the business model
- Pay special attention to mobile testing, as many users will listen on mobile devices
- Audio behavior can vary significantly between browsers, test all required platforms
- Document any workarounds implemented for specific browser issues
