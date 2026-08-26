import { expect, test } from "@playwright/test";

const THEME_KEY = "portfolio-theme";

test.describe("theme", () => {
  test("defaults to the light paper edition when nothing is stored", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("#theme-color")).toHaveAttribute("content", "#f3f0e9");
  });

  test("follows the operating system when nothing is stored", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("toggling swaps the edition and updates assistive state", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#theme-color")).toHaveAttribute("content", "#12110f");
  });

  test("the choice survives a reload and a navigation", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.goto("/work/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  /**
   * The blocking head script exists so a stored edition is never painted from
   * the other one. Reading the attribute at `domcontentloaded` proves it ran
   * before any body content was rendered.
   */
  test("never paints the wrong edition first", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(
      ([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch {}
      },
      [THEME_KEY, "dark"],
    );

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const themeAtFirstPaint = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(themeAtFirstPaint).toBe("dark");
  });
});
