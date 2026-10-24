import { expect, test } from "@playwright/test";
import type { Browser, BrowserContextOptions, Locator, Page, TestInfo } from "@playwright/test";

const ROOT = "systems-observatory";
const LINKS = `${ROOT} a[data-project-id]`;
const CANVAS = `${ROOT} .scene-visual canvas`;
const PAUSE = `${ROOT} [data-scene-pause]`;
const sceneChunk = /\/_astro\/(?:observatory-renderer|three)(?:[.\/-])[^?]*\.js(?:\?|$)/i;

function observeSceneRequests(page: Page) {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (sceneChunk.test(request.url())) requests.push(request.url());
  });
  return requests;
}

function observeErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function nextPaints(page: Page) {
  await page.evaluate(() => {
    const { promise, resolve } = Promise.withResolvers<void>();
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    return promise;
  });
}

async function independentContext(
  browser: Browser,
  baseURL: string | undefined,
  options: BrowserContextOptions = {},
) {
  return browser.newContext({
    baseURL,
    viewport: { width: 1512, height: 900 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    reducedMotion: "no-preference",
    colorScheme: "light",
    ...options,
  });
}

async function expectLinks(page: Page) {
  const links = page.locator(LINKS);
  await expect(links).toHaveCount(6);
  const records = await links.evaluateAll((nodes) =>
    nodes.map((node) => ({
      id: node.getAttribute("data-project-id"),
      kind: node.getAttribute("data-project-kind"),
      href: node.getAttribute("href"),
    })),
  );
  expect(new Set(records.map((record) => record.id)).size).toBe(6);
  for (const record of records) {
    expect(record.kind).toMatch(/^(original|fork|derived|profile)$/);
    expect(record.href).toMatch(/^(\/|https:\/\/)/);
  }
}

async function expectStatic(page: Page, state: "static" | "unavailable" = "static") {
  await expect(page.locator(ROOT)).toHaveAttribute("data-scene-state", state);
  await expect(page.locator(`${ROOT} .scene-fallback`)).toBeVisible();
  await expect(page.locator(PAUSE)).toBeHidden();
  await expect(page.locator(CANVAS)).toHaveCount(0);
  await expectLinks(page);
}

async function followProject(page: Page) {
  const link = page.locator(LINKS).first();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page).toHaveURL(new URL(href!, page.url()).href);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

async function expectReady(page: Page) {
  await expect(page.locator(ROOT)).toHaveAttribute("data-scene-state", "ready");
  await expect(page.locator(CANVAS)).toHaveCount(1);
  await expect(page.locator(CANVAS)).toBeVisible();
  await expect(page.locator(`${ROOT} .scene-fallback`)).toBeHidden();
  await expect(page.locator(PAUSE)).toBeVisible();
  await expect(page.locator(PAUSE)).toHaveAttribute("aria-pressed", "false");
}

async function pause(page: Page) {
  await page.locator(PAUSE).click();
  await expect(page.locator(ROOT)).toHaveAttribute("data-scene-state", "paused");
  await expect(page.locator(PAUSE)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(PAUSE)).toBeFocused();
}

async function screenshot(canvas: Locator) {
  return canvas.screenshot({ animations: "allow", caret: "hide" });
}

async function attachFrame(testInfo: TestInfo, name: string, canvas: Locator) {
  const frame = await screenshot(canvas);
  await testInfo.attach(name, { body: frame, contentType: "image/png" });
  return frame;
}

async function expectFrameChanges(canvas: Locator, previous: Buffer) {
  await expect.poll(async () => !(await screenshot(canvas)).equals(previous)).toBe(true);
}

async function expectFrameStill(page: Page, canvas: Locator) {
  const frame = await screenshot(canvas);
  for (let sample = 0; sample < 3; sample++) {
    await nextPaints(page);
    expect((await screenshot(canvas)).equals(frame), "paused canvas must remain unchanged").toBe(
      true,
    );
  }
  return frame;
}

// These cases use the actual configured desktop browser and real WebGL2. Failure to
// initialize is a failure, not a reason to skip or replace the canvas with a mock.
test.describe("observatory real WebGL", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "ready-path coverage requires desktop input");
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  });

  test("renders a real first frame with six native project links", async ({ page }, testInfo) => {
    const requests = observeSceneRequests(page);
    const errors = observeErrors(page);
    await page.goto("/");
    await expectReady(page);
    await expectLinks(page);
    expect(requests.some((url) => url.includes("observatory-renderer"))).toBe(true);
    const canvas = page.locator(CANVAS);
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
    await expect(canvas).toHaveAttribute("tabindex", "-1");
    const context = await canvas.evaluate((element) => {
      const gl = (element as HTMLCanvasElement).getContext("webgl2");
      return (
        gl && {
          version: String(gl.getParameter(gl.VERSION)),
          width: gl.drawingBufferWidth,
          height: gl.drawingBufferHeight,
          lost: gl.isContextLost(),
        }
      );
    });
    expect(context?.version).toContain("WebGL 2.0");
    expect(context?.lost).toBe(false);
    expect(context?.width).toBeGreaterThan(0);
    expect(context?.height).toBeGreaterThan(0);
    await pause(page);
    const frame = await attachFrame(testInfo, "real-webgl-first-frame", canvas);
    // Inspect the captured compositor output, not a mocked drawing buffer or a
    // production test counter. A flat/empty canvas is not a successful scene.
    const uniqueColors = await page.evaluate(
      async (bytes) => {
        const bitmap = await createImageBitmap(
          new Blob([new Uint8Array(bytes)], { type: "image/png" }),
        );
        const image = document.createElement("canvas");
        image.width = bitmap.width;
        image.height = bitmap.height;
        const context = image.getContext("2d")!;
        context.drawImage(bitmap, 0, 0);
        bitmap.close();
        const pixels = context.getImageData(0, 0, image.width, image.height).data;
        const colors = new Set<number>();
        for (let index = 0; index < pixels.length; index += 4) {
          colors.add((pixels[index]! << 16) | (pixels[index + 1]! << 8) | pixels[index + 2]!);
        }
        return colors.size;
      },
      [...frame],
    );
    expect(uniqueColors).toBeGreaterThan(64);
    const links = page.locator(LINKS);
    await links.first().focus();
    for (let index = 1; index < 6; index++) {
      await page.keyboard.press("Tab");
      await expect(links.nth(index)).toBeFocused();
    }
    await page.keyboard.press("Tab");
    await expect(page.locator(PAUSE)).toBeFocused();
    await page.keyboard.press("Space");
    await expectReady(page);
    await expect(page.locator(PAUSE)).toBeFocused();
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate((selector) => document.activeElement?.closest(selector) === null, ROOT),
    ).toBe(true);
    await followProject(page);
    expect(errors).toEqual([]);
  });

  test("pause stops rendered motion and resume preserves focus while motion returns", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await expectReady(page);
    const button = page.locator(PAUSE);
    const runningLabel = await button.innerText();
    await pause(page);
    await expect(button).not.toHaveText(runningLabel);
    const canvas = page.locator(CANVAS);
    await expectFrameStill(page, canvas);
    const pausedFrame = await attachFrame(testInfo, "paused-frame", canvas);
    await button.click();
    await expectReady(page);
    await expect(button).toBeFocused();
    await expect(button).toHaveText(runningLabel);
    await expectFrameChanges(canvas, pausedFrame);
    const runningFrame = await screenshot(canvas);
    await expectFrameChanges(canvas, runningFrame);
  });

  test("theme and native-link focus or hover redraw while motion remains paused", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await expectReady(page);
    await pause(page);
    const canvas = page.locator(CANVAS);
    const light = await screenshot(canvas);
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(ROOT)).toHaveAttribute("data-scene-state", "paused");
    await expectFrameChanges(canvas, light);
    await expectFrameStill(page, canvas);
    await attachFrame(testInfo, "paused-dark-frame", canvas);

    const links = page.locator(LINKS);
    await links.nth(0).focus();
    await expect(links.nth(0)).toBeFocused();
    const firstHighlight = await screenshot(canvas);
    const scroll = await page.evaluate(() => window.scrollY);
    await links.nth(1).focus();
    await expect(links.nth(1)).toBeFocused();
    await expectFrameChanges(canvas, firstHighlight);
    expect(await page.evaluate(() => window.scrollY)).toBe(scroll);
    await expect(page.locator(ROOT)).toHaveAttribute("data-scene-state", "paused");
    await links.nth(1).evaluate((element) => (element as HTMLElement).blur());
    const unhighlighted = await expectFrameStill(page, canvas);
    await links.nth(0).hover();
    await expectFrameChanges(canvas, unhighlighted);
    await expect(page.locator(PAUSE)).toHaveAttribute("aria-pressed", "true");
    await attachFrame(testInfo, "paused-project-highlight", canvas);
  });

  test("context loss restores usable fallback and does not retry during this visit", async ({
    page,
  }) => {
    const errors = observeErrors(page);
    const requests = observeSceneRequests(page);
    await page.goto("/");
    await expectReady(page);
    const requestCount = requests.length;
    const lost = await page.locator(CANVAS).evaluate((element) => {
      const extension = (element as HTMLCanvasElement)
        .getContext("webgl2")
        ?.getExtension("WEBGL_lose_context");
      if (!extension) return false;
      extension.loseContext();
      return true;
    });
    expect(lost, "the real WebGL context must support the context-loss test").toBe(true);
    await expectStatic(page, "unavailable");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await nextPaints(page);
    await expectStatic(page, "unavailable");
    expect(requests).toHaveLength(requestCount);
    await followProject(page);
    expect(errors).toEqual([]);
  });

  test("runtime reduced motion disposes enhancement and can reinitialize", async ({ page }) => {
    const errors = observeErrors(page);
    await page.goto("/");
    await expectReady(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectStatic(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expectReady(page);
    await pause(page);
    expect(errors).toEqual([]);
  });

  test("desktop to mobile to desktop rebuilds once and resizes a paused frame", async ({
    page,
  }) => {
    const errors = observeErrors(page);
    await page.goto("/");
    await expectReady(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await expectStatic(page);
    await page.setViewportSize({ width: 1512, height: 900 });
    await expectReady(page);
    await pause(page);
    const originalSize = await page.locator(CANVAS).evaluate((element) => ({
      width: (element as HTMLCanvasElement).width,
      height: (element as HTMLCanvasElement).height,
    }));
    await page.setViewportSize({ width: 1100, height: 900 });
    await expect(page.locator(ROOT)).toHaveAttribute("data-scene-state", "paused");
    await expect
      .poll(async () =>
        page.locator(CANVAS).evaluate((element) => (element as HTMLCanvasElement).width),
      )
      .not.toBe(originalSize.width);
    const sizing = await page.locator(CANVAS).evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      const bounds = canvas.getBoundingClientRect();
      return {
        width: canvas.width,
        height: canvas.height,
        cssWidth: bounds.width,
        cssHeight: bounds.height,
      };
    });
    expect(sizing.width).toBeGreaterThan(0);
    expect(sizing.height).toBeGreaterThan(0);
    expect(sizing.width / sizing.cssWidth).toBeLessThanOrEqual(1.5 + 0.01);
    expect(sizing.height / sizing.cssHeight).toBeLessThanOrEqual(1.5 + 0.01);
    await expectFrameStill(page, page.locator(CANVAS));
    expect(errors).toEqual([]);
  });

  test("native away and back navigation has one live canvas and one pause handler", async ({
    page,
  }) => {
    const errors = observeErrors(page);
    await page.goto("/");
    await expectReady(page);
    await followProject(page);
    await expect(page.locator(ROOT)).toHaveCount(0);
    await page.goBack();
    await expectReady(page);
    await expectLinks(page);
    await expect(page.locator(PAUSE)).toHaveCount(1);
    await pause(page);
    await page.locator(PAUSE).click();
    await expectReady(page);
    await followProject(page);
    await page.goBack();
    await expectReady(page);
    await pause(page);
    await expectFrameStill(page, page.locator(CANVAS));
    expect(errors).toEqual([]);
  });

  test("loading retains fallback and a stale import cannot attach after eligibility is lost", async ({
    page,
  }) => {
    const errors = observeErrors(page);
    const requested = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    await page.route(sceneChunk, async (route) => {
      requested.resolve();
      await release.promise;
      await route.continue();
    });
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await requested.promise;
      await expect(page.locator(ROOT)).toHaveAttribute("data-scene-state", "loading");
      await expect(page.locator(`${ROOT} .scene-fallback`)).toBeVisible();
      await expect(page.locator(PAUSE)).toBeHidden();
      await expectLinks(page);
      await page.setViewportSize({ width: 390, height: 844 });
      await expectStatic(page);
      const response = page.waitForResponse(sceneChunk);
      release.resolve();
      await (await response).finished();
      await nextPaints(page);
      await expectStatic(page);
      await page.setViewportSize({ width: 1512, height: 900 });
      await expectReady(page);
      await pause(page);
      expect(errors).toEqual([]);
    } finally {
      release.resolve();
      await page.unrouteAll({ behavior: "wait" });
    }
  });
});

