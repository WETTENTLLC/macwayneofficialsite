# Mac Wayne Website - Comprehensive Testing Protocol

## 1. Responsive Design Testing

### Device Emulation (Chrome DevTools)
```bash
# Open Chrome DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
```

**Test Devices:**
- **Mobile S**: iPhone SE (375x667)
- **Mobile M**: iPhone 12 Pro (390x844) 
- **Mobile L**: iPhone 12 Pro Max (428x926)
- **Tablet**: iPad (768x1024)
- **Desktop**: 1920x1080

**Checklist per Device:**
- [ ] Navigation menu functionality
- [ ] Hero logo scaling and positioning
- [ ] Donation form layout and usability
- [ ] Social media buttons accessibility
- [ ] Audio player controls visibility
- [ ] Text readability (minimum 16px)
- [ ] Button touch targets (minimum 44px)
- [ ] No horizontal scrolling
- [ ] Content fits viewport

### Orientation Testing
- [ ] Portrait mode functionality
- [ ] Landscape mode layout adaptation
- [ ] Navigation behavior on rotation

## 2. Accessibility Testing

### Lighthouse Audit
```bash
# Command line audit
lighthouse https://macwayneofficial.com --view --preset=desktop
lighthouse https://macwayneofficial.com --view --preset=mobile

# Focus on accessibility score (target: 95+)
```

### WCAG 2.1 Compliance
- [ ] **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Focus Indicators**: Visible focus states on all focusable elements
- [ ] **Alt Text**: All images have descriptive alt attributes
- [ ] **ARIA Labels**: Form inputs and buttons properly labeled
- [ ] **Heading Structure**: Logical H1-H6 hierarchy
- [ ] **Screen Reader**: Test with NVDA/JAWS/VoiceOver

### Keyboard Navigation Test
```
Tab → Shift+Tab → Enter → Space → Arrow Keys → Escape
```
- [ ] All interactive elements reachable
- [ ] Logical tab order
- [ ] Modal dialogs trap focus
- [ ] Skip links available
- [ ] No keyboard traps

### Screen Reader Testing
- [ ] Page title announced correctly
- [ ] Headings structure logical
- [ ] Form labels associated properly
- [ ] Button purposes clear
- [ ] Live regions for dynamic content
- [ ] Image descriptions meaningful

## 3. Functionality Testing

### Navigation
- [ ] All menu links work correctly
- [ ] Mobile menu toggle functions
- [ ] Smooth scrolling to anchors
- [ ] Active page highlighting
- [ ] Logo links to homepage

### Donation System
- [ ] Amount input validation (minimum $1)
- [ ] Quick amount buttons ($5, $10, $25, $50)
- [ ] Custom amount entry
- [ ] Payment modal opens correctly
- [ ] Processing simulation works
- [ ] Success message displays
- [ ] Form resets after completion
- [ ] Error handling for invalid inputs
- [ ] Fallback payment methods accessible

### Social Media Integration
- [ ] Instagram link opens correctly
- [ ] TikTok link opens correctly
- [ ] Share website function works
- [ ] Native share API fallback
- [ ] Copy link functionality
- [ ] Social tracking events fire

### Audio Player
- [ ] Track preview playback (30 seconds)
- [ ] Purchase flow integration
- [ ] Volume controls functional
- [ ] Progress bar accurate
- [ ] Track switching works
- [ ] Mobile audio compatibility

### Forms
- [ ] Newsletter subscription
- [ ] Contact form submission
- [ ] Input validation messages
- [ ] Success/error feedback
- [ ] Required field indicators

## 4. Browser Compatibility Testing

### Desktop Browsers
- [ ] **Chrome** (latest): Full functionality
- [ ] **Firefox** (latest): CSS Grid/Flexbox support
- [ ] **Safari** (latest): WebKit prefixes, audio autoplay
- [ ] **Edge** (latest): Modern features support

### Mobile Browsers
- [ ] **Chrome Mobile**: Touch interactions
- [ ] **Safari iOS**: Audio playback, viewport handling
- [ ] **Firefox Mobile**: Performance optimization
- [ ] **Samsung Internet**: Samsung-specific features

### Cross-Browser Issues to Check
- [ ] CSS Grid layout consistency
- [ ] Flexbox alignment
- [ ] Audio element behavior
- [ ] Modal backdrop filters
- [ ] Custom font loading
- [ ] Animation performance

## 5. Performance Testing

