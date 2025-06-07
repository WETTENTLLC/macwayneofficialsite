# Mac Wayne Dark Theme Guide

This guide outlines the dark, painful aesthetic implemented for the Mac Wayne Official website.

## Theme Overview

The Mac Wayne site features a dark and painful aesthetic with smoke effects and dark tones, complemented by red and white highlights. This design matches the gritty, raw nature of Mac Wayne's music and storytelling.

## Key Visual Elements

### Color Palette

```css
:root {
  --dark-bg: #121212;           /* Main background color */
  --darker-bg: #0a0a0a;         /* Darker elements */
  --prison-red: #cc0000;        /* Primary accent color */
  --highlight-red: #ff0000;     /* Brighter accent for highlights */
  --metal-gray: #333333;        /* Neutral accent */
  --text-white: #ffffff;        /* Primary text color */
  --text-gray: #aaaaaa;         /* Secondary text color */
  --section-bg: #1a1a1a;        /* Section background */
  --overlay-dark: rgba(0, 0, 0, 0.85); /* Overlay for cards and modals */
}
```

### Background Treatment

- Main background uses an image that has been set to `background-size: contain` to show the full image
- A smoky overlay has been added using a gradient and noise texture
- The braille texture has been disabled for better image visibility

```css
.strange-theme::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(10, 10, 10, 0.85), rgba(0, 0, 0, 0.9)), 
              url('data:image/svg+xml;utf8,<svg...>');
  opacity: 0.4;
}
```

### Content Sections

- All content is centered using auto margins and max-width
- Section frames use a dark gray background with subtle transparency
- Red borders and highlights for better visual separation

```css
.strange-section {
  border: 1px solid var(--prison-red);
  background: rgba(26, 26, 26, 0.95);
  margin: 2rem auto;
  max-width: 1200px;
}
```

### Typography

- White text on dark backgrounds for maximum readability
- Red accents for headers and important information
- Text shadows on headers for a more dramatic effect

### UI Elements

#### Cards
- Dark backgrounds with red borders
- Hover effects with shadows and scaling
- Red gradient accent on hover

#### Buttons
- Red gradient background
- White text for high contrast
- Glow effect on hover
- Subtle animation for interaction feedback

#### Audio Player
- Dark background with inset shadows
- Red gradient for progress bar
- Visualizer bars with red glow

#### Image Galleries
- Grayscale filter applied to images with contrast boost
- Red border on hover
- Dark caption overlay with gradient

## Responsiveness

The theme is fully responsive and adapts to different screen sizes:

- Mobile-first approach with breakpoints for larger screens
- Stack layout for mobile views
- Adjusted font sizes and spacing for different devices

## Implementation Notes

### CSS Structure

- Base theme variables in `:root`
- Core layout styles in `strange-theme.css`
- Responsive adjustments at the end of the file
- Component-specific styles grouped together

### JavaScript Enhancements

- Subtle animations for interactive elements
- Smoke effect using SVG noise filter
- Audio visualizer animations
- Red glow effects on hover and focus

### Accessibility Considerations

- High contrast between text and background
- Focus indicators for keyboard navigation
- Voice command support for visually impaired users
- Text alternatives for visual elements

## Usage Guidelines

When extending the site, maintain the dark and painful aesthetic by:

1. Using the established color palette
2. Keeping backgrounds dark with red accents
3. Maintaining centered content with proper spacing
4. Adding subtle smoke or texture effects
5. Using red glow effects for highlights
6. Ensuring all text is legible against dark backgrounds

## Example Implementation

```jsx
<section className="strange-section">
  <h2 className="strange-header">SECTION TITLE</h2>
  <div className="grid md:grid-cols-2 gap-8">
    <div className="strange-card">
      <h3 className="text-white text-xl mb-4">Card Title</h3>
      <p className="text-gray-300">Card content with dark background.</p>
      <button className="strange-button mt-4">ACTION</button>
    </div>
    <div className="strange-card">
      <h3 className="text-white text-xl mb-4">Card Title</h3>
      <p className="text-gray-300">Card content with dark background.</p>
      <button className="strange-button mt-4">ACTION</button>
    </div>
  </div>
</section>
```
