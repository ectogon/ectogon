const { defineConfig } = require("@playwright/test");

const port = Number.parseInt(process.env.BROWSER_QA_PORT || "4173", 10);
const externalBaseURL = process.env.BROWSER_QA_BASE_URL;
const baseURL = externalBaseURL || `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: "./tests/browser",
  outputDir: "test-results/browser-qa",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    browserName: "chromium",
    deviceScaleFactor: 1,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: `make serve PORT=${port}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1536, height: 1024 } },
    },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
});
