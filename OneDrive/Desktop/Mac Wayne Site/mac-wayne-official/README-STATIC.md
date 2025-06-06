# Mac Wayne Official Website

A static HTML/CSS/JavaScript website for hip-hop artist Mac Wayne. Converted from Next.js to static files for optimal performance and simplified deployment.

## 🎵 Features

- **Responsive Design**: Optimized for all devices
- **Audio Player**: Custom-built JavaScript audio player with full controls
- **Shop**: E-commerce functionality with cart management
- **Documentary**: Video showcase with modal player
- **Animations**: Smooth scroll animations and hover effects
- **Newsletter**: Email subscription functionality
- **Tour Dates**: Event listings and ticket integration

## 🚀 Deployment

The site deploys automatically to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

### Live Site
- Production: `https://[username].github.io/mac-wayne-official`

## 📁 Project Structure

```
mac-wayne-official/
├── index.html              # Main landing page
├── shop.html              # E-commerce page
├── documentary.html       # Video showcase page
├── styles/                # CSS files
│   ├── main.css          # Base styles and layout
│   ├── components.css    # Component-specific styles  
│   └── animations.css    # Animation effects
├── js/                   # JavaScript functionality
│   ├── main.js          # Core site functionality
│   ├── audio-player.js  # Audio player controls
│   ├── shop.js         # Shopping cart logic
│   ├── animations.js   # Animation controllers
│   └── documentary.js  # Video modal functionality
├── public/              # Static assets
│   ├── Images/         # Image files
│   └── audio/          # Audio files
└── .github/workflows/  # GitHub Actions deployment
```

## 🎨 Design System

### Colors
- **Primary**: `#8B0000` (Dark Red)
- **Secondary**: `#FF6B35` (Orange)  
- **Accent**: `#FFD700` (Gold)
- **Background**: `#0A0A0A` (Near Black)
- **Text**: `#FFFFFF` / `#CCCCCC`

### Typography
- **Headers**: Bold, uppercase styling
- **Body**: Clean, readable fonts
- **Accent**: Italic for emphasis

## 🛠️ Development

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. Use Live Server extension for live reloading

### File Organization
- Keep HTML semantic and accessible
- CSS follows BEM methodology where applicable
- JavaScript uses ES6+ features with fallbacks
- All images optimized for web

## 🔧 JavaScript Features

### Audio Player (`js/audio-player.js`)
- Play/pause controls
- Progress tracking
- Volume control
- Playlist management
- Mobile-friendly touch controls

### Shopping Cart (`js/shop.js`)
- Add/remove items
- Quantity management
- Local storage persistence
- Filter and sort products
- Checkout integration ready

### Animations (`js/animations.js`)
- Scroll-triggered animations
- Intersection Observer API
- Smooth scrolling
- Hover effects
- Loading states

## 📱 Mobile Optimization

- Responsive grid layouts
- Touch-friendly navigation
- Optimized image loading
- Mobile-first CSS approach
- Fast loading times

## 🔐 Performance

- Minified CSS and JavaScript
- Optimized images
- Lazy loading where appropriate
- Efficient DOM manipulation
- Local storage for user preferences

## 🎯 Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers

## 📈 Analytics Ready

The site includes placeholder analytics tracking points:
- Page views
- Audio player interactions
- Shopping cart events
- Newsletter signups
- Video engagement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across devices
5. Submit a pull request

## 📄 License

© 2024 Mac Wayne. All rights reserved.
Strange Music Entertainment

---

**Note**: This is a static website conversion from the original Next.js application. All functionality has been preserved while eliminating the need for server-side rendering and Node.js dependencies.
