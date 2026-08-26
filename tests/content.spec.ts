import { expect, test } from "@playwright/test";
import { allPullRequests, contributions, OMNIROUTE, totals } from "../src/data/contributions";
import { site } from "../src/data/site";

test.describe("content matches the data layer", () => {
  test("the contributions table has one row per pull request", async ({ page }) => {
    await page.goto("/work/");
    await expect(page.getByTestId("pr-row")).toHaveCount(allPullRequests.length);
  });

  /**
   * The value of this work is that the patches were merged *upstream*. A link
   * pointing at the personal fork instead would quietly misrepresent that, so
   * it is asserted rather than trusted.
   */
  test("every pull request link points at the upstream repository", async ({ page }) => {
    await page.goto("/work/");
    const links = page.locator(`a[href*="/pull/"]`);
    const count = await links.count();
    expect(count).toBe(allPullRequests.length);

    for (let index = 0; index < count; index += 1) {
      const href = await links.nth(index).getAttribute("href");
      expect(href).toContain(`${OMNIROUTE.url}/pull/`);
      expect(href).not.toContain(`/${site.handle}/`);
    }
  });

  test("the home page totals are the computed totals", async ({ page }) => {
    await page.goto("/");
    const statline = page.getByTestId("statline");
    await expect(statline).toContainText(totals.additions.toLocaleString("en-US"));
    await expect(statline).toContainText(totals.deletions.toLocaleString("en-US"));
    await expect(statline).toContainText(String(totals.files));
    await expect(statline).toContainText(String(totals.prs));
  });

  test("repository counts are presented as a stamped snapshot", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("statline")).toContainText(OMNIROUTE.statsAsOf);
  });

  test("each detail page shows its own diff and links its own pull requests", async ({ page }) => {
    for (const contribution of contributions) {
      await page.goto(`/work/${contribution.slug}/`);
      for (const pr of contribution.prs) {
        await expect(
          page.locator(`a[href="${OMNIROUTE.url}/pull/${pr.number}"]`).first(),
        ).toBeVisible();
      }
    }
  });

  test("fork work is labelled separately from merged upstream work", async ({ page }) => {
    await page.goto("/work/");
    await expect(page.getByTestId("personal-work")).toBeVisible();
    await expect(page.getByTestId("personal-work")).toContainText(/fork/i);
  });
});

test.describe("contact degrades gracefully", () => {
  test("only configured channels are rendered, with no dead links", async ({ page }) => {
    await page.goto("/");
    const list = page.getByTestId("contact-list");
    await expect(list).toBeVisible();

    await expect(page.getByTestId("contact-github")).toHaveAttribute("href", site.github);

    const hrefs = await list
      .locator("a")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
    for (const href of hrefs) {
      expect(href).toBeTruthy();
      expect(href).not.toBe("null");
      expect(href).not.toBe("undefined");
    }

    await expect(page.getByTestId("contact-linkedin")).toHaveCount(site.linkedin ? 1 : 0);
    await expect(page.getByTestId("contact-cv")).toHaveCount(site.cv ? 1 : 0);
  });

  test("the address is assembled in the browser, not published in the markup", async ({ page }) => {
    const response = await page.goto("/");
    const html = (await response?.text()) ?? "";
    // What matters is that no harvestable address exists in the served markup.
    // The word `mailto:` appearing inside the assembling script is harmless,
    // because the two halves it joins are still stored apart.
    expect(html).not.toContain(`${site.email.user}@${site.email.domain}`);
    expect(html).not.toContain(`mailto:${site.email.user}`);

    await expect(page.getByTestId("contact-email")).toHaveAttribute(
      "href",
      `mailto:${site.email.user}@${site.email.domain}`,
    );
  });
});
