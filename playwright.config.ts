import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : 4,

  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'https://reqres.in',
    extraHTTPHeaders: {
      'x-api-key':    process.env['REQRES_API_KEY'] ?? 'reqres_26b57a99fd7e493b890bc5e942d82da8',
      'Content-Type': 'application/json',
    },
  },
});