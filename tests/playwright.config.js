import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: [
    {
      command: 'cd ../server && npm run dev',
      url: 'http://localhost:3001/categories',
      reuseExistingServer: true,
    },
    {
      command: 'cd ../client && npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
  ],
});
