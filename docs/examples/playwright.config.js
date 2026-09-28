import { defineConfig } from '@playwright/test';

// Educational config: start dev or preview separately; see README.md.
export default defineConfig({
  testDir: '.',
  testMatch: 'site.spec.js',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: 1,
  reporter: 'list',
  outputDir: '../../test-results/learning-examples',
  use: {
    baseURL: process.env.SITE_URL || 'http://127.0.0.1:5173/',
    browserName: 'chromium',
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
        : {}),
      ...(process.env.SOFTWARE_WEBGL === '1'
        ? { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] }
        : {}),
    },
  },
});
