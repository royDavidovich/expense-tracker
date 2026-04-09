import { test, expect } from '@playwright/test';

test('add an expense and verify it appears in the list', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('spinbutton', { name: 'Amount' }).fill('25.50');
  await page.getByLabel('Date').fill('2026-04-09');

  const select = page.locator('select').first();
  await select.selectOption({ index: 1 });

  await page.getByLabel('Description').fill('Test lunch');
  await page.getByRole('button', { name: 'Add Expense' }).click();

  await expect(page.getByText('Test lunch')).toBeVisible();
  await expect(page.getByText('$25.50')).toBeVisible();
});
