import { expect, test } from "@playwright/test";
import { articles } from "../src/data/articles";

const deepPath = `/work/${articles[0]!.slug}/`;

test.describe("language", () => {
  test("English is the default edition and is what x-default points at", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const [xDefault, english] = await Promise.all([
      page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute("href"),
      page.locator('link[rel="alternate"][hreflang="en"]').getAttribute("href"),
    ]);
    expect(xDefault).toBe(english);
  });

  test("the toggle lands on the counterpart of the current page, not the home page", async ({
    page,
  }) => {
    await page.goto(deepPath);
    await page.getByTestId("lang-toggle").click();

    await expect(page).toHaveURL(new RegExp(`/vi${deepPath}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("switching back returns to the identical original URL", async ({ page }) => {
    await page.goto(deepPath);
    await page.getByTestId("lang-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");

    await page.getByTestId("lang-toggle").click();
    await expect(page).toHaveURL(new RegExp(`${deepPath}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("both editions declare each other as alternates", async ({ page }) => {
    for (const path of [deepPath, `/vi${deepPath}`]) {
      await page.goto(path);
      const en = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute("href");
      const vi = await page.locator('link[rel="alternate"][hreflang="vi"]').getAttribute("href");
      expect(en).toMatch(new RegExp(`${deepPath}$`));
      expect(vi).toMatch(new RegExp(`/vi${deepPath}$`));
    }
  });
});
