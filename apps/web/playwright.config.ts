import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4000";
const shouldStartLocalWebServer = !process.env.PLAYWRIGHT_BASE_URL;
const isPlaywrightCi =
  process.env.PLAYWRIGHT_CI === "1" ||
  process.env.PLAYWRIGHT_CI === "true" ||
  process.env.CI === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: isPlaywrightCi,
  retries: isPlaywrightCi ? 2 : 0,
  workers: isPlaywrightCi ? 1 : undefined,
  reporter: isPlaywrightCi ? "line" : "html",
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: shouldStartLocalWebServer
    ? {
        command:
          "pnpm --filter web build && PORT=4000 HOSTNAME=127.0.0.1 pnpm --filter web start",
        url: baseURL,
        reuseExistingServer: !isPlaywrightCi,
        timeout: 300 * 1000,
      }
    : undefined,
});
