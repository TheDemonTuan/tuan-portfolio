import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders the verified portfolio content and external project links", async ({ page }) => {
  await expect(page).toHaveTitle(/Nguyễn Viết Tuấn/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Xây sản phẩm số");
  await expect(page.getByRole("heading", { name: "OmniRoute" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mã nguồn" })).toHaveAttribute(
    "href",
    "https://github.com/TheDemonTuan/OmniRoute",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
});

test("switches language and persists it after reload", async ({ page, isMobile }) => {
  if (isMobile) await page.getByRole("button", { name: "Mở menu" }).click();
  await page.getByRole("button", { name: "Đổi sang tiếng Anh" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Building digital");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("navigation")).toHaveAttribute("aria-label", "Main navigation");
});

test("supports keyboard navigation and skip link", async ({ page, isMobile }) => {
  if (isMobile) test.skip();
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Bỏ qua đến nội dung" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("opens and closes the mobile navigation", async ({ page, isMobile }) => {
  if (!isMobile) test.skip();
  const menu = page.getByRole("button", { name: "Mở menu" });
  await menu.click();
  const navigation = page.getByRole("navigation");
  const workLink = navigation.getByRole("link", { name: "Dự án", exact: true });
  await expect(workLink).toBeVisible();
  await workLink.click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("button", { name: "Mở menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("has no horizontal overflow", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("renders the custom not-found page", async ({ page }) => {
  await page.goto("/missing-page");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Lạc đường rồi");
  await expect(page.getByRole("link", { name: "Về trang chính" })).toBeVisible();
});
