import { test, expect } from '@playwright/test';

test('homepage presents research and working navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Srinjoy');
  await expect(page.getByRole('heading', { name: /Questions that drive/ })).toBeVisible();
  await expect(page.locator('.research-card')).toHaveCount(3);
  await expect(page.locator('.project-card')).toHaveCount(4);
  await expect(page.getByRole('link', { name: /Download CV/ })).toHaveAttribute('href', 'assets/Srinjoy_CV.pdf');
  await expect(page.locator('a[href*="yourusername"], a[href*="your@email.com"]')).toHaveCount(0);
});

test('all local images and PDF resolve', async ({ page }) => {
  await page.goto('/');
  const urls = await page.locator('img').evaluateAll(nodes => nodes.map(n => n.getAttribute('src')));
  urls.push('assets/Srinjoy_CV.pdf');
  for (const url of urls) {
    const response = await page.request.get('/' + url);
    expect(response.ok(), 'Missing asset: ' + url).toBeTruthy();
  }
  await page.goto('/projects.html');
  const detailImages = await page.locator('img').evaluateAll(nodes => nodes.map(n => n.getAttribute('src')));
  for (const url of detailImages) {
    const response = await page.request.get('/' + url);
    expect(response.ok(), 'Missing detail image: ' + url).toBeTruthy();
  }
  await expect(page.locator('.slide-track figure')).toHaveCount(8);
});

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test('no horizontal overflow at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth
    }));
    expect(dimensions.scroll, 'Horizontal overflow at ' + width + 'px').toBeLessThanOrEqual(dimensions.viewport + 1);
    if (width === 390 || width === 1440) {
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode().catch(() => {}));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: 'test-results/home-' + width + '.png', fullPage: true });
    }
  });
}

test('mobile menu opens, follows link and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('#menuToggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Research' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('reduced-motion setting disables smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(behavior).toBe('auto');
});
