import { defineConfig } from "@playwright/test";

// UI conformance suite for visual-engineering/UI-LAYOUT-INTERACTION@1.0.0.
// Serves the repository root, which GitHub Pages publishes at decisionposture.com.
const port = Number(process.env.UI_CONFORMANCE_PORT ?? 47317);
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

export default defineConfig({
  testDir: "./specs",
  testMatch: /.*\.spec\.mjs/,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  outputDir: "test-results",
  // The JSON report feeds emit-evidence.mjs.
  reporter: [
    [process.env.CI ? "line" : "list"],
    ["json", { outputFile: "reports/results.json" }],
    ...(process.env.CI ? [["html", { open: "never", outputFolder: "playwright-report" }]] : [])
  ],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: { executablePath }
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "node serve.mjs ../..",
    env: { PORT: String(port) },
    url: `http://127.0.0.1:${port}/index.html`,
    // Never reuse: other processes on a shared machine may hold the port.
    reuseExistingServer: false
  }
});
