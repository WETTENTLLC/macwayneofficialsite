# Mac Wayne Battered Coin - Production Build

This directory contains the production-ready build of the Mac Wayne cryptocurrency system.

## Quick Start

1. Upload all files to your web server
2. Configure your web server to serve battered-coin.html as the main page
3. Update the configuration in js/production-config.js with your actual:
   - Smart contract addresses
   - API keys
   - Network configuration

## File Structure

- battered-coin.html - Main cryptocurrency interface
- js/ - All JavaScript modules for crypto functionality
- styles/ - CSS styling for the application
- public/ - Static assets (images, audio, etc.)
- sw.js - Service worker for offline functionality

## Configuration

Edit js/production-config.js to configure:
- Smart contract addresses (after deployment)
- API endpoints
- Wallet integration settings
- Network configuration

## SSL Required

This application requires HTTPS to function properly due to:
- Web3 wallet integration requirements
- Service worker functionality
- Security best practices for financial applications

## Features Included

- Wallet Integration (MetaMask, WalletConnect, Coinbase)
- Real-time Market Data
- Smart Contract Interactions
- NFT Marketplace
- Staking & Yield Farming
- Trading Interface
- Accessibility-First Design
- Mobile Optimization
- Offline Support
- Performance Optimization
