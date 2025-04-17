# Domain Integration Guide

## Vercel Deployment (Recommended)

1. Create an account on [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` from your project directory
4. After deployment, go to Vercel dashboard → Your Project → Settings → Domains
5. Add your custom domain (e.g., redlotusmusic.com)
6. Follow Vercel's instructions to update DNS records at your domain registrar:
   - Add an A record pointing to Vercel's IP
   - Add a CNAME record for www subdomain

## Netlify Deployment (Alternative)

1. Create an account on [Netlify](https://netlify.com)
2. Install Netlify CLI: `npm i -g netlify-cli`
3. Run `netlify deploy` from your project directory
4. Go to Netlify dashboard → Your Site → Settings → Domain Management
5. Add your custom domain
6. Update DNS records at your domain registrar per Netlify's instructions

## DNS Configuration (at your domain registrar)

Typical DNS configuration:
- A record: @ → [hosting provider's IP]
- CNAME record: www → [your-site-name].netlify.app or [your-site-name].vercel.app

## Notes
- DNS changes can take 24-48 hours to fully propagate
- Always enable HTTPS for security
- Test your site on both www and non-www versions of your domain
