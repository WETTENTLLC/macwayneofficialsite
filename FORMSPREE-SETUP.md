# Formspree Setup Guide

This document outlines the steps to correctly configure and update Formspree forms across the website.

## 1. Identify All Formspree Endpoints

The following endpoints are currently in use:

- `https://formspree.io/f/mldlyaln` (new primary)
- `https://formspree.io/f/mzzgvrrb` (old, needs to be replaced)
- `https://formspree.io/f/xpwagqko` (old, needs to be replaced)
- `https://formspree.io/f/xgveaarg` (old, needs to be replaced)

## 2. Update Form Actions

All forms should be updated to use the new primary endpoint: `https://formspree.io/f/mldlyaln`

### Files to Update:

- `licensing.html`
- `site-comprehensive-check.html`
- `final-verification-checklist.md`

## 3. Verify Form Submissions

After updating the endpoints, test each form to ensure submissions are correctly routed to the primary email address associated with the new Formspree account.

## 4. Cleanup Old Endpoints

Once all forms are verified, the old Formspree endpoints can be deprecated.
