import { test, expect } from '@playwright/test';

test('a direct article link works and can return to arrival', async ({ page }) => {
  await page.goto('./#note-reading');
  await expect(page.locator('#desktop')).toBeVisible();
  await expect(page.locator('#page-content h1'))
    .toHaveText('What stays after the last page');
  await page.getByRole('button', { name: 'Leave computer' }).click();
  await expect(page.locator('#desktop')).not.toBeVisible();
  await expect(page.locator('#arrival')).toBeVisible();
});

test('the living room computer opens a real article', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Find your way in' }))
    .toBeEnabled();
  await page.getByRole('button', { name: 'Open navigation and controls' }).click();
  await page.getByRole('button', { name: 'Living room ↗', exact: true }).click();
  await expect(page.locator('#location')).toHaveText('THE LIVING ROOM');
  await expect(page.locator('#interact')).toBeVisible();
  await page.keyboard.press('KeyE');
  await expect(page.locator('#desktop')).toBeVisible();
  await page.locator('.entry').first().click();
  await expect(page.locator('#page-content h1'))
    .toHaveText('A small place on the internet');
  await page.keyboard.press('Escape');
  await expect(page.locator('#desktop')).not.toBeVisible();
  await expect(page.locator('#location')).toBeVisible();
  expect(errors).toEqual([]);
});

test('the reader fits a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#journal');
  await expect(page.locator('#desktop')).toBeVisible();
  await expect(page.locator('#page-content h1')).toHaveText('Hello, you found me.');
  const overflow = await page.evaluate(() => {
    const reader = document.querySelector('.browser-page');
    return {
      document: document.documentElement.scrollWidth > innerWidth,
      reader: reader.scrollWidth > reader.clientWidth,
    };
  });
  expect(overflow).toEqual({ document: false, reader: false });
});

test('reading remains available when WebGL cannot initialize', async ({ page }) => {
  // Install before application code runs. Keep the 2D canvas API available.
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(kind)) return null;
      return getContext.call(this, kind, ...args);
    };
  });
  await page.goto('./');
  await expect(page.locator('#world-status'))
    .toContainText('THE 3D WORLD IS UNAVAILABLE');
  await page.getByRole('button', { name: 'Just here to read ↗' }).click();
  await expect(page.locator('#desktop')).toBeVisible();
  await page.locator('.entry').first().click();
  await expect(page.locator('#page-content h1'))
    .toHaveText('A small place on the internet');
});
