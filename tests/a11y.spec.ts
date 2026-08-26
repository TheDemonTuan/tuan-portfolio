import { expect, test } from "@playwright/test";
import { ui } from "../src/data/ui";

test.describe("accessibility", () => {
  test("the skip link is the first tab stop and moves focus into the main region", async ({
    page,
    isMobile,
  }) => {
    test.skip(Boolean(isMobile), "keyboard tabbing is a pointer-free interaction");

    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByTestId("skip-link");
    await expect(skipLink).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });

  test("landmarks are labelled from the shared strings, not from hardcoded copy", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: ui.mainNav.en })).toBeVisible();

    await page.goto("/vi/");
    await expect(page.getByRole("navigation", { name: ui.mainNav.vi })).toBeVisible();
  });

  test("the theme control is a real button with a described state", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toHaveRole("button");
    await expect(toggle).toHaveAttribute("aria-label", /.+/);
    await expect(toggle).toHaveAttribute("aria-pressed", /true|false/);
  });

  test("the current section is marked in the masthead", async ({ page }) => {
    await page.goto("/work/");
    await expect(page.locator('a[aria-current="page"]')).toHaveCount(1);
  });

  test("every icon in the page's own chrome is explicitly decorative", async ({ page }) => {
    await page.goto("/work/");
    // Scoped by the site's own class and id: Playwright's CSS engine pierces
    // open shadow roots, so a bare `header svg` also matches inside the dev
    // server's injected toolbar, whose icons are not ours to assert on.
    const unlabelled = await page
      .locator(
        ".masthead svg:not([aria-hidden='true']), main#main-content svg:not([aria-hidden='true'])",
      )
      .count();
    expect(unlabelled).toBe(0);
  });
});
