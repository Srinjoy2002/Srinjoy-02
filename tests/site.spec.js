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

test.describe('time-based theme', () => {
  const at = (hh, mm = 0) => new Date(2026, 5, 15, hh, mm, 0);

  test('light between 6 am and 6 pm, dark otherwise', async ({ page }) => {
    for (const [hour, expected] of [[5, 'dark'], [6, 'light'], [12, 'light'], [17, 'light'], [18, 'dark'], [23, 'dark']]) {
      await page.clock.install({ time: at(hour, hour === 17 ? 59 : 0) });
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
    }
  });

  test('glyph clock shows local time as dot-matrix digits', async ({ page }) => {
    await page.clock.install({ time: at(14, 7) });
    await page.goto('/');
    await expect(page.locator('#glyphClock')).toHaveAttribute('aria-label', /14:07/);
    // digit "1" lights 8 dots, "4" lights 9, "0" lights 12, "7" lights 7
    const lit = await page.locator('.gc-digit').evaluateAll(n => n.map(d => d.querySelectorAll('i.on').length));
    expect(lit).toEqual([8, 9, 12, 7]);
  });

  test('corner button overrides until the next switch and returns to auto', async ({ page }) => {
    await page.clock.install({ time: at(10, 0) });
    await page.goto('/');
    const html = page.locator('html');
    const fab = page.locator('#themeToggle');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(fab).toHaveAttribute('aria-label', 'Switch to dark theme');
    await fab.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#gcMode')).toHaveText('MANUAL');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await fab.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('#gcMode')).toHaveText('AUTO');
  });

  test('manual choice expires at the next scheduled switch', async ({ page }) => {
    await page.clock.install({ time: at(17, 59) });
    await page.goto('/');
    await page.locator('#themeToggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.clock.runFor(2 * 60 * 1000);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('#gcMode')).toHaveText('AUTO');
  });

  test('theme controls exist on the projects page too', async ({ page }) => {
    await page.goto('/projects.html');
    await expect(page.locator('#themeToggle')).toBeVisible();
    await expect(page.locator('.gc-digit')).toHaveCount(4);
  });
});
