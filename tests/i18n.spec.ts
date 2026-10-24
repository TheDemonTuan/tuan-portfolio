import { expect, test } from "@playwright/test";

const deepPaths = ["/work/ai-gateway-control-and-data-planes/", "/work/bun-napi-abort/"];

test("English is the unprefixed x-default edition", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const xDefault = await page
    .locator('link[rel="alternate"][hreflang="x-default"]')
    .getAttribute("href");
  const english = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute("href");
  expect(xDefault).toBe(english);
});

for (const path of deepPaths) {
  test(`${path} switches to its locale counterpart and back`, async ({ page }) => {
    await page.goto(path);
    await page.getByTestId("lang-toggle").click();
    await expect(page).toHaveURL(new RegExp(`/vi${path}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await page.getByTestId("lang-toggle").click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test(`${path} declares matching locale alternates`, async ({ page }) => {
    for (const localized of [path, `/vi${path}`]) {
      await page.goto(localized);
      const en = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute("href");
      const vi = await page.locator('link[rel="alternate"][hreflang="vi"]').getAttribute("href");
      expect(new URL(en!).pathname).toBe(path);
      expect(new URL(vi!).pathname).toBe(`/vi${path}`);
    }
  });
}