### Core Web Vitals
```bash
# PageSpeed Insights
https://pagespeed.web.dev/analysis?url=https://macwayneofficial.com

# Target Metrics:
# LCP (Largest Contentful Paint): < 2.5s
# FID (First Input Delay): < 100ms  
# CLS (Cumulative Layout Shift): < 0.1
```

### Performance Checklist
- [ ] **LCP**: Hero logo loads quickly
- [ ] **FID**: Buttons respond immediately
- [ ] **CLS**: No layout shifts during load
- [ ] **TTI**: Time to Interactive < 3.8s
- [ ] **Speed Index**: < 3.4s

### Animation Performance
```javascript
// Check for 60fps animations
console.log('Animation frame rate test');
let frames = 0;
function countFrames() {
    frames++;
    requestAnimationFrame(countFrames);
}
requestAnimationFrame(countFrames);
setTimeout(() => console.log(`FPS: ${frames}`), 1000);
```

- [ ] Navigation hover animations smooth
- [ ] Button transitions at 60fps
- [ ] Modal animations performant
- [ ] No janky scrolling
- [ ] CSS animations use transform/opacity

### Resource Optimization
- [ ] Images optimized (WebP where supported)
- [ ] CSS minified for production
- [ ] JavaScript bundled efficiently
- [ ] Fonts loaded optimally
- [ ] No unused CSS/JS

## 6. Security Testing

### Content Security Policy
- [ ] No inline scripts/styles
- [ ] External resources whitelisted
- [ ] XSS protection enabled
- [ ] HTTPS enforcement

### Form Security
- [ ] Input sanitization
- [ ] CSRF protection
- [ ] Rate limiting on submissions
- [ ] No sensitive data in URLs

## 7. SEO Testing

### Technical SEO
- [ ] Meta titles unique and descriptive
- [ ] Meta descriptions compelling
- [ ] Structured data markup
- [ ] Canonical URLs set
- [ ] XML sitemap exists
- [ ] Robots.txt configured

### Content SEO
- [ ] H1 tags on each page
- [ ] Internal linking structure
- [ ] Image alt text descriptive
- [ ] URL structure clean
- [ ] Page load speed optimized

## 8. Automated Testing Commands

### Lighthouse CI
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --upload.target=temporary-public-storage
```

### Accessibility Testing
```bash
# Install axe-cli
npm install -g @axe-core/cli

# Run accessibility audit
axe https://macwayneofficial.com --tags wcag2a,wcag2aa
```

### Performance Monitoring
```bash
# WebPageTest API
curl "https://www.webpagetest.org/runtest.php?url=https://macwayneofficial.com&k=API_KEY&f=json"
```

## 9. Manual Testing Checklist

### Pre-Launch Verification
- [ ] All links functional
- [ ] Forms submit correctly  
- [ ] Images load properly
- [ ] Audio files accessible
- [ ] Payment flow complete
- [ ] Error pages exist (404, 500)
- [ ] Analytics tracking active
- [ ] Contact information accurate

### Post-Launch Monitoring
- [ ] Server response times
- [ ] Error rate monitoring
- [ ] User behavior analytics
- [ ] Conversion tracking
- [ ] Performance metrics
- [ ] Security scan results

## 10. Testing Schedule

### Daily Checks
- [ ] Site availability
- [ ] Core functionality
- [ ] Performance metrics

### Weekly Audits  
- [ ] Accessibility compliance
- [ ] Security vulnerabilities
- [ ] Performance optimization

### Monthly Reviews
- [ ] Full browser compatibility
- [ ] SEO performance
- [ ] User experience analysis
- [ ] Content updates needed

## Testing Tools Reference

**Browser Testing:**
- Chrome DevTools
- Firefox Developer Tools
- Safari Web Inspector
- BrowserStack (cross-browser)

**Accessibility:**
- WAVE Web Accessibility Evaluator
- axe DevTools
- Lighthouse
- Screen readers (NVDA, JAWS, VoiceOver)

**Performance:**
- PageSpeed Insights
- WebPageTest
- GTmetrix
- Chrome DevTools Performance tab

**SEO:**
- Google Search Console
- Screaming Frog SEO Spider
- SEMrush Site Audit
- Ahrefs Site Explorer

---

**Testing Completion Criteria:**
- ✅ All functionality tests pass
- ✅ Accessibility score 95+ 
- ✅ Performance score 90+
- ✅ Cross-browser compatibility confirmed
- ✅ Mobile responsiveness verified
- ✅ Security vulnerabilities addressed