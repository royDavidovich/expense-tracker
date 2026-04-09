import { test, expect } from '@playwright/test';

test('set a monthly budget and verify remaining amount updates', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Set budget' }).click();
  await page.getByLabel('Budget amount input').fill('500');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByLabel('Budget amount').filter({ hasText: 'Budget:' })).toContainText('500');
  await expect(page.getByLabel('Amount remaining')).toBeVisible();
});
