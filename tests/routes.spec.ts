import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

// The built public sitemap is the route inventory, not a second content catalogue.
const sitemap = readFileSync(new URL("../dist/sitemap-0.xml", import.meta.url), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(match[1]!).pathname,
);

for (const path of routes) {
  const lang = path.startsWith("/vi/") ? "vi" : "en";
  test(`${path} serves a complete ${lang} document without sideways scrolling`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(path);
    for (const locale of ["en", "vi", "x-default"]) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveCount(1);
    }
    const bounds = await page.evaluate(() => {
      window.scrollTo(9999, 0);
      const panned = window.scrollX;
      window.scrollTo(0, 0);
      return {
        panned,
        width: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      };
    });
    expect(bounds.panned).toBe(0);
    expect(bounds.width).toBeLessThanOrEqual(bounds.viewport + 1);
    expect(errors).toEqual([]);
  });
}

test("local work links resolve to public pages", async ({ page, request }) => {
  const links = new Set<string>();
  for (const path of ["/", "/work/", "/vi/", "/vi/work/"]) {
    await page.goto(path);
    const localLinks = await page
      .locator("main a[href]")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => (node as HTMLAnchorElement).getAttribute("href")!)
          .filter((href) => /^\/(vi\/)?work\//.test(href)),
      );
    localLinks.forEach((href) => links.add(href.split("#")[0]!));
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
});

test("TOC fragments reach real sections below the header", async ({ page }) => {
  const articlePath = routes.find((path) => path.includes("ai-gateway-control-and-data-planes"))!;
  await page.goto(articlePath);
  const tocLink = page.locator('.article-toc a[href^="#"]').first();
  const fragment = await tocLink.getAttribute("href");
  await tocLink.click();
  const section = page.locator(fragment!);
  await expect(section).toBeVisible();
  await expect(section.getByRole("heading")).toBeVisible();
  await expect
    .poll(async () => {
      const sectionBox = await section.boundingBox();
      const headerBox = await page.getByRole("banner").boundingBox();
      return sectionBox!.y >= Math.max(0, headerBox!.y + headerBox!.height) - 1;
    })
    .toBe(true);
});

// Astro preview enforces trailingSlash before serving static redirect documents.
// Slashless legacy redirects are an HTTP server contract, exercised with BASE_URL.
const legacySuffixes = process.env.BASE_URL ? ["", "/"] : ["/"];

for (const prefix of ["", "/vi"]) {
  for (const suffix of legacySuffixes) {
    test(`legacy article ${prefix || "en"}${suffix || " without slash"} reaches its replacement`, async ({
      page,
    }) => {
      const destination = `${prefix}/work/blue-green-deploys-on-a-shared-vps/`;
      await page.goto(`${prefix}/work/omniroute-vps-workflow${suffix}`);
      await expect(page).toHaveURL(new RegExp(`${destination}$`));
      await expect(page.locator("main#main-content")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", prefix ? "vi" : "en");
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical!).pathname).toBe(destination);
    });
  }
}

test("unknown routes return a real noindex 404 with working recovery links", async ({
  page,
  request,
}) => {
  const response = await page.goto("/this-route-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByTestId("not-found")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"], link[rel="alternate"]')).toHaveCount(0);
  for (const path of ["/", "/vi/", "/work/", "/vi/work/"]) {
    await expect(page.locator(`main a[href="${path}"]`)).toBeVisible();
    expect((await request.get(path)).status()).toBe(200);
  }
});
