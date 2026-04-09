import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const receiptPath = path.join(__dirname, 'fixtures', 'test-receipt.jpg');

test('upload a receipt photo and verify it is viewable', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('spinbutton', { name: 'Amount' }).fill('10.00');
  await page.getByLabel('Date').fill('2026-04-09');
  const select = page.locator('select').first();
  await select.selectOption({ index: 1 });

  await page.getByLabel('Receipt').setInputFiles(receiptPath);
  await page.getByRole('button', { name: 'Add Expense' }).click();

  await page.getByRole('button', { name: 'View receipt' }).first().click();

  await expect(page.getByRole('dialog', { name: 'Receipt viewer' })).toBeVisible();
  await expect(page.getByAltText('Receipt')).toBeVisible();
});
