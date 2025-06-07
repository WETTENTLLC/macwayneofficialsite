# Namecheap Domain Configuration Guide for macwayneofficial.com

## CRITICAL PROBLEM
The domain macwayneofficial.com is currently pointing to Dru Down's website instead of Mac Wayne's GitHub Pages site.

## ROOT CAUSE
The issue is due to conflicting DNS records in Namecheap. There are likely old DNS records pointing to Dru Down's hosting server that need to be completely removed before adding the GitHub Pages DNS records.

## STEP-BY-STEP SOLUTION

### 1. COMPLETELY RESET NAMECHEAP DNS CONFIGURATION
This is the most critical step and must be done first.

1. Log in to your Namecheap account
2. Go to 'Domain List' and click 'Manage' next to macwayneofficial.com
3. Click on the 'Advanced DNS' tab
4. **DELETE ALL EXISTING DNS RECORDS** - This is absolutely crucial
   - Select each record and click the delete (trash) icon
   - Remove ALL A records, CNAME records, TXT records, etc.
   - The DNS records page should be completely empty

### 2. ADD GITHUB PAGES DNS RECORDS
After removing all existing records, add these exact records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |
| CNAME Record | www | wettentllc.github.io | Automatic |

### 3. VERIFY GITHUB REPOSITORY SETTINGS

1. Go to: https://github.com/WETTENTLLC/macwayneofficialsite/settings/pages
2. Under 'Custom domain', ensure it's set to: macwayneofficial.com
3. Click 'Save'
4. Wait for GitHub to verify DNS settings (this may take a few minutes)
5. Once verified, check 'Enforce HTTPS' option

### 4. ENSURE CNAME FILE EXISTS IN REPOSITORY

The repository should have a file named 'CNAME' at the root level containing only:
```
macwayneofficial.com
```

### 5. WAIT FOR DNS PROPAGATION

DNS changes can take up to 48 hours to fully propagate. You can check the progress using:
- https://dnschecker.org/#A/macwayneofficial.com
- https://www.whatsmydns.net/#A/macwayneofficial.com

### 6. CLEAR LOCAL DNS CACHE AND BROWSER CACHE

1. Clear your local DNS cache:
   ```
   ipconfig /flushdns
   ```
2. Clear your browser cache
3. Try accessing in a different browser or private/incognito mode
4. Try from a different network (e.g., mobile data instead of WiFi)

## TESTING YOUR SITE

After DNS propagation, test these URLs:
1. https://macwayneofficial.com
2. https://www.macwayneofficial.com
3. https://macwayneofficial.com/battered-coin.html

## TROUBLESHOOTING

If after 48 hours you still see Dru Down's website:

1. Double-check Namecheap DNS records - ensure NO conflicting records exist
2. Contact Namecheap support to verify there are no domain conflicts
3. Check if there are any URL redirects configured in Namecheap
4. Verify GitHub Pages is correctly set up in your repository

## SCREENSHOT GUIDE

![Example of Namecheap DNS Settings](https://docs.github.com/assets/images/help/pages/namecheap-dns-settings.png)

## COMMON MISTAKES TO AVOID

1. Not removing all existing DNS records first
2. Using the wrong GitHub Pages IP addresses
3. Setting the CNAME record incorrectly
4. Not waiting long enough for DNS propagation
5. Testing from a device that has cached the old DNS records

## SUCCESS VERIFICATION CHECKLIST

- [ ] Namecheap DNS records show only GitHub Pages IPs
- [ ] CNAME file exists in repository with correct domain
- [ ] GitHub Pages shows 'Your site is published at https://macwayneofficial.com/'
- [ ] Website loads Mac Wayne content (not Dru Down)
- [ ] Battered Coin page is accessible from navigation
- [ ] HTTPS is working for all pages

## SUPPORT RESOURCES

If you need additional help:
- GitHub Pages Documentation: https://docs.github.com/en/pages
- Namecheap Support: https://www.namecheap.com/support/
- GitHub Support: https://support.github.com/
