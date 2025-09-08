const { test, expect } = require('@playwright/test');

test('All music purchase buttons initiate PayPal flow', async ({ page }) => {
  await page.goto('file:///C:/Users/wette/OneDrive/Desktop/Mac Wayne Site/deploy-clean/index.html');

  // Update the selector to match your PayPal purchase buttons
  const purchaseButtons = await page.$$('.paypal-button'); // Change selector if needed

  for (const button of purchaseButtons) {
    await button.click();
    // Wait for PayPal popup or overlay
    await page.waitForTimeout(2000);
    const paypalFrame = await page.$('iframe[src*="paypal.com"]');
    expect(paypalFrame).not.toBeNull();
    // Optionally, close popup or reset state for next button
  }
});