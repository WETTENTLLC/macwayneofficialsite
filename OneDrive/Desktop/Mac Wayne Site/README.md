# Mac Wayne Official Website

## Overview
Official website for Mac Wayne featuring the Battered Coin cryptocurrency system and Sheriff Thizz Rewards program. This project includes a fully functional cryptocurrency interface, rewards system, and e-commerce capabilities.

## Key Features
- **Battered Coin Cryptocurrency**: Accessibility-focused cryptocurrency
- **Sheriff Thizz Rewards System**: Points and tier-based loyalty program
- **WalletConnect Integration**: Connect cryptocurrency wallets
- **Responsive Design**: Mobile-first approach
- **Accessibility Focus**: WCAG compliant design

## Technologies Used
- HTML5, CSS3, JavaScript
- WalletConnect Web3 Integration
- LocalStorage for user data persistence
- Responsive design frameworks
- Accessibility-enhanced interface

## Deployment Information
The site is deployed to GitHub Pages and accessible via the custom domain:
- GitHub Pages URL: https://wettentllc.github.io/macwayneofficialsite/
- Custom Domain: https://macwayneofficial.com

## Deployment Process
1. Push code to GitHub repository
2. GitHub Actions workflow deploys to GitHub Pages
3. Namecheap DNS configuration points to GitHub Pages

### GitHub Pages Configuration
- Source: GitHub Actions workflow
- Branch: main
- Custom domain: macwayneofficial.com

### Namecheap DNS Configuration
- A Records:
  - @ -> 185.199.108.153
  - @ -> 185.199.109.153
  - @ -> 185.199.110.153
  - @ -> 185.199.111.153
- CNAME Record:
  - www -> wettentllc.github.io

## Sheriff Thizz Rewards System
The Sheriff Thizz Rewards System is integrated with the Battered Coin cryptocurrency platform, offering:
- Tiered membership levels (Deputy, Sheriff, Legend)
- Points-based rewards
- Achievement tracking
- Exclusive benefits for members

## Development Setup

### Next.js Development
```bash
npm run dev
# or
yarn dev
```

### Static Site Deployment
```bash
# Run the GitHub deployment script
.\github-deploy.ps1
```

## Documentation
- See `DEPLOYMENT-VERIFICATION-CHECKLIST.md` for deployment verification steps
- See `GITHUB-PAGES-SETUP.md` for GitHub Pages configuration details
- See `DOMAIN-DEPLOYMENT.md` for domain configuration instructions

## Last Deployment
- Date: June 6, 2025
- Version: 1.0.0
