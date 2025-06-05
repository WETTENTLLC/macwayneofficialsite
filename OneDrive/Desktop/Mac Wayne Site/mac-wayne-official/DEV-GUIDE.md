# Mac Wayne Official Website - Development Guide

This documentation provides guidance on the Mac Wayne official website development and deployment.

## Background & Design Philosophy

The site is styled after the Tech N9ne / Strange Music aesthetic with a clean red and white theme and industrial motifs. Key design elements include:

- Clear, visible background image without grain/brail effects
- High contrast text and elements for readability
- Red accent colors throughout the design
- Industrial/prison-inspired visual elements

## Key Features

1. **Music Showcase**: Album cards with hover effects
2. **Tour Dates**: Event listings with animated effects
3. **Interactive Elements**: Custom buttons and controls
4. **Accessibility Features**: High contrast mode, voice commands
5. **Newsletter Signup**: Fan engagement form

## CSS Structure

The site uses a combination of:
- TailwindCSS for utility classes
- Custom CSS in `strange-theme.css` for specialized styling
- Global CSS in `globals.css` for base styles

### Key CSS Classes

- `.strange-theme`: Base theme class for the entire site
- `.strange-section`: Content section containers
- `.strange-header`: Section headers
- `.strange-button`: Styled buttons
- `.album-card`: Music album display cards
- `.event-item`: Tour date listings

## Images and Media

- Background image: `/Images/macwayne-background.png`
- Logo: `/Images/macwayne-logo.JPG`
- Audio samples in `/audio/` directory

## Responsive Design

The site is fully responsive with mobile breakpoints at 768px.

## Production Optimization

### Deployment Checklist

1. ✅ Clean background image display (no grain/brail effects)
2. ✅ Optimized images with Next.js Image component
3. ✅ SEO optimizations (meta tags, sitemap.xml, robots.txt)
4. ✅ PWA support with manifest.json
5. ✅ Performance optimizations in Next.js config

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

## Future Enhancements

- Full voice command integration
- Enhanced music player with WaveSurfer.js
- Complete e-commerce integration
- Documentary section improvements

## Troubleshooting

- If background image isn't visible, check z-index and overlay settings
- For performance issues, ensure image optimizations are enabled
- For accessibility concerns, test with high contrast mode
