# Background Image & Texture Implementation

This document outlines how the background image is implemented and how grain/brail texture effects have been removed.

## Current Implementation

The main background image is applied to the `.strange-theme` class in `strange-theme.css`:

```css
.strange-theme {
  font-family: var(--font-bebas);
  background-color: var(--dark-bg);
  color: var(--text-white);
  background-image: url('/Images/macwayne-background.png');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  /* Ensure background is clear and no textures/overlays */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  /* Performance optimizations */
  will-change: transform;
  contain: layout style paint;
}
```

## Texture Removal

The following steps were taken to ensure no grain/brail effects appear over the background:

1. Disabled the `.strange-theme::before` pseudo-element with:
   ```css
   .strange-theme::before {
     display: none !important;
     content: none !important;
     background: none !important;
     opacity: 0 !important;
     pointer-events: none !important;
   }
   ```

2. Disabled the `.braille-texture` class in `globals.css`:
   ```css
   .braille-texture {
     background-image: none !important;
     background: none !important;
     opacity: 0 !important;
     display: none !important;
   }
   ```

3. Made content sections more opaque for better contrast:
   ```css
   .strange-section {
     background: rgba(255, 255, 255, 0.95);  /* Increased opacity */
   }
   ```

4. Removed backdrop filters:
   ```css
   backdrop-filter: none;
   -webkit-backdrop-filter: none;
   ```

## Testing Background Visibility

When reviewing the site, ensure:

1. The background image is clearly visible
2. No grain, dots, or texture patterns appear over the image
3. Content sections have appropriate contrast against the background
4. The overall aesthetic maintains the desired red/white theme

## Troubleshooting

If texture effects reappear:

1. Check if any new components are adding textures/overlays
2. Ensure no CSS is re-enabling the disabled elements
3. Look for new pseudo-elements that might be creating textures
4. Check z-index values to ensure content is properly layered
