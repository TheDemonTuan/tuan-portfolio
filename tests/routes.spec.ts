import { expect, test } from "@playwright/test";
import { articles } from "../src/data/articles";
import { contributions } from "../src/data/contributions";

/**
 * Routes are derived from the data layer, not listed by hand, so adding a
 * contribution automatically extends this suite instead of silently escaping it.
 */
const englishRoutes = [
  "/",
  "/work/",
  "/about/",
  "/colophon/",
  ...contributions.map((contribution) => `/work/${contribution.slug}/`),
  ...articles.map((article) => `/work/${article.slug}/`),
];

const routes = [
  ...englishRoutes.map((path) => ({ path, lang: "en" })),
  ...englishRoutes.map((path) => ({ path: `/vi${path}`, lang: "vi" })),
];

for (const { path, lang } of routes) {
  test(`${path} renders as a complete ${lang} document`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    const response = await page.goto(path);
    expect(response?.status(), `${path} should not be an error page`).toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    expect(errors, `${path} logged errors`).toEqual([]);
  });

  test(`${path} does not scroll horizontally`, async ({ page }) => {
    await page.goto(path);
    const box = await page.evaluate(() => {
      // Measuring the width alone is not enough: what matters to a reader is
      // whether the page can actually be panned sideways, so try to pan it.
      window.scrollTo(9999, 0);
      const panned = window.scrollX;
      window.scrollTo(0, 0);
      return {
        panned,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    expect(box.panned, `${path} can be panned sideways`).toBe(0);
    expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth + 1);
  });
}

test("generates exactly one detail page per contribution", async ({ page }) => {
  for (const contribution of contributions) {
    const response = await page.goto(`/work/${contribution.slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.getByTestId("pr-number")).toBeVisible();
  }
});

test("renders the custom not-found page for an unknown path", async ({ page }) => {
  await page.goto("/this-route-does-not-exist/");
  await expect(page.getByTestId("not-found")).toBeVisible();
});

test("the not-found page claims no canonical URL and no alternates", async ({ page }) => {
  // It answers on every unmatched path, so indexing it — or pointing hreflang
  // at a `/vi/404/` that does not exist — would be a lie about the site's shape.
  await page.goto("/404/");
  await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
});
