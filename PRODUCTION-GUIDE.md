# Mac Wayne Official Website - Production Guide

This guide contains information on how to prepare the Mac Wayne site for production deployment.

## Production Checklist

### Performance Optimizations

- [x] Optimize images using Next.js Image component
- [x] Enable CSS optimization in next.config.js
- [x] Use font optimization with next/font
- [x] Implement code splitting and lazy loading
- [x] Add responsive image sizing with proper srcset
- [x] Optimize third-party package imports
- [x] Set up HTTP/2 server push headers
- [x] Enable compression for assets

### SEO Optimizations

- [x] Create robots.txt file
- [x] Generate sitemap.xml
- [x] Add proper meta tags in layout.tsx
- [x] Set up canonical URLs
- [x] Implement structured data (JSON-LD)
- [x] Use semantic HTML elements
- [x] Add alt text to all images
- [x] Set up proper redirects for moved content

### PWA Features

- [x] Create manifest.json
- [x] Add service worker for offline support
- [x] Implement app installation flow
- [x] Set up proper caching strategies
- [x] Add offline fallback pages
- [x] Create app icons in different sizes
- [x] Set theme-color for browser UI

### Accessibility

- [x] Ensure proper color contrast (dark theme with white/red highlights)
- [x] Add keyboard navigation support
- [x] Include voice commands for visually impaired users
- [x] Implement ARIA attributes
- [x] Add skip-to-content links
- [x] Ensure all forms are accessible
- [x] Test with screen readers

### Security

- [x] Implement Content Security Policy
- [x] Add security headers
- [x] Set up HTTPS
- [x] Sanitize user inputs
- [x] Implement CSRF protection
- [x] Regular security audits
- [x] Secure cookie settings

## Deployment Options

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Self-Hosted

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Static Export (Optional)

For static hosting platforms like Netlify, GitHub Pages, etc.:

1. Set `output: 'export'` in next.config.js
2. Run `npm run build`
3. The exported site will be in the `out` directory

## Environment Variables

Ensure these environment variables are set in your production environment:

```
NEXT_PUBLIC_API_URL=https://api.macwayneofficial.com
NEXT_PUBLIC_SITE_URL=https://www.macwayneofficial.com
DATABASE_URL=your_database_connection_string
AUTH_SECRET=your_auth_secret
```

## Monitoring

- Set up error tracking with Sentry or similar service
- Implement analytics to track user engagement
- Set up performance monitoring
- Create automated health checks

## Backup Strategies

- Database backups (daily)
- Content backups (images, audio files)
- Configuration backups
- Regular testing of restore procedures

## Dark Theme Implementation

The site uses a dark, painful aesthetic with smoke effects and dark tones:

- Background is dark with smoky overlay effect
- Red and white are used for highlights and accents
- All content is centered with dark grey section frames
- The background image is sized to be fully visible
- Text is predominantly white for high contrast
- Interactive elements have red accents

## Production Build Troubleshooting

If you encounter linting errors during build:

```bash
# Skip linting for production build
next build --no-lint
```

For TypeScript errors:

```bash
# Check TypeScript errors without building
npm run type-check
```

## Regular Maintenance

- Update dependencies monthly
- Check for security vulnerabilities
- Review and optimize performance
- Update content regularly
- Test across different devices and browsers
