# Mac Wayne Official Website Verification

## Website Structure Verification
- [x] Main index.html is for Mac Wayne (not Dru Down)
- [x] Battered Coin page is correctly linked in navigation
- [x] Sheriff Thizz Rewards System is integrated
- [x] WalletConnect is properly configured with Project ID: 8108c677f442f0194701b6076df5c1a6

## GitHub Pages Configuration
- [ ] Repository URL: https://github.com/WETTENTLLC/macwayneofficialsite
- [ ] GitHub Pages is enabled
- [ ] Custom domain is set to: macwayneofficial.com
- [ ] HTTPS is enforced
- [ ] CNAME file contains only: macwayneofficial.com

## Namecheap DNS Configuration
- [ ] A Record: @ → 185.199.108.153
- [ ] A Record: @ → 185.199.109.153
- [ ] A Record: @ → 185.199.110.153
- [ ] A Record: @ → 185.199.111.153
- [ ] CNAME Record: www → wettentllc.github.io.

## Important
If you're seeing the wrong website (Dru Down), it could be due to:
1. Incorrect DNS settings in Namecheap
2. Old DNS records still pointing to another server
3. DNS cache not updated yet (can take up to 48 hours)
4. Browser cache showing old version of the site

Try accessing the site in an incognito window or after clearing your browser cache.
Also check your site at: https://wettentllc.github.io/macwayneofficialsite/ to confirm the correct content is deployed.

## Next Steps
1. Run the fix-custom-domain.ps1 script for detailed instructions
2. Remove any conflicting DNS records in Namecheap
3. Force a rebuild of GitHub Pages by temporarily removing and re-adding the custom domain
4. Verify DNS propagation using https://dnschecker.org/#A/macwayneofficial.com
