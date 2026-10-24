import { expect, test } from "@playwright/test";

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
    await expect(page.locator("main#main-content")).toBeFocused();
  });

  test("theme accessible names include the visible voice-control label in both editions", async ({
    page,
  }) => {
    for (const path of ["/", "/vi/"]) {
      await page.goto(path);
      const toggle = page.getByTestId("theme-toggle");
      for (let theme = 0; theme < 2; theme++) {
        await expect(toggle).toHaveAccessibleName(
          new RegExp(RegExp.escape(await toggle.innerText())),
        );
        await toggle.click();
      }
    }
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
        "header svg:not([aria-hidden='true']), main#main-content svg:not([aria-hidden='true'])",
      )
      .count();
    expect(unlabelled).toBe(0);
  });
});
