import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  use: {
    baseURL: externalBaseUrl ?? "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "npm run dev -- --host 127.0.0.1",
        url: "http://127.0.0.1:4321",
        reuseExistingServer: true,
      },
  projects: [
    // 1512 is where the hanging section numerals move into the outer margin,
    // so it needs its own project to be covered at all.
    {
      name: "desktop-wide",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1512, height: 900 } },
    },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
