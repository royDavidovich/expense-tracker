import { test, expect } from '@playwright/test';

test('add a new category and verify it appears in the dropdown', async ({ page }) => {
  const categoryName = `Pets-${Date.now()}`;

  await page.goto('/');

  await page.getByRole('button', { name: '+ Add category' }).click();
  await page.getByLabel('New category name').fill(categoryName);
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for the form to disappear (API call completes and state updates)
  await page.getByRole('button', { name: '+ Add category' }).waitFor({ state: 'visible' });

  const select = page.locator('select').first();
  await expect(select.locator('option', { hasText: categoryName })).toBeAttached();
});
