import { test, expect } from '@playwright/test';

test.describe('WoxMenu Positioning under CSS Zoom', () => {
  test.beforeEach(async ({ page }) => {
    // Open the test page served by the dev server
    await page.goto('http://localhost:5173/tests/test-zoom-menu.html');
  });

  test('should align dropdown correctly under page-level zoom (zoom: 1.25)', async ({ page }) => {
    const trigger = page.locator('#menu-file .trigger');
    const dropdown = page.locator('#menu-file .dropdown');

    // Click to open dropdown
    await trigger.click();
    await expect(dropdown).toBeVisible();

    // Give it a frame to position
    await page.waitForTimeout(100);

    const triggerRect = await trigger.boundingBox();
    const dropdownRect = await dropdown.boundingBox();

    expect(triggerRect).not.toBeNull();
    expect(dropdownRect).not.toBeNull();

    console.log('Page zoom - Trigger:', triggerRect);
    console.log('Page zoom - Dropdown:', dropdownRect);

    // Verify horizontal alignment (left alignment)
    const horizontalDiff = Math.abs(dropdownRect.x - triggerRect.x);
    expect(horizontalDiff).toBeLessThan(1);

    // Verify vertical alignment (dropdown starts at the bottom of trigger)
    const verticalDiff = Math.abs(dropdownRect.y - (triggerRect.y + triggerRect.height));
    expect(verticalDiff).toBeLessThan(1);
  });

  test('should align dropdown correctly under nested zoom (cumulative zoom: 1.5)', async ({ page }) => {
    const trigger = page.locator('#menu-nested-file .trigger');
    const dropdown = page.locator('#menu-nested-file .dropdown');

    // Click to open dropdown
    await trigger.click();
    await expect(dropdown).toBeVisible();

    // Give it a frame to position
    await page.waitForTimeout(100);

    const triggerRect = await trigger.boundingBox();
    const dropdownRect = await dropdown.boundingBox();

    expect(triggerRect).not.toBeNull();
    expect(dropdownRect).not.toBeNull();

    console.log('Nested zoom - Trigger:', triggerRect);
    console.log('Nested zoom - Dropdown:', dropdownRect);

    // Verify horizontal alignment (left alignment)
    const horizontalDiff = Math.abs(dropdownRect.x - triggerRect.x);
    expect(horizontalDiff).toBeLessThan(1);

    // Verify vertical alignment (dropdown starts at the bottom of trigger)
    const verticalDiff = Math.abs(dropdownRect.y - (triggerRect.y + triggerRect.height));
    expect(verticalDiff).toBeLessThan(1);
  });
});