const fallbackCases: {
  name: string;
  options?: BrowserContextOptions;
  saveData?: boolean;
  expectedMedia?: string;
}[] = [
  {
    name: "mobile",
    options: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  },
  {
    name: "coarse primary pointer",
    options: { hasTouch: true },
    expectedMedia: "(pointer: coarse)",
  },
  {
    name: "reduced motion",
    options: { reducedMotion: "reduce" },
    expectedMedia: "(prefers-reduced-motion: reduce)",
  },
  { name: "save-data", saveData: true },
  { name: "JavaScript disabled", options: { javaScriptEnabled: false } },
];

// Each fallback case creates its own explicit environment, so running only the
// desktop or only the mobile Playwright project still exercises every gate.
for (const fallback of fallbackCases) {
  test(`observatory ${fallback.name} keeps native fallback without downloading Three`, async ({
    browser,
    baseURL,
  }) => {
    const context = await independentContext(browser, baseURL, fallback.options);
    try {
      if (fallback.saveData) {
        await context.addInitScript(() => {
          const connection = new EventTarget();
          Object.defineProperty(connection, "saveData", { value: true });
          Object.defineProperty(navigator, "connection", { configurable: true, value: connection });
        });
      }
      const page = await context.newPage();
      const requests = observeSceneRequests(page);
      const errors = observeErrors(page);
      await page.goto("/");
      if (fallback.options?.javaScriptEnabled !== false) {
        await page.evaluate(() =>
          customElements.whenDefined("systems-observatory").then(() => undefined),
        );
        await nextPaints(page);
        if (fallback.expectedMedia) {
          expect(
            await page.evaluate((media) => matchMedia(media).matches, fallback.expectedMedia),
          ).toBe(true);
        }
        if (fallback.saveData) {
          expect(await page.evaluate(() => Reflect.get(navigator, "connection").saveData)).toBe(
            true,
          );
        }
      }
      await expectStatic(page);
      expect(requests).toEqual([]);
      await followProject(page);
      expect(requests).toEqual([]);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

for (const failure of ["renderer request blocked", "WebGL creation failure"] as const) {
  test(`observatory ${failure} preserves fallback and working links`, async ({
    browser,
    baseURL,
  }) => {
    const context = await independentContext(browser, baseURL);
    try {
      if (failure === "WebGL creation failure") {
        await context.addInitScript(() => {
          const original = HTMLCanvasElement.prototype.getContext;
          Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
            configurable: true,
            value(this: HTMLCanvasElement, name: string, ...args: unknown[]) {
              if (["webgl2", "webgl", "experimental-webgl"].includes(name)) return null;
              return Reflect.apply(original, this, [name, ...args]);
            },
          });
        });
      }
      const page = await context.newPage();
      const requests = observeSceneRequests(page);
      const errors = observeErrors(page);
      if (failure === "renderer request blocked") {
        await page.route(sceneChunk, (route) => route.abort("failed"));
      }
      await page.goto("/");
      await expectStatic(page, "unavailable");
      expect(requests.some((url) => url.includes("observatory-renderer"))).toBe(true);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.setViewportSize({ width: 1512, height: 900 });
      await nextPaints(page);
      await expectStatic(page, "unavailable");
      await followProject(page);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}
